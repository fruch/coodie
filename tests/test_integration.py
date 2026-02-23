"""Integration tests — require a real ScyllaDB instance via testcontainers.

Run with:  pytest -m integration -v
Skipped by default (addopts = "-m 'not integration'").

Use ``--driver-type`` to choose the driver backend:
- ``scylla`` (default) — uses scylla-driver (``pip install scylla-driver``)
- ``cassandra`` — uses cassandra-driver (``pip install cassandra-driver``)
- ``acsylla`` — uses acsylla (``pip install acsylla``)
"""

from __future__ import annotations

import asyncio
import decimal
import ipaddress
import time
from datetime import date, datetime, time as dt_time, timezone
from typing import Annotated, Dict, List, Optional, Set
from uuid import UUID, uuid4

import pytest
import pytest_asyncio
from pydantic import Field, field_validator

from coodie.aio.document import Document as AsyncDocument
from coodie.drivers import _registry, init_coodie
from coodie.exceptions import DocumentNotFound, MultipleDocumentsFound
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


# ---------------------------------------------------------------------------
# Session-scoped fixtures
# ---------------------------------------------------------------------------


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
        .with_command(
            "--smp 1 --memory 512M --developer-mode 1 --skip-wait-for-gossip-to-settle=0"
        )
        .with_exposed_ports(9042) as container
    ):
        wait_for_logs(container, "Starting listening for CQL clients", timeout=120)
        yield container


class _LocalhostTranslator:
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
def scylla_session(scylla_container: object, driver_type: str) -> object:
    """Return a connected cassandra-driver Session with the test keyspace.

    Skipped when ``--driver-type=acsylla`` (cassandra-driver may not be installed).
    """
    if driver_type == "acsylla":
        yield None
        return

    from cassandra.cluster import Cluster, NoHostAvailable  # type: ignore[import-untyped]

    port = int(scylla_container.get_exposed_port(9042))  # type: ignore[attr-defined]
    cluster = Cluster(
        ["127.0.0.1"],
        port=port,
        connect_timeout=10,
        address_translator=_LocalhostTranslator(),
    )

    # Scylla may briefly not accept connections right after the log message.
    for attempt in range(10):
        try:
            session = cluster.connect()
            break
        except NoHostAvailable:
            if attempt == 9:
                raise
            time.sleep(2)

    session.execute(
        "CREATE KEYSPACE IF NOT EXISTS test_ks "
        "WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}"
    )
    yield session
    cluster.shutdown()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def coodie_driver(
    scylla_session: object,
    scylla_container: object,
    driver_type: str,
) -> object:
    """Register a coodie driver backed by the real ScyllaDB session.

    When ``--driver-type=scylla`` (default) or ``--driver-type=cassandra``
    uses CassandraDriver (both scylla-driver and cassandra-driver expose the
    same ``cassandra`` Python package).
    When ``--driver-type=acsylla`` creates an acsylla session connecting to the
    same container and registers an AcsyllaDriver instead.
    """
    import asyncio

    _registry.clear()
    if driver_type == "acsylla":
        try:
            import acsylla  # type: ignore[import-untyped]
        except ImportError:
            pytest.skip("acsylla is not installed")

        from coodie.drivers.acsylla import AcsyllaDriver

        # acsylla has no address translator, so connect directly to the
        # container's internal Docker IP on the native CQL port.
        container_info = scylla_container.get_wrapped_container()  # type: ignore[attr-defined]
        container_info.reload()
        networks = container_info.attrs["NetworkSettings"]["Networks"]
        container_ip = next(iter(networks.values()))["IPAddress"]

        cluster = acsylla.create_cluster([container_ip], port=9042)
        session = await cluster.create_session()
        await session.execute(
            acsylla.create_statement(
                "CREATE KEYSPACE IF NOT EXISTS test_ks "
                "WITH replication = {'class': 'SimpleStrategy', "
                "'replication_factor': '1'}",
                parameters=0,
            )
        )
        await session.close()
        # Reconnect with the keyspace set
        acsylla_session = await cluster.create_session(keyspace="test_ks")
        loop = asyncio.get_running_loop()
        acsylla_driver = AcsyllaDriver(
            session=acsylla_session, default_keyspace="test_ks", loop=loop
        )
        from coodie.drivers import register_driver

        register_driver("default", acsylla_driver, default=True)
        driver = acsylla_driver
    else:
        driver = init_coodie(
            session=scylla_session, keyspace="test_ks", driver_type=driver_type
        )
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
        # Cassandra/Scylla stores empty collections as NULL; coerce back to [].
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
        # Cassandra/Scylla stores empty collections as NULL; coerce back to [].
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


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Minimum Murmur3 token value — used for token-range queries that should match
# every row (TOKEN(pk) > MIN_TOKEN covers the full ring).
MIN_MURMUR3_TOKEN = -(2**63)


# ===========================================================================
# Synchronous integration tests
# ===========================================================================


