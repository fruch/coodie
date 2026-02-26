"""Integration test fixtures, models, and helpers.

Run with:  pytest -m integration -v
Skipped by default (addopts = "-m 'not integration'").

Use ``--driver-type`` to choose the driver backend:
- ``scylla`` (default) — uses scylla-driver
- ``cassandra`` — uses cassandra-driver
- ``acsylla`` — uses acsylla
- ``python-rs`` — uses python-rs-driver (Rust-based, async-only)
"""

from __future__ import annotations

import asyncio
import decimal
import ipaddress
from datetime import date, datetime, time as dt_time, timezone
from typing import Annotated, Dict, List, Optional, Set
from uuid import UUID, uuid4

import pytest
import pytest_asyncio
from pydantic import Field, field_validator

from coodie.aio.document import Document as AsyncDocument
from coodie.aio.document import MaterializedView as AsyncMaterializedView
from coodie.drivers import _registry, init_coodie
from coodie.fields import (
    Ascii,
    BigInt,
    ClusteringKey,
    Double,
    Frozen,
    Indexed,
    PrimaryKey,
    SmallInt,
    TimeUUID,
    TinyInt,
    VarInt,
)
from coodie.sync.document import Document as SyncDocument
from coodie.sync.document import MaterializedView as SyncMaterializedView
from tests.conftest import _maybe_await
from tests.conftest_scylla import create_acsylla_session, create_cql_session, create_python_rs_session  # noqa: F401
from tests.conftest_scylla import scylla_container  # noqa: F401


# ---------------------------------------------------------------------------
# Session-scoped fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def scylla_session(scylla_container: object, driver_type: str) -> object:  # noqa: F811
    """Return a connected cassandra-driver Session with the test keyspace.

    Skipped when ``--driver-type=acsylla`` or ``--driver-type=python-rs``
    (cassandra-driver may not be installed).
    """
    if driver_type in ("acsylla", "python-rs"):
        yield None
        return

    session, cluster = create_cql_session(scylla_container, "test_ks")
    yield session
    cluster.shutdown()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def coodie_driver(
    scylla_session: object,
    scylla_container: object,  # noqa: F811
    driver_type: str,
) -> object:
    """Register a coodie driver backed by the real ScyllaDB session.

    When ``--driver-type=scylla`` (default) or ``--driver-type=cassandra``
    uses CassandraDriver (both scylla-driver and cassandra-driver expose the
    same ``cassandra`` Python package).
    When ``--driver-type=acsylla`` creates an acsylla session connecting to the
    same container and registers an AcsyllaDriver instead.
    When ``--driver-type=python-rs`` creates a python-rs-driver session and
    registers a PythonRsDriver.
    """
    _registry.clear()
    if driver_type == "acsylla":
        try:
            import acsylla  # type: ignore[import-untyped] # noqa: F401
        except ImportError:
            pytest.skip("acsylla is not installed")

        from coodie.drivers.acsylla import AcsyllaDriver

        acsylla_driver = AcsyllaDriver.connect(
            session_factory=lambda: create_acsylla_session(scylla_container, "test_ks"),
            default_keyspace="test_ks",
        )
        from coodie.drivers import register_driver

        register_driver("default", acsylla_driver, default=True)
        driver = acsylla_driver
    elif driver_type == "python-rs":
        try:
            import scylla  # type: ignore[import-untyped] # noqa: F401
        except ImportError:
            pytest.skip("python-rs-driver is not installed")

        from coodie.drivers.python_rs import PythonRsDriver

        python_rs_session = await create_python_rs_session(scylla_container, "test_ks")
        loop = asyncio.get_running_loop()
        python_rs_driver = PythonRsDriver(session=python_rs_session, default_keyspace="test_ks", loop=loop)
        from coodie.drivers import register_driver

        register_driver("default", python_rs_driver, default=True)
        driver = python_rs_driver
    else:
        driver = init_coodie(session=scylla_session, keyspace="test_ks", driver_type=driver_type)
    yield driver
    _registry.clear()
    await driver.close_async()


# ---------------------------------------------------------------------------
# Shared document models
# ---------------------------------------------------------------------------


