"""Shared fixtures for coodie vs cqlengine benchmarks.

Provides a ScyllaDB testcontainer, cqlengine connection setup, and coodie
driver registration.  All benchmark files share these session-scoped fixtures
so the database container is started only once.

Use ``--driver-type`` to choose the coodie driver backend:

- ``scylla``   (default) — CassandraDriver backed by scylla-driver
- ``cassandra`` — CassandraDriver backed by cassandra-driver
- ``acsylla``  — AcsyllaDriver backed by the async-native acsylla library

The **cqlengine** side always uses cassandra-driver / scylla-driver regardless
of ``--driver-type`` (cqlengine has no acsylla backend).
"""

from __future__ import annotations

import asyncio
from typing import Any
from uuid import uuid4

import pytest

from tests.conftest_scylla import create_acsylla_session, create_cql_session  # noqa: F401
from tests.conftest_scylla import scylla_container  # noqa: F401


# ---------------------------------------------------------------------------
# CLI option
# ---------------------------------------------------------------------------


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--driver-type",
        default="scylla",
        choices=["scylla", "cassandra", "acsylla"],
        help="Coodie driver backend for benchmarks (default: scylla)",
    )


@pytest.fixture(scope="session")
def driver_type(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("--driver-type")


# ---------------------------------------------------------------------------
# Raw cassandra-driver session (used by cqlengine and coodie when not acsylla)
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def cql_session(scylla_container: Any):  # noqa: F811
    """Return a cassandra-driver ``Session`` connected to the bench keyspace."""
    session, cluster = create_cql_session(scylla_container, "bench_ks")
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
        pytest.skip("cqlengine not available (install cassandra-driver or scylla-driver)")

    cql_conn.register_connection("bench", session=cql_session)
    cql_conn.set_default_connection("bench")

    from benchmarks.models_cqlengine import CqlProduct, CqlReview, CqlEvent
    from benchmarks.models_argus_cqlengine import (
        CqlArgusUser,
        CqlArgusTestRun,
        CqlArgusEvent,
        CqlArgusNotification,
        CqlArgusComment,
    )

    sync_table(CqlProduct, keyspaces=["bench_ks"])
    sync_table(CqlReview, keyspaces=["bench_ks"])
    sync_table(CqlEvent, keyspaces=["bench_ks"])
    sync_table(CqlArgusUser, keyspaces=["bench_ks"])
    sync_table(CqlArgusTestRun, keyspaces=["bench_ks"])
    sync_table(CqlArgusEvent, keyspaces=["bench_ks"])
    sync_table(CqlArgusNotification, keyspaces=["bench_ks"])
    sync_table(CqlArgusComment, keyspaces=["bench_ks"])
    yield
    cql_conn.unregister_connection("bench")


# ---------------------------------------------------------------------------
# coodie driver setup
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def coodie_connection(cql_session: Any, scylla_container: Any, driver_type: str):  # noqa: F811
    """Register a coodie driver — backend chosen by ``--driver-type``.

    * ``scylla`` / ``cassandra`` — CassandraDriver sharing the cql_session
    * ``acsylla`` — AcsyllaDriver with its own async-native session
    """
    from coodie.drivers import _registry, init_coodie, register_driver

    _registry.clear()

    if driver_type == "acsylla":
        try:
            import acsylla  # type: ignore[import-untyped] # noqa: F401
        except ImportError:
            pytest.skip("acsylla is not installed")

        from coodie.drivers.acsylla import AcsyllaDriver

        loop = asyncio.new_event_loop()
        session = loop.run_until_complete(create_acsylla_session(scylla_container, "bench_ks"))
        driver = AcsyllaDriver(session=session, default_keyspace="bench_ks", loop=loop)
        register_driver("default", driver, default=True)
    else:
        driver = init_coodie(session=cql_session, keyspace="bench_ks", driver_type=driver_type)

    from benchmarks.models_coodie import CoodieProduct, CoodieReview, CoodieEvent
    from benchmarks.models_argus_coodie import (
        CoodieArgusUser,
        CoodieArgusTestRun,
        CoodieArgusEvent,
        CoodieArgusNotification,
        CoodieArgusComment,
    )

    CoodieProduct.sync_table()
    CoodieReview.sync_table()
    CoodieEvent.sync_table()
    CoodieArgusUser.sync_table()
    CoodieArgusTestRun.sync_table()
    CoodieArgusEvent.sync_table()
    CoodieArgusNotification.sync_table()
    CoodieArgusComment.sync_table()
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
