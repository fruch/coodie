from __future__ import annotations

from typing import Annotated, Optional
from uuid import UUID, uuid4

import pytest
from pydantic import Field

from coodie.fields import PrimaryKey, ClusteringKey, Indexed, Counter
from coodie.sync.document import Document, CounterDocument, MaterializedView
from coodie.exceptions import (
    DocumentNotFound,
    MultipleDocumentsFound,
    InvalidQueryError,
)


class Product(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0
    description: Optional[str] = None

    class Settings:
        name = "products"
        keyspace = "test_ks"


def test_sync_table(registered_mock_driver):
    Product.sync_table()
    assert any("SYNC_TABLE" in stmt for stmt, _ in registered_mock_driver.executed)


def test_save(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save()
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.products" in stmt


def test_insert_if_not_exists(registered_mock_driver):
    p = Product(name="Widget")
    p.insert()
    stmt, _ = registered_mock_driver.executed[0]
    assert "IF NOT EXISTS" in stmt


def test_delete(registered_mock_driver):
    p = Product(name="Widget")
    p.delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM test_ks.products" in stmt


def test_find_returns_queryset(registered_mock_driver):
    from coodie.sync.query import QuerySet

    qs = Product.find(brand="Acme")
    assert isinstance(qs, QuerySet)


def test_find_one_returns_document(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "X", "brand": "Acme", "price": 1.0, "description": None}]
    )
    doc = Product.find_one(brand="Acme")
    assert isinstance(doc, Product)
    assert doc.brand == "Acme"


def test_find_one_returns_none_when_empty(registered_mock_driver):
    doc = Product.find_one(brand="NoSuch")
    assert doc is None


def test_get_raises_document_not_found(registered_mock_driver):
    with pytest.raises(DocumentNotFound):
        Product.get(brand="NoSuch")


def test_find_one_raises_multiple_found(registered_mock_driver):
    pid1, pid2 = uuid4(), uuid4()
    registered_mock_driver.set_return_rows(
        [
            {
                "id": pid1,
                "name": "A",
                "brand": "Acme",
                "price": 1.0,
                "description": None,
            },
            {
                "id": pid2,
                "name": "B",
                "brand": "Acme",
                "price": 2.0,
                "description": None,
            },
        ]
    )
    with pytest.raises(MultipleDocumentsFound):
        Product.find_one(brand="Acme")


def test_get_table_name():
    assert Product._get_table() == "products"


