from __future__ import annotations

import ssl as _ssl
from typing import Any

from coodie.drivers.base import AbstractDriver
from coodie.drivers.lazy import LazyDriver
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
    ssl_context: _ssl.SSLContext | None = None,
    lazy: bool = False,
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
    elif driver_type == "python-rs":
        from coodie.drivers.python_rs import PythonRsDriver

        if session is None:
            raise ConfigurationError(
                "PythonRsDriver requires a pre-created python-rs-driver session. "
                "Pass session= or use init_coodie_async() with hosts."
            )
        driver = PythonRsDriver(session=session, default_keyspace=keyspace)
    elif driver_type in ("scylla", "cassandra"):
        if lazy and session is None:
            from coodie.drivers.lazy import LazyDriver

            driver = LazyDriver(hosts=hosts, keyspace=keyspace, ssl_context=ssl_context, kwargs=kwargs)
        else:
            from coodie.drivers.cassandra import CassandraDriver

            if session is None:
                try:
                    from cassandra.cluster import Cluster  # type: ignore[import-untyped]
                except ImportError as exc:
                    raise ImportError(
                        "cassandra-driver (or scylla-driver) is required for CassandraDriver. "
                        "Install it with: pip install scylla-driver"
                    ) from exc
                if ssl_context is not None:
                    kwargs["ssl_context"] = ssl_context
                cluster = Cluster(hosts or ["127.0.0.1"], **kwargs)
                session = cluster.connect(keyspace)

            driver = CassandraDriver(session=session, default_keyspace=keyspace)
    else:
        raise ConfigurationError(
            f"Unknown driver_type={driver_type!r}. Supported: 'scylla', 'cassandra', 'acsylla', 'python-rs'."
        )

    register_driver(name, driver, default=True)
    return driver


async def init_coodie_async(
    hosts: list[str] | None = None,
    session: Any | None = None,
    keyspace: str | None = None,
    driver_type: str = "scylla",
    name: str = "default",
    ssl_context: _ssl.SSLContext | None = None,
    ssl_enabled: bool | None = None,
    ssl_trusted_cert: str | None = None,
    ssl_cert: str | None = None,
    ssl_private_key: str | None = None,
    ssl_verify_flags: int | None = None,
    **kwargs: Any,
) -> AbstractDriver:
    if driver_type == "acsylla" and session is None and hosts is not None:
        try:
            import acsylla  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError("acsylla is required for AcsyllaDriver. Install it with: pip install acsylla") from exc
        if ssl_enabled is not None:
            kwargs["ssl_enabled"] = ssl_enabled
        if ssl_trusted_cert is not None:
            kwargs["ssl_trusted_cert"] = ssl_trusted_cert
        if ssl_cert is not None:
            kwargs["ssl_cert"] = ssl_cert
        if ssl_private_key is not None:
            kwargs["ssl_private_key"] = ssl_private_key
        if ssl_verify_flags is not None:
            kwargs["ssl_verify_flags"] = ssl_verify_flags
        cluster = acsylla.create_cluster(hosts, **kwargs)
        session = await cluster.create_session(keyspace=keyspace)

    if driver_type == "acsylla":
        from coodie.drivers.acsylla import AcsyllaDriver

        if session is None:
            raise ConfigurationError(
                "AcsyllaDriver requires a pre-created acsylla session. "
                "Pass session= or use init_coodie_async() with hosts."
            )
        driver: AbstractDriver = AcsyllaDriver(session=session, default_keyspace=keyspace)
        register_driver(name, driver, default=True)
        return driver

    if driver_type == "python-rs" and session is None and hosts is not None:
        try:
            from scylla.session_builder import SessionBuilder  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError(
                "python-rs-driver is required for PythonRsDriver. "
                "Build from source: https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver"
            ) from exc
        builder = SessionBuilder(contact_points=hosts, **kwargs)
        session = await builder.connect()

    if driver_type == "python-rs":
        import asyncio

        from coodie.drivers.python_rs import PythonRsDriver

        if session is None:
            raise ConfigurationError(
                "PythonRsDriver requires a pre-created python-rs-driver session. "
                "Pass session= or use init_coodie_async() with hosts."
            )
        loop = asyncio.get_running_loop()
        driver = PythonRsDriver(session=session, default_keyspace=keyspace, loop=loop)
        register_driver(name, driver, default=True)
        return driver

    return init_coodie(
        hosts=hosts,
        session=session,
        keyspace=keyspace,
        driver_type=driver_type,
        name=name,
        ssl_context=ssl_context,
        **kwargs,
    )


__all__ = [
    "AbstractDriver",
    "LazyDriver",
    "register_driver",
    "get_driver",
    "init_coodie",
    "init_coodie_async",
]