class SyncProduct(SyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    category: Annotated[str, Indexed()] = "general"
    price: float = 0.0
    tags: List[str] = Field(default_factory=list)
    description: Optional[str] = None

    @field_validator("tags", mode="before")
    @classmethod
    def _coerce_tags(cls, v: object) -> object:
        return v if v is not None else []

    class Settings:
        name = "it_sync_products"
        keyspace = "test_ks"


class AsyncProduct(AsyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    category: Annotated[str, Indexed()] = "general"
    price: float = 0.0
    tags: List[str] = Field(default_factory=list)
    description: Optional[str] = None

    @field_validator("tags", mode="before")
    @classmethod
    def _coerce_tags(cls, v: object) -> object:
        return v if v is not None else []

    class Settings:
        name = "it_async_products"
        keyspace = "test_ks"


class SyncReview(SyncDocument):
    product_id: Annotated[UUID, PrimaryKey()]
    created_at: Annotated[datetime, ClusteringKey(order="DESC")] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    author: str
    rating: Annotated[int, Indexed()] = 0

    class Settings:
        name = "it_sync_reviews"
        keyspace = "test_ks"


class AsyncReview(AsyncDocument):
    product_id: Annotated[UUID, PrimaryKey()]
    created_at: Annotated[datetime, ClusteringKey(order="DESC")] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    author: str
    rating: Annotated[int, Indexed()] = 0

    class Settings:
        name = "it_async_reviews"
        keyspace = "test_ks"


class SyncProductsByBrand(SyncMaterializedView):
    """Materialized view on SyncProduct indexed by brand."""

    brand: Annotated[str, PrimaryKey()]
    id: Annotated[UUID, ClusteringKey()] = Field(default_factory=uuid4)
    name: str = ""
    price: float = 0.0

    class Settings:
        name = "it_sync_products_by_brand"
        keyspace = "test_ks"
        __base_table__ = "it_sync_products"


class AsyncProductsByBrand(AsyncMaterializedView):
    """Async materialized view on AsyncProduct indexed by brand."""

    brand: Annotated[str, PrimaryKey()]
    id: Annotated[UUID, ClusteringKey()] = Field(default_factory=uuid4)
    name: str = ""
    price: float = 0.0

    class Settings:
        name = "it_async_products_by_brand"
        keyspace = "test_ks"
        __base_table__ = "it_async_products"


class SyncAllTypes(SyncDocument):
    """One column per supported scalar CQL type + set and dict collections."""

    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    flag: bool = False
    count: int = 0
    score: float = 0.0
    amount: decimal.Decimal = decimal.Decimal("0.0")
    blob_val: bytes = b""
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    day: date = Field(default_factory=date.today)
    ip4: Optional[ipaddress.IPv4Address] = None
    ip6: Optional[ipaddress.IPv6Address] = None
    tags_set: Set[str] = Field(default_factory=set)
    scores_map: Dict[str, int] = Field(default_factory=dict)

    @field_validator("tags_set", mode="before")
    @classmethod
    def _coerce_set(cls, v: object) -> object:
        return v if v is not None else set()

    @field_validator("scores_map", mode="before")
    @classmethod
    def _coerce_map(cls, v: object) -> object:
        return v if v is not None else {}

    @field_validator("day", mode="before")
    @classmethod
    def _coerce_day(cls, v: object) -> object:
        if hasattr(v, "date") and callable(v.date):
            return v.date()
        return v

    class Settings:
        name = "it_all_types"
        keyspace = "test_ks"


class AsyncAllTypes(AsyncDocument):
    """Async counterpart of SyncAllTypes."""

    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    flag: bool = False
    count: int = 0
    score: float = 0.0
    amount: decimal.Decimal = decimal.Decimal("0.0")
    blob_val: bytes = b""
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    day: date = Field(default_factory=date.today)
    ip4: Optional[ipaddress.IPv4Address] = None
    ip6: Optional[ipaddress.IPv6Address] = None
    tags_set: Set[str] = Field(default_factory=set)
    scores_map: Dict[str, int] = Field(default_factory=dict)

    @field_validator("tags_set", mode="before")
    @classmethod
    def _coerce_set(cls, v: object) -> object:
        return v if v is not None else set()

    @field_validator("scores_map", mode="before")
    @classmethod
    def _coerce_map(cls, v: object) -> object:
        return v if v is not None else {}

    @field_validator("day", mode="before")
    @classmethod
    def _coerce_day(cls, v: object) -> object:
        if hasattr(v, "date") and callable(v.date):
            return v.date()
        return v

    class Settings:
        name = "it_async_all_types"
        keyspace = "test_ks"


class SyncEvent(SyncDocument):
    """Composite partition key + two clustering columns for ordering tests."""

    partition_a: Annotated[str, PrimaryKey(partition_key_index=0)]
    partition_b: Annotated[str, PrimaryKey(partition_key_index=1)]
    seq: Annotated[int, ClusteringKey(order="ASC", clustering_key_index=0)] = 0
    sub: Annotated[int, ClusteringKey(order="DESC", clustering_key_index=1)] = 0
    payload: str = ""

    class Settings:
        name = "it_sync_events"
        keyspace = "test_ks"


class AsyncEvent(AsyncDocument):
    """Async counterpart of SyncEvent."""

    partition_a: Annotated[str, PrimaryKey(partition_key_index=0)]
    partition_b: Annotated[str, PrimaryKey(partition_key_index=1)]
    seq: Annotated[int, ClusteringKey(order="ASC", clustering_key_index=0)] = 0
    sub: Annotated[int, ClusteringKey(order="DESC", clustering_key_index=1)] = 0
    payload: str = ""

    class Settings:
        name = "it_async_events"
        keyspace = "test_ks"


# Microsecond constants for converting CQL time (nanoseconds) → datetime.time
_US_PER_HOUR = 3_600_000_000
_US_PER_MINUTE = 60_000_000
_US_PER_SECOND = 1_000_000

try:
    from cassandra.util import Time as _CqlTime  # type: ignore[import-untyped]
except ImportError:  # pragma: no cover – only needed at integration time
    _CqlTime = None


def _ns_to_time(ns: int) -> dt_time:
    """Convert nanoseconds since midnight to ``datetime.time``."""
    total_us = ns // 1000
    hours, remainder = divmod(total_us, _US_PER_HOUR)
    minutes, remainder = divmod(remainder, _US_PER_MINUTE)
    seconds, microseconds = divmod(remainder, _US_PER_SECOND)
    return dt_time(hours, minutes, seconds, microseconds)


def _coerce_cql_time(v: object) -> object:
    """Coerce cassandra-driver's CQL ``time`` value to ``datetime.time``."""
    if _CqlTime is not None and isinstance(v, _CqlTime):
        return _ns_to_time(v.nanosecond_time)
    if isinstance(v, int):
        return _ns_to_time(v)
    return v


class SyncExtendedTypes(SyncDocument):
    """One column per Phase-1 extended CQL scalar type + frozen collections."""

    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    big_val: Annotated[int, BigInt()] = 0
    small_val: Annotated[int, SmallInt()] = 0
    tiny_val: Annotated[int, TinyInt()] = 0
    var_val: Annotated[int, VarInt()] = 0
    dbl_val: Annotated[float, Double()] = 0.0
    ascii_val: Annotated[str, Ascii()] = ""
    timeuuid_val: Annotated[Optional[UUID], TimeUUID()] = None
    time_val: Optional[dt_time] = None
    frozen_list: Annotated[List[str], Frozen()] = Field(default_factory=list)
    frozen_set: Annotated[Set[int], Frozen()] = Field(default_factory=set)
    frozen_map: Annotated[Dict[str, int], Frozen()] = Field(default_factory=dict)

    @field_validator("frozen_list", mode="before")
    @classmethod
    def _coerce_flist(cls, v: object) -> object:
        return v if v is not None else []

    @field_validator("frozen_set", mode="before")
    @classmethod
    def _coerce_fset(cls, v: object) -> object:
        return v if v is not None else set()

    @field_validator("frozen_map", mode="before")
    @classmethod
    def _coerce_fmap(cls, v: object) -> object:
        return v if v is not None else {}

    @field_validator("time_val", mode="before")
    @classmethod
    def _coerce_time(cls, v: object) -> object:
        return _coerce_cql_time(v)

    class Settings:
        name = "it_sync_extended_types"
        keyspace = "test_ks"


class AsyncExtendedTypes(AsyncDocument):
    """Async counterpart of SyncExtendedTypes."""

    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    big_val: Annotated[int, BigInt()] = 0
    small_val: Annotated[int, SmallInt()] = 0
    tiny_val: Annotated[int, TinyInt()] = 0
    var_val: Annotated[int, VarInt()] = 0
    dbl_val: Annotated[float, Double()] = 0.0
    ascii_val: Annotated[str, Ascii()] = ""
    timeuuid_val: Annotated[Optional[UUID], TimeUUID()] = None
    time_val: Optional[dt_time] = None
    frozen_list: Annotated[List[str], Frozen()] = Field(default_factory=list)
    frozen_set: Annotated[Set[int], Frozen()] = Field(default_factory=set)
    frozen_map: Annotated[Dict[str, int], Frozen()] = Field(default_factory=dict)

    @field_validator("frozen_list", mode="before")
    @classmethod
    def _coerce_flist(cls, v: object) -> object:
        return v if v is not None else []

    @field_validator("frozen_set", mode="before")
    @classmethod
    def _coerce_fset(cls, v: object) -> object:
        return v if v is not None else set()

    @field_validator("frozen_map", mode="before")
    @classmethod
    def _coerce_fmap(cls, v: object) -> object:
        return v if v is not None else {}

    @field_validator("time_val", mode="before")
    @classmethod
    def _coerce_time(cls, v: object) -> object:
        return _coerce_cql_time(v)

    class Settings:
        name = "it_async_extended_types"
        keyspace = "test_ks"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Minimum Murmur3 token value — used for token-range queries that should match
# every row (TOKEN(pk) > MIN_TOKEN covers the full ring).
MIN_MURMUR3_TOKEN = -(2**63)


async def _retry(fn, retries=5, delay=1):
    """Retry a callable (sync or async) until it returns a truthy result."""
    for attempt in range(retries):
        result = await _maybe_await(fn)
        if result:
            return result
        await asyncio.sleep(delay)
    return await _maybe_await(fn)


# ---------------------------------------------------------------------------
# Variant fixture + model/helper fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(params=["sync", "async"])
def variant(request, driver_type):
    return request.param


@pytest.fixture
def Product(variant):
    if variant == "sync":
        return SyncProduct
    return AsyncProduct


@pytest.fixture
def Review(variant):
    if variant == "sync":
        return SyncReview
    return AsyncReview


@pytest.fixture
def AllTypes(variant):
    if variant == "sync":
        return SyncAllTypes
    return AsyncAllTypes


@pytest.fixture
def Event(variant):
    if variant == "sync":
        return SyncEvent
    return AsyncEvent


@pytest.fixture
def ExtendedTypes(variant):
    if variant == "sync":
        return SyncExtendedTypes
    return AsyncExtendedTypes


@pytest.fixture
def ProductsByBrand(variant):
    if variant == "sync":
        return SyncProductsByBrand
    return AsyncProductsByBrand


@pytest.fixture
def execute_raw_fn(variant):
    if variant == "sync":
        from coodie.sync import execute_raw

        return execute_raw
    from coodie.aio import execute_raw

    return execute_raw


@pytest.fixture
def create_keyspace_fn(variant):
    if variant == "sync":
        from coodie.sync import create_keyspace

        return create_keyspace
    from coodie.aio import create_keyspace

    return create_keyspace


@pytest.fixture
def drop_keyspace_fn(variant):
    if variant == "sync":
        from coodie.sync import drop_keyspace

        return drop_keyspace
    from coodie.aio import drop_keyspace

    return drop_keyspace


@pytest.fixture
def QS(variant):
    """Return the QuerySet class matching the current variant."""
    if variant == "sync":
        from coodie.sync.query import QuerySet

        return QuerySet
    from coodie.aio.query import QuerySet

    return QuerySet


# ---------------------------------------------------------------------------
# Phase A migration-strategy models & fixtures
# ---------------------------------------------------------------------------


class SyncPhaseAProduct(SyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0

    class Settings:
        name = "it_phase_a"
        keyspace = "test_ks"


class AsyncPhaseAProduct(AsyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0

    class Settings:
        name = "it_phase_a"
        keyspace = "test_ks"


class SyncPhaseATTL(SyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_ttl"
        keyspace = "test_ks"
        __default_ttl__ = 7200


class AsyncPhaseATTL(AsyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_ttl"
        keyspace = "test_ks"
        __default_ttl__ = 7200


class SyncPhaseADrift(SyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_drift"
        keyspace = "test_ks"


class AsyncPhaseADrift(AsyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_drift"
        keyspace = "test_ks"


class SyncPhaseAIndex(SyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_idx"
        keyspace = "test_ks"


class AsyncPhaseAIndex(AsyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_idx"
        keyspace = "test_ks"


class SyncPhaseADryRun(SyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_drytest"
        keyspace = "test_ks"


class AsyncPhaseADryRun(AsyncDocument):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""

    class Settings:
        name = "it_phase_a_drytest"
        keyspace = "test_ks"


@pytest.fixture
def PhaseAProduct(variant):
    if variant == "sync":
        return SyncPhaseAProduct
    return AsyncPhaseAProduct


@pytest.fixture
def PhaseATTL(variant):
    if variant == "sync":
        return SyncPhaseATTL
    return AsyncPhaseATTL


@pytest.fixture
def PhaseADrift(variant):
    if variant == "sync":
        return SyncPhaseADrift
    return AsyncPhaseADrift


@pytest.fixture
def PhaseAIndex(variant):
    if variant == "sync":
        return SyncPhaseAIndex
    return AsyncPhaseAIndex


@pytest.fixture
def PhaseADryRun(variant):
    if variant == "sync":
        return SyncPhaseADryRun
    return AsyncPhaseADryRun
