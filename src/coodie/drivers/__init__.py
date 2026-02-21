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
        raise ConfigurationError(
            "No coodie driver registered. Call init_coodie() first."
        )
    return _registry[target]


def init_coodie(
    hosts: list[str] | None = None,
    session: Any | None = None,
    keyspace: str | None = None,
    driver_type: str = "cassandra",
    name: str = "default",
    **kwargs: Any,
) -> AbstractDriver:
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
    register_driver(name, driver, default=True)
    return driver


async def init_coodie_async(
    hosts: list[str] | None = None,
    session: Any | None = None,
    keyspace: str | None = None,
    driver_type: str = "cassandra",
    name: str = "default",
    **kwargs: Any,
) -> AbstractDriver:
    # For the async path we still use CassandraDriver (asyncio bridge).
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
