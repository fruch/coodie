"""Extended integration tests — merged sync + async.

Covers: all CQL types, collections, LWT, batch, composite keys,
ordering, schema migration, extended types, and QuerySet enhancements.
Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

import decimal
import ipaddress
from datetime import date, datetime, time as dt_time, timezone
from uuid import uuid1, uuid4

import pytest

from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestExtended:
    """Extended sync+async tests: all CQL types, collections, LWT, batch, ordering."""

    # ------------------------------------------------------------------
    # DDL
    # ------------------------------------------------------------------

    async def test_all_types_sync_table(self, coodie_driver, AllTypes) -> None:
        await _maybe_await(AllTypes.sync_table)

    async def test_event_sync_table(self, coodie_driver, Event) -> None:
        await _maybe_await(Event.sync_table)

    # ------------------------------------------------------------------
    # CQL scalar types round-trip
    # ------------------------------------------------------------------

    async def test_scalar_types_roundtrip(self, coodie_driver, AllTypes) -> None:
        """All supported scalar types survive a save/load round-trip."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        today = date.today()
        now = datetime.now(timezone.utc).replace(microsecond=0)
        original = AllTypes(
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
        await _maybe_await(original.save)

        fetched = await _maybe_await(AllTypes.find_one, id=rid)
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

        await _maybe_await(AllTypes(id=rid).delete)

    # ------------------------------------------------------------------
    # Collection types
    # ------------------------------------------------------------------

    async def test_set_collection_roundtrip(self, coodie_driver, AllTypes) -> None:
        """set[str] column survives a save/load round-trip."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        await _maybe_await(AllTypes(id=rid, tags_set={"apple", "banana"}).save)

        fetched = await _maybe_await(AllTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.tags_set == {"apple", "banana"}

        await _maybe_await(AllTypes(id=rid).delete)

    async def test_map_collection_roundtrip(self, coodie_driver, AllTypes) -> None:
        """dict[str, int] column survives a save/load round-trip."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        await _maybe_await(AllTypes(id=rid, scores_map={"a": 1, "b": 2}).save)

        fetched = await _maybe_await(AllTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.scores_map == {"a": 1, "b": 2}

        await _maybe_await(AllTypes(id=rid).delete)

    # ------------------------------------------------------------------
    # LWT — INSERT IF NOT EXISTS
    # ------------------------------------------------------------------

    async def test_insert_if_not_exists_creates(self, coodie_driver, AllTypes) -> None:
        """insert() (IF NOT EXISTS) inserts when the row is absent."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        row = AllTypes(id=rid, count=7)
        await _maybe_await(row.insert)

        fetched = await _maybe_await(AllTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.count == 7

        await _maybe_await(AllTypes(id=rid).delete)

    async def test_insert_if_not_exists_no_overwrite(self, coodie_driver, AllTypes) -> None:
        """insert() (IF NOT EXISTS) does NOT overwrite an existing row."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        await _maybe_await(AllTypes(id=rid, count=1).save)

        # Second insert with a different count — must not overwrite
        await _maybe_await(AllTypes(id=rid, count=99).insert)

        fetched = await _maybe_await(AllTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.count == 1  # original value preserved

        await _maybe_await(AllTypes(id=rid).delete)

    # ------------------------------------------------------------------
    # Batch writes
    # ------------------------------------------------------------------

    async def test_batch_insert(self, coodie_driver, AllTypes, variant) -> None:
        """build_insert statements combined in a batch insert atomically."""
        from coodie.cql_builder import build_insert

        await _maybe_await(AllTypes.sync_table)
        table = AllTypes.Settings.name
        rid1, rid2 = uuid4(), uuid4()

        row1 = AllTypes(id=rid1, count=10)
        row2 = AllTypes(id=rid2, count=20)
        stmt1, p1 = build_insert(table, "test_ks", row1.model_dump())
        stmt2, p2 = build_insert(table, "test_ks", row2.model_dump())

        if variant == "sync":
            from coodie.batch import BatchQuery

            with BatchQuery() as batch:
                batch.add(stmt1, p1)
                batch.add(stmt2, p2)
        else:
            from coodie.batch import AsyncBatchQuery

            async with AsyncBatchQuery() as batch:
                batch.add(stmt1, p1)
                batch.add(stmt2, p2)

        assert await _maybe_await(AllTypes.find_one, id=rid1) is not None
        assert await _maybe_await(AllTypes.find_one, id=rid2) is not None

        await _maybe_await(AllTypes(id=rid1).delete)
        await _maybe_await(AllTypes(id=rid2).delete)

    # ------------------------------------------------------------------
    # Composite partition key + multiple clustering columns
    # ------------------------------------------------------------------

    async def test_composite_pk_and_clustering(self, coodie_driver, Event, QS) -> None:
        """Composite partition key rows are correctly partitioned and retrieved."""
        await _maybe_await(Event.sync_table)
        pa, pb = "alpha", f"beta_{uuid4().hex[:6]}"
        await _maybe_await(Event(partition_a=pa, partition_b=pb, seq=1, sub=3, payload="first").save)
        await _maybe_await(Event(partition_a=pa, partition_b=pb, seq=1, sub=2, payload="second").save)
        await _maybe_await(Event(partition_a=pa, partition_b=pb, seq=2, sub=1, payload="third").save)

        results = await _maybe_await(Event.find(partition_a=pa, partition_b=pb).all)
        assert len(results) == 3

        await _maybe_await(QS(Event).filter(partition_a=pa, partition_b=pb).delete)

    async def test_clustering_asc_order(self, coodie_driver, Event, QS) -> None:
        """ASC clustering key (seq) returns rows in ascending order."""
        await _maybe_await(Event.sync_table)
        pa, pb = "order_test", f"asc_{uuid4().hex[:6]}"
        for seq in [3, 1, 2]:
            await _maybe_await(Event(partition_a=pa, partition_b=pb, seq=seq, sub=0).save)

        results = await _maybe_await(Event.find(partition_a=pa, partition_b=pb).all)
        seqs = [r.seq for r in results]
        assert seqs == sorted(seqs)

        await _maybe_await(QS(Event).filter(partition_a=pa, partition_b=pb).delete)

    # ------------------------------------------------------------------
    # QuerySet.order_by and __len__
    # ------------------------------------------------------------------

    async def test_queryset_order_by_clustering(self, coodie_driver, Review) -> None:
        """order_by() on a clustering column returns expected sort order."""
        await _maybe_await(Review.sync_table)
        pid = uuid4()
        t1 = datetime(2024, 6, 1, 0, 0, 0, tzinfo=timezone.utc)
        t2 = datetime(2024, 6, 2, 0, 0, 0, tzinfo=timezone.utc)
        await _maybe_await(Review(product_id=pid, created_at=t1, author="X", rating=1).save)
        await _maybe_await(Review(product_id=pid, created_at=t2, author="Y", rating=2).save)

        results_asc = await _maybe_await(Review.find(product_id=pid).order_by("created_at").all)
        assert results_asc[0].created_at <= results_asc[-1].created_at

        await _maybe_await(Review.find(product_id=pid).delete)

    async def test_queryset_len(self, coodie_driver, Product, variant) -> None:
        """len(queryset) uses count() under the hood (sync only)."""
        if variant == "async":
            pytest.skip("len() is sync-only; async uses count()")

        brand = f"LenBrand_{uuid4().hex[:6]}"
        ids = [uuid4(), uuid4()]
        for pid in ids:
            Product(id=pid, name="LenTest", brand=brand).save()

        from coodie.sync.query import QuerySet

        qs = QuerySet(Product).filter(brand=brand).allow_filtering()
        assert len(qs) >= 2

        for pid in ids:
            Product(id=pid, name="").delete()

    async def test_queryset_first(self, coodie_driver, Product) -> None:
        """first() returns exactly one document or None."""
        pid = uuid4()
        await _maybe_await(Product(id=pid, name="FirstTest").save)

        result = await _maybe_await(Product.find(id=pid).first)
        assert result is not None
        assert result.id == pid

        assert await _maybe_await(Product.find(id=uuid4()).first) is None

        await _maybe_await(Product(id=pid, name="").delete)

    # ------------------------------------------------------------------
    # Schema migration — ALTER TABLE ADD column
    # ------------------------------------------------------------------

    async def test_schema_migration_add_column(self, coodie_driver, driver_type, variant) -> None:
        """sync_table adds a new column to an existing table without data loss."""
        if variant == "async":
            pytest.skip("schema migration test uses driver.execute() directly (sync)")

        from coodie.drivers import get_driver
        from coodie.schema import ColumnDefinition

        ks = "test_ks"
        tbl = "it_migration_test"

        drv = get_driver()
        initial_cols = [
            ColumnDefinition(name="id", cql_type="uuid", primary_key=True),
        ]
        drv.sync_table(tbl, ks, initial_cols)

        rid = uuid4()
        drv.execute(f'INSERT INTO {ks}.{tbl} ("id") VALUES (?)', [rid])

        extended_cols = [
            ColumnDefinition(name="id", cql_type="uuid", primary_key=True),
            ColumnDefinition(name="label", cql_type="text"),
        ]
        drv.sync_table(tbl, ks, extended_cols)

        rows = drv.execute(f'SELECT "id", "label" FROM {ks}.{tbl} WHERE "id" = ?', [rid])
        assert rows
        assert str(rows[0]["id"]) == str(rid)
        assert rows[0].get("label") is None

        drv.execute(f"DROP TABLE IF EXISTS {ks}.{tbl}", [])

    # ------------------------------------------------------------------
    # Phase-1 extended types round-trip
    # ------------------------------------------------------------------

    async def test_extended_types_sync_table(self, coodie_driver, ExtendedTypes) -> None:
        """sync_table for extended types should succeed."""
        await _maybe_await(ExtendedTypes.sync_table)

    async def test_bigint_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """BigInt (bigint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, big_val=2**40).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.big_val == 2**40
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_smallint_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """SmallInt (smallint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, small_val=32000).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.small_val == 32000
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_tinyint_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """TinyInt (tinyint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, tiny_val=127).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.tiny_val == 127
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_varint_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """VarInt (varint) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, var_val=10**30).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.var_val == 10**30
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_double_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """Double (double) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, dbl_val=3.141592653589793).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert abs(fetched.dbl_val - 3.141592653589793) < 1e-12
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_ascii_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """Ascii (ascii) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, ascii_val="hello").save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.ascii_val == "hello"
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_timeuuid_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """TimeUUID (timeuuid) column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        tuuid = uuid1()
        await _maybe_await(ExtendedTypes(id=rid, timeuuid_val=tuuid).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.timeuuid_val == tuuid
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_time_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """CQL time column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        t = dt_time(13, 45, 30)
        await _maybe_await(ExtendedTypes(id=rid, time_val=t).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.time_val is not None
        assert fetched.time_val.hour == 13
        assert fetched.time_val.minute == 45
        assert fetched.time_val.second == 30
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_frozen_list_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """frozen<list<text>> column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, frozen_list=["a", "b", "c"]).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.frozen_list == ["a", "b", "c"]
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_frozen_set_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """frozen<set<int>> column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, frozen_set={10, 20, 30}).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.frozen_set == {10, 20, 30}
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_frozen_map_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """frozen<map<text, int>> column survives a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        await _maybe_await(ExtendedTypes(id=rid, frozen_map={"x": 1, "y": 2}).save)
        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
        assert fetched is not None
        assert fetched.frozen_map == {"x": 1, "y": 2}
        await _maybe_await(ExtendedTypes(id=rid).delete)

    async def test_extended_types_all_fields_roundtrip(self, coodie_driver, ExtendedTypes, driver_type) -> None:
        """All extended type fields set together survive a save/load round-trip."""
        if driver_type == "acsylla":
            pytest.skip("acsylla prepared binding does not support extended CQL types")
        await _maybe_await(ExtendedTypes.sync_table)
        rid = uuid4()
        t = dt_time(9, 15, 0)
        tuuid = uuid1()
        original = ExtendedTypes(
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
        await _maybe_await(original.save)

        fetched = await _maybe_await(ExtendedTypes.find_one, id=rid)
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

        await _maybe_await(ExtendedTypes(id=rid).delete)
