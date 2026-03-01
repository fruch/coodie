"""Shared ScyllaDB testcontainer fixtures.

Import these into integration test or benchmark conftest.py files to avoid
duplicating the container setup, address translator, and session creation.
"""

from __future__ import annotations

import time
from typing import Any

import pytest


class LocalhostTranslator:
    """Translate any discovered host address to 127.0.0.1.

    When ScyllaDB runs in Docker, system.local advertises the container-internal
    IP (e.g. 172.17.0.3) as the broadcast RPC address.  The cassandra-driver
    replaces its host-table entry for the contact point with that internal IP and
    then tries to reconnect there — which fails on a CI runner.

    By translating every address back to 127.0.0.1 the driver always reaches the
    node through the mapped host port, regardless of what Scylla advertises.
    """

    def translate(self, addr: str) -> str:
        return "127.0.0.1"


@pytest.fixture(scope="session")
def scylla_container():
    """Start a ScyllaDB container once for the entire test session.

    Uses DockerContainer directly to avoid ScyllaContainer._connect(), which
    calls get_cluster() with the container's internal Docker IP but the mapped
    host port — an incorrect combination that causes NoHostAvailable on GHA.
    """
    try:
        from testcontainers.core.container import DockerContainer  # type: ignore[import-untyped]
        from testcontainers.core.waiting_utils import wait_for_logs  # type: ignore[import-untyped]
    except ImportError as exc:
        pytest.skip(f"testcontainers not installed: {exc}")

    with (
        DockerContainer("scylladb/scylla:latest")
        .with_command("--smp 1 --memory 512M --developer-mode 1 --skip-wait-for-gossip-to-settle=0")
        .with_exposed_ports(9042) as container
    ):
        wait_for_logs(container, "Starting listening for CQL clients", timeout=120)
        yield container


def create_cql_session(scylla_container: Any, keyspace: str) -> Any:
    """Create a cassandra-driver Session connected to the given keyspace.

    Handles the retry loop for container startup and creates the keyspace
    if it doesn't exist.

    Returns ``(session, cluster)`` so the caller can shut down the cluster.
    """
    from cassandra.cluster import Cluster, NoHostAvailable  # type: ignore[import-untyped]

    port = int(scylla_container.get_exposed_port(9042))
    cluster = Cluster(
        ["127.0.0.1"],
        port=port,
        connect_timeout=10,
        address_translator=LocalhostTranslator(),
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
        f"CREATE KEYSPACE IF NOT EXISTS {keyspace} "
        "WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}"
    )
    return session, cluster


async def create_acsylla_session(scylla_container: Any, keyspace: str) -> Any:
    """Create an acsylla session connected to the given keyspace.

    Creates the keyspace if it doesn't exist, then returns a session with
    the keyspace already set.
    """
    import acsylla  # type: ignore[import-untyped]

    container_info = scylla_container.get_wrapped_container()
    container_info.reload()
    networks = container_info.attrs["NetworkSettings"]["Networks"]
    container_ip = next(iter(networks.values()))["IPAddress"]

    cluster = acsylla.create_cluster([container_ip], port=9042)
    session = await cluster.create_session()
    await session.execute(
        acsylla.create_statement(
            f"CREATE KEYSPACE IF NOT EXISTS {keyspace} "
            "WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}",
            parameters=0,
        )
    )
    await session.close()
    return await cluster.create_session(keyspace=keyspace)


async def create_python_rs_session(scylla_container: Any, keyspace: str) -> Any:
    """Create a python-rs-driver session connected to the given keyspace.

    Creates the keyspace if it doesn't exist via a temporary session,
    then returns a new session.  Uses the container's internal IP since
    python-rs-driver does not need an address translator.
    """
    from scylla.session_builder import SessionBuilder  # type: ignore[import-untyped]

    container_info = scylla_container.get_wrapped_container()
    container_info.reload()
    networks = container_info.attrs["NetworkSettings"]["Networks"]
    container_ip = next(iter(networks.values()))["IPAddress"]

    builder = SessionBuilder(contact_points=[container_ip], port=9042)
    session = await builder.connect()

    # Create keyspace via raw CQL (USE keyspace is not supported)
    await session.execute(
        f"CREATE KEYSPACE IF NOT EXISTS {keyspace} "
        "WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}",
        None,
    )
    return session