@pytest.mark.integration
class TestSyncIntegration:
    """Full CRUD tests using coodie.sync against a real ScyllaDB container."""

    def test_sync_table_creates_table(self, coodie_driver: object) -> None:
        """sync_table should create the table without raising."""
        SyncProduct.sync_table()

    def test_sync_table_idempotent(self, coodie_driver: object) -> None:
        """Calling sync_table twice must not raise."""
        SyncProduct.sync_table()
        SyncProduct.sync_table()

    def test_save_and_find_one(self, coodie_driver: object) -> None:
        """save() inserts a row; find_one() retrieves it."""
        pid = uuid4()
        p = SyncProduct(id=pid, name="Widget", brand="Acme", price=9.99)
        p.save()

        fetched = SyncProduct.find_one(id=pid)
        assert fetched is not None
        assert fetched.id == pid
        assert fetched.name == "Widget"
        assert fetched.brand == "Acme"

    def test_get_by_pk(self, coodie_driver: object) -> None:
        """get() retrieves a document and raises DocumentNotFound when absent."""
        pid = uuid4()
        SyncProduct(id=pid, name="Gadget").save()

        doc = SyncProduct.get(id=pid)
        assert isinstance(doc, SyncProduct)

        with pytest.raises(DocumentNotFound):
            SyncProduct.get(id=uuid4())

    def test_delete(self, coodie_driver: object) -> None:
        """delete() removes the row; subsequent find_one returns None."""
        pid = uuid4()
        p = SyncProduct(id=pid, name="Temp")
        p.save()
        assert SyncProduct.find_one(id=pid) is not None

        p.delete()
        assert SyncProduct.find_one(id=pid) is None

    def test_save_write_read_cycle(self, coodie_driver: object) -> None:
        """Multiple saves then all() returns the correct count."""
        ids = [uuid4() for _ in range(3)]
        for i, pid in enumerate(ids):
            SyncProduct(id=pid, name=f"Item{i}", brand="BrandX").save()

        for pid in ids:
            assert SyncProduct.find_one(id=pid) is not None

        # cleanup
        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_queryset_filtering_by_secondary_index(self, coodie_driver: object) -> None:
        """find(brand=...) filters via the secondary index."""
        pid = uuid4()
        SyncProduct(id=pid, name="IndexTest", brand="AcmeFiltered").save()

        results = SyncProduct.find(brand="AcmeFiltered").allow_filtering().all()
        assert any(r.id == pid for r in results)

        # cleanup
        SyncProduct(id=pid, name="").delete()

    def test_queryset_limit(self, coodie_driver: object) -> None:
        """limit(n) restricts the number of rows returned."""
        ids = [uuid4() for _ in range(5)]
        for pid in ids:
            SyncProduct(id=pid, name="LimitTest").save()

        results = SyncProduct.find().limit(2).allow_filtering().all()
        assert len(results) <= 2

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_queryset_count(self, coodie_driver: object) -> None:
        """count() returns the correct integer."""
        ids = [uuid4() for _ in range(3)]
        for pid in ids:
            SyncProduct(id=pid, name="CountTest", brand="CountBrand").save()

        count = SyncProduct.find(brand="CountBrand").allow_filtering().count()
        assert count >= 3

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_queryset_delete(self, coodie_driver: object) -> None:
        """QuerySet.delete() removes matching rows."""
        pid = uuid4()
        SyncProduct(id=pid, name="ToDelete", brand="DeleteMe").save()
        assert SyncProduct.find_one(id=pid) is not None

        SyncProduct.find(id=pid).delete()
        assert SyncProduct.find_one(id=pid) is None

    def test_collections_list(self, coodie_driver: object) -> None:
        """list[str] field round-trips correctly."""
        pid = uuid4()
        tags = ["alpha", "beta", "gamma"]
        SyncProduct(id=pid, name="TagTest", tags=tags).save()

        fetched = SyncProduct.find_one(id=pid)
        assert fetched is not None
        assert sorted(fetched.tags) == sorted(tags)

        SyncProduct(id=pid, name="").delete()

    def test_optional_field_none_roundtrip(self, coodie_driver: object) -> None:
        """Optional[str] field set to None round-trips correctly."""
        pid = uuid4()
        SyncProduct(id=pid, name="OptNone", description=None).save()

        fetched = SyncProduct.find_one(id=pid)
        assert fetched is not None
        assert fetched.description is None

        SyncProduct(id=pid, name="").delete()

    def test_optional_field_value_roundtrip(self, coodie_driver: object) -> None:
        """Optional[str] field set to a value round-trips correctly."""
        pid = uuid4()
        SyncProduct(id=pid, name="OptVal", description="hello").save()

        fetched = SyncProduct.find_one(id=pid)
        assert fetched is not None
        assert fetched.description == "hello"

        SyncProduct(id=pid, name="").delete()

    def test_ttl_row_expires(self, coodie_driver: object) -> None:
        """Row inserted with ttl=2 disappears after ~2 seconds."""
        pid = uuid4()
        p = SyncProduct(id=pid, name="TTLTest")
        p.save(ttl=2)
        assert SyncProduct.find_one(id=pid) is not None

        time.sleep(3)
        assert SyncProduct.find_one(id=pid) is None

    def test_clustering_key_order(self, coodie_driver: object) -> None:
        """Reviews with DESC clustering key return newest first."""
        SyncReview.sync_table()
        pid = uuid4()
        t1 = datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
        t2 = datetime(2024, 1, 2, 12, 0, 0, tzinfo=timezone.utc)

        SyncReview(product_id=pid, created_at=t1, author="Alice", rating=3).save()
        SyncReview(product_id=pid, created_at=t2, author="Bob", rating=5).save()

        results = SyncReview.find(product_id=pid).all()
        assert len(results) == 2
        # DESC order: newest (t2) first
        assert results[0].created_at.replace(tzinfo=timezone.utc) >= results[
            1
        ].created_at.replace(tzinfo=timezone.utc)

        SyncReview.find(product_id=pid).delete()

    def test_multiple_documents_found(self, coodie_driver: object) -> None:
        """find_one raises MultipleDocumentsFound when > 1 rows match."""
        brand = f"DupBrand_{uuid4().hex[:8]}"
        ids = [uuid4(), uuid4()]
        for pid in ids:
            SyncProduct(id=pid, name="Dup", brand=brand).save()

        with pytest.raises(MultipleDocumentsFound):
            SyncProduct.find_one(brand=brand)

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_multi_model_isolation(self, coodie_driver: object) -> None:
        """Two Document subclasses write to separate tables without cross-contamination."""
        SyncReview.sync_table()
        pid = uuid4()
        SyncProduct(id=pid, name="Isolated").save()
        SyncReview(
            product_id=pid,
            author="Tester",
            rating=5,
        ).save()

        # products table has the product
        assert SyncProduct.find_one(id=pid) is not None
        # reviews table has the review
        assert SyncReview.find_one(product_id=pid) is not None

        SyncProduct(id=pid, name="").delete()
        SyncReview.find(product_id=pid).delete()

    # --- Phase 10: Pagination & Token Queries ---

    def test_paged_all_pagination(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """paged_all() with fetch_size returns PagedResult and paginates."""
        from coodie.results import PagedResult

        brand = f"PageBrand_{uuid4().hex[:8]}"
        ids = [uuid4() for _ in range(5)]
        for pid in ids:
            SyncProduct(id=pid, name="PageTest", brand=brand).save()

        # fetch 2 at a time
        result = (
            SyncProduct.find(brand=brand).fetch_size(2).allow_filtering().paged_all()
        )
        assert isinstance(result, PagedResult)
        assert len(result.data) > 0
        for doc in result.data:
            assert isinstance(doc, SyncProduct)

        # collect all pages
        all_docs = list(result.data)
        while result.paging_state is not None:
            result = (
                SyncProduct.find(brand=brand)
                .fetch_size(2)
                .page(result.paging_state)
                .allow_filtering()
                .paged_all()
            )
            assert isinstance(result, PagedResult)
            all_docs.extend(result.data)

        # We should have retrieved at least our 5 inserted docs
        found_ids = {d.id for d in all_docs}
        for pid in ids:
            assert pid in found_ids

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_fetch_size_limits_page(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """fetch_size(n) limits the number of rows returned per page."""
        from coodie.results import PagedResult

        brand = f"FetchBrand_{uuid4().hex[:8]}"
        ids = [uuid4() for _ in range(4)]
        for pid in ids:
            SyncProduct(id=pid, name="FetchSizeTest", brand=brand).save()

        result = (
            SyncProduct.find(brand=brand).fetch_size(2).allow_filtering().paged_all()
        )
        assert isinstance(result, PagedResult)
        assert len(result.data) <= 2

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_token_range_query(self, coodie_driver: object, driver_type: str) -> None:
        """Token-range filter queries execute without error."""
        ids = [uuid4() for _ in range(3)]
        for pid in ids:
            SyncProduct(id=pid, name="TokenTest").save()

        # Token queries with allow_filtering
        results = (
            SyncProduct.find(id__token__gt=MIN_MURMUR3_TOKEN).allow_filtering().all()
        )
        assert isinstance(results, list)
        # All inserted items should be found (token > min_token)
        found_ids = {r.id for r in results}
        for pid in ids:
            assert pid in found_ids

        for pid in ids:
            SyncProduct(id=pid, name="").delete()


# ===========================================================================
# Asynchronous integration tests
# ===========================================================================


@pytest.mark.integration
@pytest.mark.asyncio(loop_scope="session")
class TestAsyncIntegration:
    """Full CRUD tests using coodie.aio against the same ScyllaDB container."""

    async def test_sync_table_creates_table(self, coodie_driver: object) -> None:
        await AsyncProduct.sync_table()

    async def test_sync_table_idempotent(self, coodie_driver: object) -> None:
        await AsyncProduct.sync_table()
        await AsyncProduct.sync_table()

    async def test_save_and_find_one(self, coodie_driver: object) -> None:
        pid = uuid4()
        p = AsyncProduct(id=pid, name="AsyncWidget", brand="AsyncAcme", price=19.99)
        await p.save()

        fetched = await AsyncProduct.find_one(id=pid)
        assert fetched is not None
        assert fetched.id == pid
        assert fetched.name == "AsyncWidget"

    async def test_get_by_pk(self, coodie_driver: object) -> None:
        pid = uuid4()
        await AsyncProduct(id=pid, name="AsyncGadget").save()

        doc = await AsyncProduct.get(id=pid)
        assert isinstance(doc, AsyncProduct)

        with pytest.raises(DocumentNotFound):
            await AsyncProduct.get(id=uuid4())

    async def test_delete(self, coodie_driver: object) -> None:
        pid = uuid4()
        p = AsyncProduct(id=pid, name="AsyncTemp")
        await p.save()
        assert await AsyncProduct.find_one(id=pid) is not None

        await p.delete()
        assert await AsyncProduct.find_one(id=pid) is None

    async def test_save_write_read_cycle(self, coodie_driver: object) -> None:
        ids = [uuid4() for _ in range(3)]
        for i, pid in enumerate(ids):
            await AsyncProduct(id=pid, name=f"AsyncItem{i}", brand="AsyncBrandX").save()

        for pid in ids:
            assert await AsyncProduct.find_one(id=pid) is not None

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()

    async def test_queryset_filtering(self, coodie_driver: object) -> None:
        pid = uuid4()
        await AsyncProduct(
            id=pid, name="AsyncIndexTest", brand="AsyncAcmeFiltered"
        ).save()

        from coodie.aio.query import QuerySet

        results = (
            await QuerySet(AsyncProduct)
            .filter(brand="AsyncAcmeFiltered")
            .allow_filtering()
            .all()
        )
        assert any(r.id == pid for r in results)

        await AsyncProduct(id=pid, name="").delete()

    async def test_queryset_all_first_count(self, coodie_driver: object) -> None:
        ids = [uuid4() for _ in range(3)]
        for pid in ids:
            await AsyncProduct(
                id=pid, name="AsyncCountTest", brand="AsyncCountBrand"
            ).save()

        from coodie.aio.query import QuerySet

        count = (
            await QuerySet(AsyncProduct)
            .filter(brand="AsyncCountBrand")
            .allow_filtering()
            .count()
        )
        assert count >= 3

        first = (
            await QuerySet(AsyncProduct)
            .filter(brand="AsyncCountBrand")
            .allow_filtering()
            .first()
        )
        assert first is not None

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()

    async def test_queryset_delete(self, coodie_driver: object) -> None:
        pid = uuid4()
        await AsyncProduct(id=pid, name="AsyncToDelete", brand="AsyncDeleteMe").save()
        assert await AsyncProduct.find_one(id=pid) is not None

        from coodie.aio.query import QuerySet

        await QuerySet(AsyncProduct).filter(id=pid).delete()
        assert await AsyncProduct.find_one(id=pid) is None

    async def test_aiter(self, coodie_driver: object) -> None:
        ids = [uuid4() for _ in range(2)]
        brand = f"AiterBrand_{uuid4().hex[:8]}"
        for pid in ids:
            await AsyncProduct(id=pid, name="AiterTest", brand=brand).save()

        from coodie.aio.query import QuerySet

        collected = [
            item
            async for item in QuerySet(AsyncProduct)
            .filter(brand=brand)
            .allow_filtering()
        ]
        assert len(collected) >= 2

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()

    async def test_collections_list(self, coodie_driver: object) -> None:
        pid = uuid4()
        tags = ["x", "y", "z"]
        await AsyncProduct(id=pid, name="AsyncTagTest", tags=tags).save()

        fetched = await AsyncProduct.find_one(id=pid)
        assert fetched is not None
        assert sorted(fetched.tags) == sorted(tags)

        await AsyncProduct(id=pid, name="").delete()

    async def test_optional_field_roundtrip(self, coodie_driver: object) -> None:
        pid = uuid4()
        await AsyncProduct(id=pid, name="AsyncOptTest", description="async desc").save()

        fetched = await AsyncProduct.find_one(id=pid)
        assert fetched is not None
        assert fetched.description == "async desc"

        await AsyncProduct(id=pid, name="").delete()

    async def test_ttl_row_expires(self, coodie_driver: object) -> None:
        pid = uuid4()
        p = AsyncProduct(id=pid, name="AsyncTTLTest")
        await p.save(ttl=2)
        assert await AsyncProduct.find_one(id=pid) is not None

        await asyncio.sleep(3)
        assert await AsyncProduct.find_one(id=pid) is None

    async def test_clustering_key_order(self, coodie_driver: object) -> None:
        await AsyncReview.sync_table()
        pid = uuid4()
        t1 = datetime(2024, 3, 1, 10, 0, 0, tzinfo=timezone.utc)
        t2 = datetime(2024, 3, 2, 10, 0, 0, tzinfo=timezone.utc)

        await AsyncReview(
            product_id=pid, created_at=t1, author="Alice", rating=3
        ).save()
        await AsyncReview(product_id=pid, created_at=t2, author="Bob", rating=5).save()

        results = await AsyncReview.find(product_id=pid).all()
        assert len(results) == 2
        assert results[0].created_at.replace(tzinfo=timezone.utc) >= results[
            1
        ].created_at.replace(tzinfo=timezone.utc)

        from coodie.aio.query import QuerySet

        await QuerySet(AsyncReview).filter(product_id=pid).delete()

    async def test_multiple_documents_found(self, coodie_driver: object) -> None:
        brand = f"AsyncDupBrand_{uuid4().hex[:8]}"
        ids = [uuid4(), uuid4()]
        for pid in ids:
            await AsyncProduct(id=pid, name="AsyncDup", brand=brand).save()

        with pytest.raises(MultipleDocumentsFound):
            await AsyncProduct.find_one(brand=brand)

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()

    async def test_multi_model_isolation(self, coodie_driver: object) -> None:
        await AsyncReview.sync_table()
        pid = uuid4()
        await AsyncProduct(id=pid, name="AsyncIsolated").save()
        await AsyncReview(product_id=pid, author="AsyncTester", rating=4).save()

        assert await AsyncProduct.find_one(id=pid) is not None
        assert await AsyncReview.find_one(product_id=pid) is not None

        await AsyncProduct(id=pid, name="").delete()
        from coodie.aio.query import QuerySet

        await QuerySet(AsyncReview).filter(product_id=pid).delete()

    # --- Phase 10: Pagination & Token Queries ---

    async def test_paged_all_pagination(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """paged_all() with fetch_size returns PagedResult and paginates."""
        from coodie.results import PagedResult

        brand = f"AsyncPageBrand_{uuid4().hex[:8]}"
        ids = [uuid4() for _ in range(5)]
        for pid in ids:
            await AsyncProduct(id=pid, name="AsyncPageTest", brand=brand).save()

        # fetch 2 at a time
        result = await (
            AsyncProduct.find(brand=brand).fetch_size(2).allow_filtering().paged_all()
        )
        assert isinstance(result, PagedResult)
        assert len(result.data) > 0
        for doc in result.data:
            assert isinstance(doc, AsyncProduct)

        # collect all pages
        all_docs = list(result.data)
        while result.paging_state is not None:
            result = await (
                AsyncProduct.find(brand=brand)
                .fetch_size(2)
                .page(result.paging_state)
                .allow_filtering()
                .paged_all()
            )
            assert isinstance(result, PagedResult)
            all_docs.extend(result.data)

        # We should have retrieved at least our 5 inserted docs
        found_ids = {d.id for d in all_docs}
        for pid in ids:
            assert pid in found_ids

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()

    async def test_fetch_size_limits_page(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """fetch_size(n) limits the number of rows returned per page."""
        from coodie.results import PagedResult

        brand = f"AsyncFetchBrand_{uuid4().hex[:8]}"
        ids = [uuid4() for _ in range(4)]
        for pid in ids:
            await AsyncProduct(id=pid, name="AsyncFetchSizeTest", brand=brand).save()

        result = await (
            AsyncProduct.find(brand=brand).fetch_size(2).allow_filtering().paged_all()
        )
        assert isinstance(result, PagedResult)
        assert len(result.data) <= 2

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()

    async def test_token_range_query(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """Token-range filter queries execute without error."""
        ids = [uuid4() for _ in range(3)]
        for pid in ids:
            await AsyncProduct(id=pid, name="AsyncTokenTest").save()

        # Token queries with allow_filtering
        results = await (
            AsyncProduct.find(id__token__gt=MIN_MURMUR3_TOKEN).allow_filtering().all()
        )
        assert isinstance(results, list)
        # All inserted items should be found (token > min_token)
        found_ids = {r.id for r in results}
        for pid in ids:
            assert pid in found_ids

        for pid in ids:
            await AsyncProduct(id=pid, name="").delete()


# ===========================================================================
# Raw CQL integration tests
# ===========================================================================


@pytest.mark.integration
class TestSyncRawCQL:
    """Test execute_raw (sync) against a real ScyllaDB container."""

    def test_raw_select(self, coodie_driver: object) -> None:
        """Raw SELECT returns rows as list of dicts."""
        from coodie.sync import execute_raw

        SyncProduct.sync_table()
        pid = uuid4()
        SyncProduct(id=pid, name="RawSync", brand="Test", price=1.0).save()

        rows = execute_raw(
            "SELECT name, brand FROM test_ks.it_sync_products WHERE id = ?", [pid]
        )
        assert len(rows) == 1
        assert rows[0]["name"] == "RawSync"
        assert rows[0]["brand"] == "Test"

        SyncProduct(id=pid, name="").delete()

    def test_raw_insert_and_select(self, coodie_driver: object) -> None:
        """Raw INSERT followed by raw SELECT round-trips data."""
        from coodie.sync import execute_raw

        SyncProduct.sync_table()
        pid = uuid4()
        execute_raw(
            "INSERT INTO test_ks.it_sync_products (id, name, brand, category, price) "
            "VALUES (?, ?, ?, ?, ?)",
            [pid, "RawInserted", "RawBrand", "general", 2.5],
        )

        rows = execute_raw(
            "SELECT name FROM test_ks.it_sync_products WHERE id = ?", [pid]
        )
        assert len(rows) == 1
        assert rows[0]["name"] == "RawInserted"

        SyncProduct(id=pid, name="").delete()

    def test_raw_empty_result(self, coodie_driver: object) -> None:
        """Raw SELECT returning no rows gives an empty list."""
        from coodie.sync import execute_raw

        SyncProduct.sync_table()
        rows = execute_raw(
            "SELECT * FROM test_ks.it_sync_products WHERE id = ?", [uuid4()]
        )
        assert rows == []


@pytest.mark.integration
@pytest.mark.asyncio(loop_scope="session")
class TestAsyncRawCQL:
    """Test execute_raw (async) against a real ScyllaDB container."""

    async def test_raw_select(self, coodie_driver: object) -> None:
        """Raw async SELECT returns rows as list of dicts."""
        from coodie.aio import execute_raw

        await AsyncProduct.sync_table()
        pid = uuid4()
        await AsyncProduct(id=pid, name="RawAsync", brand="Test", price=1.0).save()

        rows = await execute_raw(
            "SELECT name, brand FROM test_ks.it_async_products WHERE id = ?", [pid]
        )
        assert len(rows) == 1
        assert rows[0]["name"] == "RawAsync"
        assert rows[0]["brand"] == "Test"

        await AsyncProduct(id=pid, name="").delete()

    async def test_raw_insert_and_select(self, coodie_driver: object) -> None:
        """Raw async INSERT followed by raw SELECT round-trips data."""
        from coodie.aio import execute_raw

        await AsyncProduct.sync_table()
        pid = uuid4()
        await execute_raw(
            "INSERT INTO test_ks.it_async_products (id, name, brand, category, price) "
            "VALUES (?, ?, ?, ?, ?)",
            [pid, "RawInserted", "RawBrand", "general", 2.5],
        )

        rows = await execute_raw(
            "SELECT name FROM test_ks.it_async_products WHERE id = ?", [pid]
        )
        assert len(rows) == 1
        assert rows[0]["name"] == "RawInserted"

        await AsyncProduct(id=pid, name="").delete()

    async def test_raw_empty_result(self, coodie_driver: object) -> None:
        """Raw async SELECT returning no rows gives an empty list."""
        from coodie.aio import execute_raw

        await AsyncProduct.sync_table()
        rows = await execute_raw(
            "SELECT * FROM test_ks.it_async_products WHERE id = ?", [uuid4()]
        )
        assert rows == []


# ===========================================================================
# Additional models for broader type / feature coverage
# ===========================================================================


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
        # cassandra-driver returns cassandra.util.Date, not datetime.date
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
        # cassandra-driver returns cassandra.util.Date, not datetime.date
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
    """Coerce cassandra-driver's CQL ``time`` value to ``datetime.time``.

    The driver may return:
    - A ``cassandra.util.Time`` object (which wraps nanoseconds since midnight)
    - A raw ``int`` (nanoseconds since midnight)

    We convert nanoseconds → microseconds then decompose into h/m/s/µs.
    """
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


# ===========================================================================
# Extended synchronous integration tests
# ===========================================================================


@pytest.mark.integration
class TestSyncExtended:
    """Extended sync tests: all CQL types, collections, LWT, batch, ordering."""

    # ------------------------------------------------------------------
    # DDL
    # ------------------------------------------------------------------

    def test_all_types_sync_table(self, coodie_driver: object) -> None:
        SyncAllTypes.sync_table()

    def test_event_sync_table(self, coodie_driver: object) -> None:
        SyncEvent.sync_table()

    # ------------------------------------------------------------------
    # CQL scalar types round-trip
    # ------------------------------------------------------------------

    def test_scalar_types_roundtrip(self, coodie_driver: object) -> None:
        """All supported scalar types survive a save/load round-trip."""
        SyncAllTypes.sync_table()
        rid = uuid4()
        today = date.today()
        now = datetime.now(timezone.utc).replace(microsecond=0)
        original = SyncAllTypes(
            id=rid,
            flag=True,
            count=42,
            score=3.14,
            amount=decimal.Decimal("12.34"),
            blob_val=b"\x00\xff",
            ts=now,
            day=today,
            ip4=ipaddress.IPv4Address("10.0.0.1"),
            ip6=ipaddress.IPv6Address("::1"),
        )
        original.save()

        fetched = SyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.flag is True
        assert fetched.count == 42
        assert abs(fetched.score - 3.14) < 0.01
        assert fetched.amount == decimal.Decimal("12.34")
        assert fetched.blob_val == b"\x00\xff"
        assert fetched.ts.replace(tzinfo=timezone.utc) == now
        assert fetched.day == today
        assert str(fetched.ip4) == "10.0.0.1"
        assert str(fetched.ip6) == "::1"

        SyncAllTypes(id=rid).delete()

    # ------------------------------------------------------------------
    # Collection types
    # ------------------------------------------------------------------

    def test_set_collection_roundtrip(self, coodie_driver: object) -> None:
        """set[str] column survives a save/load round-trip."""
        SyncAllTypes.sync_table()
        rid = uuid4()
        SyncAllTypes(id=rid, tags_set={"apple", "banana"}).save()

        fetched = SyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.tags_set == {"apple", "banana"}

        SyncAllTypes(id=rid).delete()

    def test_map_collection_roundtrip(self, coodie_driver: object) -> None:
        """dict[str, int] column survives a save/load round-trip."""
        SyncAllTypes.sync_table()
        rid = uuid4()
        SyncAllTypes(id=rid, scores_map={"a": 1, "b": 2}).save()

        fetched = SyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.scores_map == {"a": 1, "b": 2}

        SyncAllTypes(id=rid).delete()

    # ------------------------------------------------------------------
    # LWT — INSERT IF NOT EXISTS
    # ------------------------------------------------------------------

    def test_insert_if_not_exists_creates(self, coodie_driver: object) -> None:
        """insert() (IF NOT EXISTS) inserts when the row is absent."""
        SyncAllTypes.sync_table()
        rid = uuid4()
        row = SyncAllTypes(id=rid, count=7)
        row.insert()

        fetched = SyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.count == 7

        SyncAllTypes(id=rid).delete()

    def test_insert_if_not_exists_no_overwrite(self, coodie_driver: object) -> None:
        """insert() (IF NOT EXISTS) does NOT overwrite an existing row."""
        SyncAllTypes.sync_table()
        rid = uuid4()
        SyncAllTypes(id=rid, count=1).save()

        # Second insert with a different count — must not overwrite
        SyncAllTypes(id=rid, count=99).insert()

        fetched = SyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.count == 1  # original value preserved

        SyncAllTypes(id=rid).delete()

    # ------------------------------------------------------------------
    # Batch writes via raw CQL
    # ------------------------------------------------------------------

    def test_batch_insert(self, coodie_driver: object, driver_type: str) -> None:
        """build_insert statements combined in a BatchStatement insert atomically."""
        if driver_type == "acsylla":
            pytest.skip("BatchStatement is cassandra-driver specific")

        from cassandra.query import BatchStatement, BatchType  # type: ignore[import-untyped]
        from coodie.cql_builder import build_insert
        from coodie.drivers import get_driver

        SyncAllTypes.sync_table()
        rid1, rid2 = uuid4(), uuid4()

        # Include all required fields so that reading back via SyncAllTypes succeeds.
        row1 = SyncAllTypes(id=rid1, count=10)
        row2 = SyncAllTypes(id=rid2, count=20)
        stmt1, p1 = build_insert("it_all_types", "test_ks", row1.model_dump())
        stmt2, p2 = build_insert("it_all_types", "test_ks", row2.model_dump())

        drv = get_driver()
        batch = BatchStatement(batch_type=BatchType.LOGGED)
        batch.add(drv._session.prepare(stmt1), p1)
        batch.add(drv._session.prepare(stmt2), p2)
        drv._session.execute(batch)

        assert SyncAllTypes.find_one(id=rid1) is not None
        assert SyncAllTypes.find_one(id=rid2) is not None

        SyncAllTypes(id=rid1).delete()
        SyncAllTypes(id=rid2).delete()

    # ------------------------------------------------------------------
    # Composite partition key + multiple clustering columns
    # ------------------------------------------------------------------

    def test_composite_pk_and_clustering(self, coodie_driver: object) -> None:
        """Composite partition key rows are correctly partitioned and retrieved."""
        SyncEvent.sync_table()
        pa, pb = "alpha", "beta"
        SyncEvent(partition_a=pa, partition_b=pb, seq=1, sub=3, payload="first").save()
        SyncEvent(partition_a=pa, partition_b=pb, seq=1, sub=2, payload="second").save()
        SyncEvent(partition_a=pa, partition_b=pb, seq=2, sub=1, payload="third").save()

        results = SyncEvent.find(partition_a=pa, partition_b=pb).all()
        assert len(results) == 3

        SyncEvent.find(partition_a=pa, partition_b=pb).delete()

    def test_clustering_asc_order(self, coodie_driver: object) -> None:
        """ASC clustering key (seq) returns rows in ascending order."""
        SyncEvent.sync_table()
        pa, pb = "order_test", f"asc_{uuid4().hex[:6]}"
        for seq in [3, 1, 2]:
            SyncEvent(partition_a=pa, partition_b=pb, seq=seq, sub=0).save()

        results = SyncEvent.find(partition_a=pa, partition_b=pb).all()
        seqs = [r.seq for r in results]
        assert seqs == sorted(seqs)

        SyncEvent.find(partition_a=pa, partition_b=pb).delete()

    # ------------------------------------------------------------------
    # QuerySet.order_by and __len__
    # ------------------------------------------------------------------

    def test_queryset_order_by_clustering(self, coodie_driver: object) -> None:
        """order_by() on a clustering column returns expected sort order."""
        SyncReview.sync_table()
        pid = uuid4()
        t1 = datetime(2024, 6, 1, 0, 0, 0, tzinfo=timezone.utc)
        t2 = datetime(2024, 6, 2, 0, 0, 0, tzinfo=timezone.utc)
        SyncReview(product_id=pid, created_at=t1, author="X", rating=1).save()
        SyncReview(product_id=pid, created_at=t2, author="Y", rating=2).save()

        results_asc = SyncReview.find(product_id=pid).order_by("created_at").all()
        assert results_asc[0].created_at <= results_asc[-1].created_at

        SyncReview.find(product_id=pid).delete()

    def test_queryset_len(self, coodie_driver: object) -> None:
        """len(queryset) uses count() under the hood."""
        brand = f"LenBrand_{uuid4().hex[:6]}"
        ids = [uuid4(), uuid4()]
        for pid in ids:
            SyncProduct(id=pid, name="LenTest", brand=brand).save()

        qs = SyncProduct.find(brand=brand).allow_filtering()
        assert len(qs) >= 2

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_queryset_iter(self, coodie_driver: object) -> None:
        """Iterating over a QuerySet yields Document instances."""
        brand = f"IterBrand_{uuid4().hex[:6]}"
        ids = [uuid4(), uuid4()]
        for pid in ids:
            SyncProduct(id=pid, name="IterTest", brand=brand).save()

        items = list(SyncProduct.find(brand=brand).allow_filtering())
        assert all(isinstance(i, SyncProduct) for i in items)
        assert len(items) >= 2

        for pid in ids:
            SyncProduct(id=pid, name="").delete()

    def test_queryset_first(self, coodie_driver: object) -> None:
        """first() returns exactly one document or None."""
        pid = uuid4()
        SyncProduct(id=pid, name="FirstTest").save()

        result = SyncProduct.find(id=pid).first()
        assert result is not None
        assert result.id == pid

        assert SyncProduct.find(id=uuid4()).first() is None

        SyncProduct(id=pid, name="").delete()

    # ------------------------------------------------------------------
    # Schema migration — ALTER TABLE ADD column
    # ------------------------------------------------------------------

    def test_schema_migration_add_column(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """sync_table adds a new column to an existing table without data loss."""
        if driver_type == "acsylla":
            pytest.skip("AcsyllaDriver does not support ALTER TABLE ADD migration")

        from coodie.drivers import get_driver
        from coodie.cql_builder import build_create_table
        from coodie.schema import ColumnDefinition

        ks = "test_ks"
        tbl = "it_migration_test"

        # Bootstrap a minimal table (single column)
        drv = get_driver()
        initial_cols = [
            ColumnDefinition(name="id", cql_type="uuid", primary_key=True),
        ]
        drv._session.execute(build_create_table(tbl, ks, initial_cols))

        # Insert a row with just the PK
        rid = uuid4()
        drv._session.execute(
            drv._session.prepare(f"INSERT INTO {ks}.{tbl} (id) VALUES (?)"), [rid]
        )

        # Now migrate: add a new column via sync_table
        extended_cols = [
            ColumnDefinition(name="id", cql_type="uuid", primary_key=True),
            ColumnDefinition(name="label", cql_type="text"),
        ]
        drv.sync_table(tbl, ks, extended_cols)

        # The existing row is still there; the new column is NULL
        rows = drv.execute(f"SELECT id, label FROM {ks}.{tbl} WHERE id = ?", [rid])
        assert rows
        assert rows[0]["id"] == rid
        assert rows[0].get("label") is None

        # Cleanup
        drv._session.execute(f"DROP TABLE IF EXISTS {ks}.{tbl}")

    # ------------------------------------------------------------------
    # Phase-1 extended types round-trip
    # ------------------------------------------------------------------

    def test_extended_types_sync_table(self, coodie_driver: object) -> None:
        """sync_table for extended types should succeed."""
        SyncExtendedTypes.sync_table()

    def test_bigint_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """BigInt (bigint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, big_val=2**40).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.big_val == 2**40
        SyncExtendedTypes(id=rid).delete()

    def test_smallint_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """SmallInt (smallint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, small_val=32000).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.small_val == 32000
        SyncExtendedTypes(id=rid).delete()

    def test_tinyint_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """TinyInt (tinyint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, tiny_val=127).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.tiny_val == 127
        SyncExtendedTypes(id=rid).delete()

    def test_varint_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """VarInt (varint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, var_val=10**30).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.var_val == 10**30
        SyncExtendedTypes(id=rid).delete()

    def test_double_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """Double (double) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, dbl_val=3.141592653589793).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert abs(fetched.dbl_val - 3.141592653589793) < 1e-12
        SyncExtendedTypes(id=rid).delete()

    def test_ascii_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """Ascii (ascii) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, ascii_val="hello").save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.ascii_val == "hello"
        SyncExtendedTypes(id=rid).delete()

    def test_timeuuid_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """TimeUUID (timeuuid) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        from uuid import uuid1

        SyncExtendedTypes.sync_table()
        rid = uuid4()
        tuuid = uuid1()
        SyncExtendedTypes(id=rid, timeuuid_val=tuuid).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.timeuuid_val == tuuid
        SyncExtendedTypes(id=rid).delete()

    def test_time_roundtrip(self, coodie_driver: object, driver_type: str) -> None:
        """CQL time column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        t = dt_time(13, 45, 30)
        SyncExtendedTypes(id=rid, time_val=t).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.time_val is not None
        assert fetched.time_val.hour == 13
        assert fetched.time_val.minute == 45
        assert fetched.time_val.second == 30
        SyncExtendedTypes(id=rid).delete()

    def test_frozen_list_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """frozen<list<text>> column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, frozen_list=["a", "b", "c"]).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.frozen_list == ["a", "b", "c"]
        SyncExtendedTypes(id=rid).delete()

    def test_frozen_set_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """frozen<set<int>> column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, frozen_set={10, 20, 30}).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.frozen_set == {10, 20, 30}
        SyncExtendedTypes(id=rid).delete()

    def test_frozen_map_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """frozen<map<text, int>> column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        SyncExtendedTypes.sync_table()
        rid = uuid4()
        SyncExtendedTypes(id=rid, frozen_map={"x": 1, "y": 2}).save()
        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.frozen_map == {"x": 1, "y": 2}
        SyncExtendedTypes(id=rid).delete()

    def test_extended_types_all_fields_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """All extended type fields set together survive a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        from uuid import uuid1

        SyncExtendedTypes.sync_table()
        rid = uuid4()
        t = dt_time(9, 15, 0)
        tuuid = uuid1()
        original = SyncExtendedTypes(
            id=rid,
            big_val=2**40,
            small_val=1000,
            tiny_val=42,
            var_val=10**20,
            dbl_val=2.718281828,
            ascii_val="test",
            timeuuid_val=tuuid,
            time_val=t,
            frozen_list=["x"],
            frozen_set={7},
            frozen_map={"k": 99},
        )
        original.save()

        fetched = SyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.big_val == 2**40
        assert fetched.small_val == 1000
        assert fetched.tiny_val == 42
        assert fetched.var_val == 10**20
        assert abs(fetched.dbl_val - 2.718281828) < 1e-6
        assert fetched.ascii_val == "test"
        assert fetched.timeuuid_val == tuuid
        assert fetched.time_val is not None
        assert fetched.time_val.hour == 9
        assert fetched.frozen_list == ["x"]
        assert fetched.frozen_set == {7}
        assert fetched.frozen_map == {"k": 99}

        SyncExtendedTypes(id=rid).delete()

    # ------------------------------------------------------------------
    # Phase 11: QuerySet Enhancements
    # ------------------------------------------------------------------

    def test_only_column_projection(self, coodie_driver: object) -> None:
        """`.only()` returns Documents with only the selected columns populated."""
        SyncProduct.sync_table()
        pid = uuid4()
        SyncProduct(id=pid, name="OnlyTest", brand="OnlyBrand", price=5.0).save()

        from coodie.sync.query import QuerySet

        results = QuerySet(SyncProduct).filter(id=pid).only("id", "name").all()
        assert len(results) >= 1
        found = [r for r in results if r.id == pid][0]
        assert found.name == "OnlyTest"

        SyncProduct(id=pid, name="").delete()

    def test_defer_excludes_columns(self, coodie_driver: object) -> None:
        """`.defer()` excludes the specified columns from the SELECT."""
        SyncProduct.sync_table()
        pid = uuid4()
        SyncProduct(id=pid, name="DeferTest", brand="DeferBrand", price=7.0).save()

        from coodie.sync.query import QuerySet

        results = QuerySet(SyncProduct).filter(id=pid).defer("description").all()
        assert len(results) >= 1
        found = [r for r in results if r.id == pid][0]
        assert found.name == "DeferTest"

        SyncProduct(id=pid, name="").delete()

    def test_values_list_returns_tuples(self, coodie_driver: object) -> None:
        """`.values_list()` returns a list of tuples."""
        SyncProduct.sync_table()
        pid = uuid4()
        SyncProduct(id=pid, name="VLTest", brand="VLBrand", price=3.0).save()

        from coodie.sync.query import QuerySet

        results = QuerySet(SyncProduct).filter(id=pid).values_list("id", "name").all()
        assert len(results) >= 1
        assert isinstance(results[0], tuple)
        # Use str() for comparison: acsylla returns UUIDs as strings
        matching = [r for r in results if str(r[0]) == str(pid)]
        assert len(matching) == 1
        assert matching[0][1] == "VLTest"

        SyncProduct(id=pid, name="").delete()

    def test_per_partition_limit(self, coodie_driver: object) -> None:
        """`.per_partition_limit()` limits rows per partition."""
        SyncEvent.sync_table()
        pa = f"ppl_sync_{uuid4().hex[:6]}"
        pb = "ppl_b"
        for seq in range(5):
            SyncEvent(partition_a=pa, partition_b=pb, seq=seq, payload=f"p{seq}").save()

        from coodie.sync.query import QuerySet

        results = (
            QuerySet(SyncEvent)
            .filter(partition_a=pa, partition_b=pb)
            .per_partition_limit(2)
            .all()
        )
        assert len(results) <= 2

        QuerySet(SyncEvent).filter(partition_a=pa, partition_b=pb).delete()


# ===========================================================================
# Extended asynchronous integration tests
# ===========================================================================


@pytest.mark.integration
@pytest.mark.asyncio(loop_scope="session")
class TestAsyncExtended:
    """Async counterparts of the extended sync tests."""

    async def test_all_types_sync_table(self, coodie_driver: object) -> None:
        await AsyncAllTypes.sync_table()

    async def test_scalar_types_roundtrip(self, coodie_driver: object) -> None:
        await AsyncAllTypes.sync_table()
        rid = uuid4()
        today = date.today()
        now = datetime.now(timezone.utc).replace(microsecond=0)
        await AsyncAllTypes(
            id=rid,
            flag=True,
            count=99,
            score=2.71,
            amount=decimal.Decimal("99.99"),
            blob_val=b"\xde\xad",
            ts=now,
            day=today,
            ip4=ipaddress.IPv4Address("192.168.1.1"),
            ip6=ipaddress.IPv6Address("::ffff:192.168.1.1"),
        ).save()

        fetched = await AsyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.flag is True
        assert fetched.count == 99
        assert fetched.amount == decimal.Decimal("99.99")
        assert fetched.blob_val == b"\xde\xad"
        assert fetched.ts.replace(tzinfo=timezone.utc) == now
        assert fetched.day == today
        assert str(fetched.ip4) == "192.168.1.1"

        await AsyncAllTypes(id=rid).delete()

    async def test_set_collection_roundtrip(self, coodie_driver: object) -> None:
        await AsyncAllTypes.sync_table()
        rid = uuid4()
        await AsyncAllTypes(id=rid, tags_set={"x", "y"}).save()

        fetched = await AsyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.tags_set == {"x", "y"}

        await AsyncAllTypes(id=rid).delete()

    async def test_map_collection_roundtrip(self, coodie_driver: object) -> None:
        await AsyncAllTypes.sync_table()
        rid = uuid4()
        await AsyncAllTypes(id=rid, scores_map={"m": 7, "n": 8}).save()

        fetched = await AsyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.scores_map == {"m": 7, "n": 8}

        await AsyncAllTypes(id=rid).delete()

    async def test_insert_if_not_exists(self, coodie_driver: object) -> None:
        """async insert() (IF NOT EXISTS) does NOT overwrite an existing row."""
        await AsyncAllTypes.sync_table()
        rid = uuid4()
        await AsyncAllTypes(id=rid, count=5).save()
        await AsyncAllTypes(id=rid, count=50).insert()

        fetched = await AsyncAllTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.count == 5  # original preserved

        await AsyncAllTypes(id=rid).delete()

    async def test_composite_pk_and_clustering(self, coodie_driver: object) -> None:
        await AsyncEvent.sync_table()
        pa, pb = "async_alpha", f"async_beta_{uuid4().hex[:6]}"
        for seq in range(3):
            await AsyncEvent(
                partition_a=pa, partition_b=pb, seq=seq, payload=f"p{seq}"
            ).save()

        results = await AsyncEvent.find(partition_a=pa, partition_b=pb).all()
        assert len(results) == 3

        from coodie.aio.query import QuerySet as AioQS

        await AioQS(AsyncEvent).filter(partition_a=pa, partition_b=pb).delete()

    async def test_queryset_first(self, coodie_driver: object) -> None:
        rid = uuid4()
        await AsyncProduct(id=rid, name="AsyncFirst").save()

        result = await AsyncProduct.find(id=rid).first()
        assert result is not None
        assert result.id == rid

        assert await AsyncProduct.find(id=uuid4()).first() is None

        await AsyncProduct(id=rid, name="").delete()

    async def test_batch_insert(self, coodie_driver: object, driver_type: str) -> None:
        """build_insert statements combined in an async BatchStatement insert atomically."""
        if driver_type == "acsylla":
            pytest.skip("BatchStatement is cassandra-driver specific")

        from cassandra.query import BatchStatement, BatchType  # type: ignore[import-untyped]
        from coodie.cql_builder import build_insert
        from coodie.drivers import get_driver
        import asyncio

        await AsyncAllTypes.sync_table()
        rid1, rid2 = uuid4(), uuid4()

        # Include all required fields so that reading back via AsyncAllTypes succeeds.
        row1 = AsyncAllTypes(id=rid1, count=11)
        row2 = AsyncAllTypes(id=rid2, count=22)
        stmt1, p1 = build_insert("it_async_all_types", "test_ks", row1.model_dump())
        stmt2, p2 = build_insert("it_async_all_types", "test_ks", row2.model_dump())

        drv = get_driver()
        batch = BatchStatement(batch_type=BatchType.LOGGED)
        batch.add(drv._session.prepare(stmt1), p1)
        batch.add(drv._session.prepare(stmt2), p2)

        loop = asyncio.get_event_loop()
        future = drv._session.execute_async(batch)
        result_future: asyncio.Future = loop.create_future()
        future.add_callbacks(
            lambda r: loop.call_soon_threadsafe(result_future.set_result, r),
            lambda e: loop.call_soon_threadsafe(result_future.set_exception, e),
        )
        await result_future

        assert await AsyncAllTypes.find_one(id=rid1) is not None
        assert await AsyncAllTypes.find_one(id=rid2) is not None

        await AsyncAllTypes(id=rid1).delete()
        await AsyncAllTypes(id=rid2).delete()

    # ------------------------------------------------------------------
    # Phase-1 extended types round-trip
    # ------------------------------------------------------------------

    async def test_extended_types_sync_table(self, coodie_driver: object) -> None:
        """sync_table for extended types should succeed."""
        await AsyncExtendedTypes.sync_table()

    async def test_bigint_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """BigInt (bigint) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, big_val=2**40).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.big_val == 2**40
        await AsyncExtendedTypes(id=rid).delete()

    async def test_smallint_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """SmallInt (smallint) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, small_val=32000).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.small_val == 32000
        await AsyncExtendedTypes(id=rid).delete()

    async def test_tinyint_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """TinyInt (tinyint) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, tiny_val=127).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.tiny_val == 127
        await AsyncExtendedTypes(id=rid).delete()

    async def test_varint_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """VarInt (varint) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, var_val=10**30).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.var_val == 10**30
        await AsyncExtendedTypes(id=rid).delete()

    async def test_double_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """Double (double) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, dbl_val=3.141592653589793).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert abs(fetched.dbl_val - 3.141592653589793) < 1e-12
        await AsyncExtendedTypes(id=rid).delete()

    async def test_ascii_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """Ascii (ascii) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, ascii_val="hello").save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.ascii_val == "hello"
        await AsyncExtendedTypes(id=rid).delete()

    async def test_timeuuid_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """TimeUUID (timeuuid) column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        from uuid import uuid1

        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        tuuid = uuid1()
        await AsyncExtendedTypes(id=rid, timeuuid_val=tuuid).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.timeuuid_val == tuuid
        await AsyncExtendedTypes(id=rid).delete()

    async def test_time_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """CQL time column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        t = dt_time(13, 45, 30)
        await AsyncExtendedTypes(id=rid, time_val=t).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.time_val is not None
        assert fetched.time_val.hour == 13
        assert fetched.time_val.minute == 45
        assert fetched.time_val.second == 30
        await AsyncExtendedTypes(id=rid).delete()

    async def test_frozen_list_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """frozen<list<text>> column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, frozen_list=["a", "b", "c"]).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.frozen_list == ["a", "b", "c"]
        await AsyncExtendedTypes(id=rid).delete()

    async def test_frozen_set_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """frozen<set<int>> column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, frozen_set={10, 20, 30}).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.frozen_set == {10, 20, 30}
        await AsyncExtendedTypes(id=rid).delete()

    async def test_frozen_map_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """frozen<map<text, int>> column survives an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        await AsyncExtendedTypes(id=rid, frozen_map={"x": 1, "y": 2}).save()
        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.frozen_map == {"x": 1, "y": 2}
        await AsyncExtendedTypes(id=rid).delete()

    async def test_extended_types_all_fields_roundtrip(
        self, coodie_driver: object, driver_type: str
    ) -> None:
        """All extended type fields set together survive an async save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip(
                "acsylla prepared binding does not support extended CQL types yet"
            )
        from uuid import uuid1

        await AsyncExtendedTypes.sync_table()
        rid = uuid4()
        t = dt_time(9, 15, 0)
        tuuid = uuid1()
        original = AsyncExtendedTypes(
            id=rid,
            big_val=2**40,
            small_val=1000,
            tiny_val=42,
            var_val=10**20,
            dbl_val=2.718281828,
            ascii_val="test",
            timeuuid_val=tuuid,
            time_val=t,
            frozen_list=["x"],
            frozen_set={7},
            frozen_map={"k": 99},
        )
        await original.save()

        fetched = await AsyncExtendedTypes.find_one(id=rid)
        assert fetched is not None
        assert fetched.big_val == 2**40
        assert fetched.small_val == 1000
        assert fetched.tiny_val == 42
        assert fetched.var_val == 10**20
        assert abs(fetched.dbl_val - 2.718281828) < 1e-6
        assert fetched.ascii_val == "test"
        assert fetched.timeuuid_val == tuuid
        assert fetched.time_val is not None
        assert fetched.time_val.hour == 9
        assert fetched.frozen_list == ["x"]
        assert fetched.frozen_set == {7}
        assert fetched.frozen_map == {"k": 99}

        await AsyncExtendedTypes(id=rid).delete()

    # ------------------------------------------------------------------
    # Phase 11: QuerySet Enhancements (async)
    # ------------------------------------------------------------------

    async def test_only_column_projection(self, coodie_driver: object) -> None:
        """`.only()` returns Documents with only the selected columns populated."""
        await AsyncProduct.sync_table()
        pid = uuid4()
        await AsyncProduct(id=pid, name="OnlyAsync", brand="OnlyB", price=5.0).save()

        from coodie.aio.query import QuerySet

        results = await QuerySet(AsyncProduct).filter(id=pid).only("id", "name").all()
        assert len(results) >= 1
        found = [r for r in results if r.id == pid][0]
        assert found.name == "OnlyAsync"

        await AsyncProduct(id=pid, name="").delete()

    async def test_defer_excludes_columns(self, coodie_driver: object) -> None:
        """`.defer()` excludes the specified columns from the SELECT."""
        await AsyncProduct.sync_table()
        pid = uuid4()
        await AsyncProduct(id=pid, name="DeferAsync", brand="DeferB", price=7.0).save()

        from coodie.aio.query import QuerySet

        results = await QuerySet(AsyncProduct).filter(id=pid).defer("description").all()
        assert len(results) >= 1
        found = [r for r in results if r.id == pid][0]
        assert found.name == "DeferAsync"

        await AsyncProduct(id=pid, name="").delete()

    async def test_values_list_returns_tuples(self, coodie_driver: object) -> None:
        """`.values_list()` returns a list of tuples."""
        await AsyncProduct.sync_table()
        pid = uuid4()
        await AsyncProduct(id=pid, name="VLAsync", brand="VLB", price=3.0).save()

        from coodie.aio.query import QuerySet

        results = (
            await QuerySet(AsyncProduct).filter(id=pid).values_list("id", "name").all()
        )
        assert len(results) >= 1
        assert isinstance(results[0], tuple)
        # Use str() for comparison: acsylla returns UUIDs as strings
        matching = [r for r in results if str(r[0]) == str(pid)]
        assert len(matching) == 1
        assert matching[0][1] == "VLAsync"

        await AsyncProduct(id=pid, name="").delete()

    async def test_per_partition_limit(self, coodie_driver: object) -> None:
        """`.per_partition_limit()` limits rows per partition."""
        await AsyncEvent.sync_table()
        pa = f"ppl_async_{uuid4().hex[:6]}"
        pb = "ppl_b"
        for seq in range(5):
            await AsyncEvent(
                partition_a=pa, partition_b=pb, seq=seq, payload=f"p{seq}"
            ).save()

        from coodie.aio.query import QuerySet

        results = (
            await QuerySet(AsyncEvent)
            .filter(partition_a=pa, partition_b=pb)
            .per_partition_limit(2)
            .all()
        )
        assert len(results) <= 2

        await QuerySet(AsyncEvent).filter(partition_a=pa, partition_b=pb).delete()
