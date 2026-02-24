from __future__ import annotations

from typing import Any

from coodie.drivers.base import AbstractDriver
from coodie.exceptions import ConfigurationError

_registry: dict[str, AbstractDriver] = {}
_default_driver_name: str | None = None


def register_driver(
    name: str,
    driver: AbstractDriver,
    default: bool = False,
) -> None:
    global _default_driver_name
    _registry[name] = driver
    if default or _default_driver_name is None:
        _default_driver_name = name


def get_driver(name: str | None = None) -> AbstractDriver:
    target = name or _default_driver_name
    if target is None or target not in _registry:
        raise ConfigurationError("No coodie driver registered. Call init_coodie() first.")
    return _registry[target]


def init_coodie(
    hosts: list[str] | None = None,
    session: Any | None = None,
    keyspace: str | None = None,
    driver_type: str = "scylla",
    name: str = "default",
    **kwargs: Any,
) -> AbstractDriver:
    if driver_type == "acsylla":
        from coodie.drivers.acsylla import AcsyllaDriver

        if session is None:
            raise ConfigurationError(
                "AcsyllaDriver requires a pre-created acsylla session. "
                "Pass session= or use init_coodie_async() with hosts."
            )
        driver: AbstractDriver = AcsyllaDriver(session=session, default_keyspace=keyspace)
    elif driver_type in ("scylla", "cassandra"):
        from coodie.drivers.cassandra import CassandraDriver

        if session is None:
            try:
                from cassandra.cluster import Cluster  # type: ignore[import-untyped]
            except ImportError as exc:
                raise ImportError(
                    "cassandra-driver (or scylla-driver) is required for CassandraDriver. "
                    "Install it with: pip install scylla-driver"
                ) from exc
            cluster = Cluster(hosts or ["127.0.0.1"], **kwargs)
            session = cluster.connect(keyspace)

        driver = CassandraDriver(session=session, default_keyspace=keyspace)
    else:
        raise ConfigurationError(f"Unknown driver_type={driver_type!r}. Supported: 'scylla', 'cassandra', 'acsylla'.")

    register_driver(name, driver, default=True)
    return driver


async def init_coodie_async(
    hosts: list[str] | None = None,
    session: Any | None = None,
    keyspace: str | None = None,
    driver_type: str = "scylla",
    name: str = "default",
    **kwargs: Any,
) -> AbstractDriver:
    if driver_type == "acsylla" and session is None and hosts is not None:
        try:
            import acsylla  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError("acsylla is required for AcsyllaDriver. Install it with: pip install acsylla") from exc
        cluster = acsylla.create_cluster(hosts, **kwargs)
        session = await cluster.create_session(keyspace=keyspace)

    if driver_type == "acsylla":
        import asyncio

        from coodie.drivers.acsylla import AcsyllaDriver

        if session is None:
            raise ConfigurationError(
                "AcsyllaDriver requires a pre-created acsylla session. "
                "Pass session= or use init_coodie_async() with hosts."
            )
        loop = asyncio.get_running_loop()
        driver: AbstractDriver = AcsyllaDriver(session=session, default_keyspace=keyspace, loop=loop)
        register_driver(name, driver, default=True)
        return driver

    return init_coodie(
        hosts=hosts,
        session=session,
        keyspace=keyspace,
        driver_type=driver_type,
        name=name,
        **kwargs,
    )


__all__ = [
    "AbstractDriver",
    "register_driver",
    "get_driver",
    "init_coodie",
    "init_coodie_async",
]