def test_snake_case_default_table_name():
    class MyDocument(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = ""
            keyspace = "test_ks"

    assert MyDocument._get_table() == "my_document"


# ------------------------------------------------------------------
# CounterDocument tests
# ------------------------------------------------------------------


class PageView(CounterDocument):
    url: Annotated[str, PrimaryKey()]
    view_count: Annotated[int, Counter()] = 0
    unique_visitors: Annotated[int, Counter()] = 0

    class Settings:
        name = "page_views"
        keyspace = "test_ks"


def test_counter_save_raises(registered_mock_driver):
    pv = PageView(url="/home")
    with pytest.raises(InvalidQueryError, match="do not support save"):
        pv.save()


def test_counter_insert_raises(registered_mock_driver):
    pv = PageView(url="/home")
    with pytest.raises(InvalidQueryError, match="do not support insert"):
        pv.insert()


def test_counter_increment(registered_mock_driver):
    pv = PageView(url="/home")
    pv.increment(view_count=1)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.page_views" in stmt
    assert '"view_count" = "view_count" + ?' in stmt
    assert 'WHERE "url" = ?' in stmt
    assert params == [1, "/home"]


def test_counter_increment_multiple(registered_mock_driver):
    pv = PageView(url="/home")
    pv.increment(view_count=5, unique_visitors=1)
    stmt, params = registered_mock_driver.executed[0]
    assert '"view_count" = "view_count" + ?' in stmt
    assert '"unique_visitors" = "unique_visitors" + ?' in stmt
    assert params == [5, 1, "/home"]


def test_counter_decrement(registered_mock_driver):
    pv = PageView(url="/home")
    pv.decrement(view_count=1)
    stmt, params = registered_mock_driver.executed[0]
    assert '"view_count" = "view_count" + ?' in stmt
    assert params == [-1, "/home"]


# --- Phase 3: Document.update() ---


class TaggedProduct(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""
    price: float = 0.0
    tags: set[str] = set()
    items: list[str] = []

    class Settings:
        name = "tagged_products"
        keyspace = "test_ks"


def test_update_basic(registered_mock_driver):
    p = TaggedProduct(name="Widget", price=9.99)
    p.update(name="Gadget", price=19.99)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.tagged_products" in stmt
    assert '"name" = ?' in stmt
    assert '"price" = ?' in stmt
    assert "Gadget" in params
    assert 19.99 in params


def test_update_updates_local_fields(registered_mock_driver):
    p = TaggedProduct(name="Widget", price=9.99)
    p.update(name="Gadget")
    assert p.name == "Gadget"


def test_update_with_ttl(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(ttl=600, name="Gadget")
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 600" in stmt


def test_update_with_if_conditions(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(if_conditions={"name": "Widget"}, name="Gadget")
    stmt, params = registered_mock_driver.executed[0]
    assert 'IF "name" = ?' in stmt
    assert "Widget" in params


def test_update_collection_add(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(tags__add={"new_tag"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" + ?' in stmt
    assert {"new_tag"} in params


def test_update_collection_remove(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(tags__remove={"old_tag"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" - ?' in stmt
    assert {"old_tag"} in params


def test_update_collection_append(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(items__append=["z"])
    stmt, params = registered_mock_driver.executed[0]
    assert '"items" = "items" + ?' in stmt
    assert ["z"] in params


def test_update_collection_prepend(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(items__prepend=["a"])
    stmt, params = registered_mock_driver.executed[0]
    assert '"items" = ? + "items"' in stmt
    assert ["a"] in params


def test_update_noop_when_empty(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update()
    assert len(registered_mock_driver.executed) == 0
    assert p.name == "Widget"


# ------------------------------------------------------------------
# LWT / update() tests
# ------------------------------------------------------------------


def test_update_generates_update_cql(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.update(name="NewWidget")
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.products" in stmt
    assert 'SET "name" = ?' in stmt
    assert "NewWidget" in params


def test_update_with_if_conditions_not_applied(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": False, "name": "OtherName"}])
    p = Product(name="Widget", price=9.99)
    result = p.update(if_conditions={"name": "Widget"}, name="NewWidget")
    assert result is not None
    assert result.applied is False
    assert result.existing == {"name": "OtherName"}


def test_update_with_if_exists(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    p = Product(name="Widget", price=9.99)
    result = p.update(if_exists=True, name="NewWidget")
    stmt, _ = registered_mock_driver.executed[0]
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_update_no_kwargs_noop(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    result = p.update()
    assert result is None
    assert len(registered_mock_driver.executed) == 0


def test_delete_if_exists(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    p = Product(name="Widget")
    result = p.delete(if_exists=True)
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM test_ks.products" in stmt
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_delete_if_exists_not_applied(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": False}])
    p = Product(name="Widget")
    result = p.delete(if_exists=True)
    assert result is not None
    assert result.applied is False


def test_delete_without_if_exists_returns_none(registered_mock_driver):
    p = Product(name="Widget")
    result = p.delete()
    assert result is None


# ------------------------------------------------------------------
# Phase 5: Query Execution Options on Document
# ------------------------------------------------------------------


def test_save_with_timestamp(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_save_with_ttl_and_timestamp(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(ttl=60, timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 60 AND TIMESTAMP 1234567890" in stmt


def test_save_with_consistency(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(consistency="LOCAL_QUORUM")
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


def test_save_with_timeout(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(timeout=5.0)
    assert registered_mock_driver.last_timeout == 5.0


def test_insert_with_timestamp(registered_mock_driver):
    p = Product(name="Widget")
    p.insert(timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_insert_with_consistency(registered_mock_driver):
    p = Product(name="Widget")
    p.insert(consistency="LOCAL_QUORUM")
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


def test_delete_with_timestamp(registered_mock_driver):
    p = Product(name="Widget")
    p.delete(timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_delete_with_consistency(registered_mock_driver):
    p = Product(name="Widget")
    p.delete(consistency="LOCAL_QUORUM")
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


# ------------------------------------------------------------------
# execute_raw tests
# ------------------------------------------------------------------


def test_execute_raw(registered_mock_driver):
    from coodie.sync import execute_raw

    registered_mock_driver.set_return_rows(
        [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
    )
    rows = execute_raw("SELECT * FROM test_ks.users")
    assert len(rows) == 2
    assert rows[0]["name"] == "Alice"
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "SELECT * FROM test_ks.users"
    assert params == []


def test_execute_raw_with_params(registered_mock_driver):
    from coodie.sync import execute_raw

    registered_mock_driver.set_return_rows([{"id": 1, "name": "Alice"}])
    rows = execute_raw("SELECT * FROM test_ks.users WHERE id = ?", [1])
    assert len(rows) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "SELECT * FROM test_ks.users WHERE id = ?"
    assert params == [1]


def test_execute_raw_empty_result(registered_mock_driver):
    from coodie.sync import execute_raw

    rows = execute_raw("SELECT * FROM test_ks.users WHERE id = ?", [999])
    assert rows == []


def test_execute_raw_insert(registered_mock_driver):
    from coodie.sync import execute_raw

    execute_raw("INSERT INTO test_ks.users (id, name) VALUES (?, ?)", [1, "Alice"])
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO" in stmt
    assert params == [1, "Alice"]


# ------------------------------------------------------------------
# Phase 8: Model Enhancements
# ------------------------------------------------------------------


def test_create_classmethod(registered_mock_driver):
    """8.1 – Document.create(**kwargs) constructs + saves."""
    doc = Product.create(name="NewWidget", price=42.0)
    assert isinstance(doc, Product)
    assert doc.name == "NewWidget"
    assert doc.price == 42.0
    assert len(registered_mock_driver.executed) == 1
    stmt, _ = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.products" in stmt


def test_abstract_skips_sync_table(registered_mock_driver):
    """8.2 – __abstract__ = True prevents table creation."""

    class AbstractBase(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = "abstract_base"
            keyspace = "test_ks"
            __abstract__ = True

    AbstractBase.sync_table()
    assert len(registered_mock_driver.executed) == 0


def test_default_ttl_in_sync_table(registered_mock_driver):
    """8.3 – __default_ttl__ is passed as table_options."""

    class TTLModel(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = "ttl_models"
            keyspace = "test_ks"
            __default_ttl__ = 86400

    TTLModel.sync_table()
    # MockDriver records SYNC_TABLE, but we verify the options are extracted
    options = TTLModel._get_table_options()
    assert options == {"default_time_to_live": 86400}


def test_options_in_sync_table(registered_mock_driver):
    """8.4 – __options__ dict is passed as table_options."""

    class OptionsModel(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = "options_models"
            keyspace = "test_ks"
            __options__ = {"gc_grace_seconds": 864000, "comment": "test table"}

    OptionsModel.sync_table()
    options = OptionsModel._get_table_options()
    assert options == {"gc_grace_seconds": 864000, "comment": "test table"}


def test_default_ttl_merged_with_options():
    """8.3+8.4 – __default_ttl__ is merged into __options__."""

    class MergedModel(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = "merged"
            keyspace = "test_ks"
            __default_ttl__ = 3600
            __options__ = {"gc_grace_seconds": 1000}

    options = MergedModel._get_table_options()
    assert options == {"default_time_to_live": 3600, "gc_grace_seconds": 1000}


def test_connection_setting(registered_mock_driver):
    """8.5 – Settings.connection selects named driver."""
    from coodie.drivers import register_driver

    second = type(registered_mock_driver)()
    register_driver("secondary", second)

    class ConnectedModel(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        name: str = ""

        class Settings:
            name = "connected"
            keyspace = "test_ks"
            connection = "secondary"

    doc = ConnectedModel(name="Hi")
    doc.save()
    assert len(second.executed) == 1
    assert len(registered_mock_driver.executed) == 0


def test_drop_table(registered_mock_driver):
    """8.6 – drop_table() classmethod."""
    Product.drop_table()
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "DROP TABLE IF EXISTS test_ks.products"
    assert params == []


def test_table_name():
    """8.7 – table_name() wraps _get_table()."""
    assert Product.table_name() == "products"


def test_table_name_snake_case():
    """8.7 – table_name() uses snake_case when no Settings.name."""

    class MySpecialDocument(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = ""
            keyspace = "test_ks"

    assert MySpecialDocument.table_name() == "my_special_document"


# ------------------------------------------------------------------
# Phase 12: Materialized View
# ------------------------------------------------------------------


class ProductsByBrand(MaterializedView):
    brand: Annotated[str, PrimaryKey()]
    id: Annotated[UUID, ClusteringKey()] = Field(default_factory=uuid4)
    name: str = ""
    price: float = 0.0

    class Settings:
        name = "products_by_brand"
        keyspace = "test_ks"
        __base_table__ = "products"


def test_materialized_view_sync_view(registered_mock_driver):
    """12.3 – sync_view() generates CREATE MATERIALIZED VIEW."""
    ProductsByBrand.sync_view()
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "CREATE MATERIALIZED VIEW IF NOT EXISTS test_ks.products_by_brand" in stmt
    assert "AS SELECT * FROM test_ks.products" in stmt
    assert '"brand" IS NOT NULL' in stmt
    assert '"id" IS NOT NULL' in stmt
    assert params == []


def test_materialized_view_drop_view(registered_mock_driver):
    """12.3 – drop_view() generates DROP MATERIALIZED VIEW."""
    ProductsByBrand.drop_view()
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "DROP MATERIALIZED VIEW IF EXISTS test_ks.products_by_brand"
    assert params == []


def test_materialized_view_save_raises(registered_mock_driver):
    """12.3 – save() is forbidden on materialized views."""
    mv = ProductsByBrand(brand="Acme")
    with pytest.raises(InvalidQueryError, match="read-only"):
        mv.save()


def test_materialized_view_insert_raises(registered_mock_driver):
    """12.3 – insert() is forbidden on materialized views."""
    mv = ProductsByBrand(brand="Acme")
    with pytest.raises(InvalidQueryError, match="read-only"):
        mv.insert()


def test_materialized_view_delete_raises(registered_mock_driver):
    """12.3 – delete() is forbidden on materialized views."""
    mv = ProductsByBrand(brand="Acme")
    with pytest.raises(InvalidQueryError, match="read-only"):
        mv.delete()


def test_materialized_view_update_raises(registered_mock_driver):
    """12.3 – update() is forbidden on materialized views."""
    mv = ProductsByBrand(brand="Acme")
    with pytest.raises(InvalidQueryError, match="read-only"):
        mv.update(name="X")


def test_materialized_view_find(registered_mock_driver):
    """12.3 – find() works on materialized views (read operations allowed)."""
    from coodie.sync.query import QuerySet

    qs = ProductsByBrand.find(brand="Acme")
    assert isinstance(qs, QuerySet)


def test_materialized_view_find_one(registered_mock_driver):
    """12.3 – find_one() works on materialized views."""
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"brand": "Acme", "id": pid, "name": "Widget", "price": 9.99}]
    )
    doc = ProductsByBrand.find_one(brand="Acme")
    assert isinstance(doc, ProductsByBrand)
    assert doc.brand == "Acme"


def test_materialized_view_no_base_table_raises():
    """12.3 – Missing __base_table__ raises InvalidQueryError."""

    class BadView(MaterializedView):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = "bad_view"
            keyspace = "test_ks"

    with pytest.raises(InvalidQueryError, match="__base_table__"):
        BadView._get_base_table()


def test_materialized_view_custom_where_clause(registered_mock_driver):
    """12.3 – Custom __where_clause__ is used."""

    class CustomWhereView(MaterializedView):
        brand: Annotated[str, PrimaryKey()]
        id: Annotated[UUID, ClusteringKey()] = Field(default_factory=uuid4)
        name: str = ""

        class Settings:
            name = "custom_where_view"
            keyspace = "test_ks"
            __base_table__ = "products"
            __where_clause__ = (
                '"brand" IS NOT NULL AND "id" IS NOT NULL AND "brand" = \'Acme\''
            )

    CustomWhereView.sync_view()
    stmt, _ = registered_mock_driver.executed[0]
    assert "\"brand\" = 'Acme'" in stmt


def test_materialized_view_custom_columns(registered_mock_driver):
    """12.3 – Custom __view_columns__ selects specific columns."""

    class ColumnsView(MaterializedView):
        brand: Annotated[str, PrimaryKey()]
        id: Annotated[UUID, ClusteringKey()] = Field(default_factory=uuid4)
        name: str = ""

        class Settings:
            name = "columns_view"
            keyspace = "test_ks"
            __base_table__ = "products"
            __view_columns__ = ["brand", "id", "name"]

    ColumnsView.sync_view()
    stmt, _ = registered_mock_driver.executed[0]
    assert 'SELECT "brand", "id", "name" FROM test_ks.products' in stmt
