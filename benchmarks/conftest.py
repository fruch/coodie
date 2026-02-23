"""Shared fixtures for coodie vs cqlengine benchmarks.

Provides a ScyllaDB testcontainer, cqlengine connection setup, and coodie
driver registration.  All benchmark files share these session-scoped fixtures
so the database container is started only once.
"""

from __future__ import annotations

import time
from typing import Any
from uuid import uuid4

import pytest


# ---------------------------------------------------------------------------
# ScyllaDB container (session-scoped)
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def scylla_container():
    """Start a ScyllaDB container once for the entire benchmark session."""
    try:
        from testcontainers.core.container import DockerContainer
        from testcontainers.core.waiting_utils import wait_for_logs
    except ImportError:
        pytest.skip("testcontainers not installed")

    with (
        DockerContainer("scylladb/scylla:latest")
        .with_command(
            "--smp 1 --memory 512M --developer-mode 1 "
            "--skip-wait-for-gossip-to-settle=0"
        )
        .with_exposed_ports(9042) as container
    ):
        wait_for_logs(container, "Starting listening for CQL clients", timeout=120)
        yield container


# ---------------------------------------------------------------------------
# Address translator for Docker networking
# ---------------------------------------------------------------------------


class _LocalhostTranslator:
    """Translate container-internal IPs back to 127.0.0.1."""

    def translate(self, addr: str) -> str:
        return "127.0.0.1"


# ---------------------------------------------------------------------------
# Raw cassandra-driver session (used by both cqlengine and coodie)
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def cql_session(scylla_container: Any):
    """Return a cassandra-driver ``Session`` connected to the test keyspace."""
    try:
        from cassandra.cluster import Cluster, NoHostAvailable
    except ImportError:
        pytest.skip("cassandra-driver / scylla-driver not installed")

    port = int(scylla_container.get_exposed_port(9042))
    cluster = Cluster(
        ["127.0.0.1"],
        port=port,
        connect_timeout=10,
        address_translator=_LocalhostTranslator(),
    )

    for attempt in range(10):
        try:
            session = cluster.connect()
            break
        except NoHostAvailable:
            if attempt == 9:
                raise
            time.sleep(2)

    session.execute(
        "CREATE KEYSPACE IF NOT EXISTS bench_ks "
        "WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}"
    )
    session.set_keyspace("bench_ks")
    yield session
    cluster.shutdown()


# ---------------------------------------------------------------------------
# cqlengine setup
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def cqlengine_connection(cql_session: Any):
    """Register cqlengine connection and sync tables."""
    try:
        from cassandra.cqlengine import connection as cql_conn
        from cassandra.cqlengine.management import sync_table
    except ImportError:
        pytest.skip(
            "cqlengine not available (install cassandra-driver or scylla-driver)"
        )

    cql_conn.register_connection("bench", session=cql_session)
    cql_conn.set_default_connection("bench")

    from benchmarks.models_cqlengine import CqlProduct, CqlReview, CqlEvent

    sync_table(CqlProduct, keyspaces=["bench_ks"])
    sync_table(CqlReview, keyspaces=["bench_ks"])
    sync_table(CqlEvent, keyspaces=["bench_ks"])
    yield
    cql_conn.unregister_connection("bench")


# ---------------------------------------------------------------------------
# coodie driver setup
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def coodie_connection(cql_session: Any):
    """Register the coodie CassandraDriver backed by the same session."""
    from coodie.drivers import _registry, init_coodie

    _registry.clear()
    driver = init_coodie(session=cql_session, keyspace="bench_ks")

    from benchmarks.models_coodie import CoodieProduct, CoodieReview, CoodieEvent

    CoodieProduct.sync_table()
    CoodieReview.sync_table()
    CoodieEvent.sync_table()
    yield driver
    _registry.clear()


# ---------------------------------------------------------------------------
# Combined setup (ensures both sides are ready)
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def bench_env(cqlengine_connection: Any, coodie_connection: Any):
    """Ensure both cqlengine and coodie are fully initialised."""
    yield


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def make_uuid():
    """Return a new random UUID."""
    return uuid4()
