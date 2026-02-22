from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.fields import Discriminator, PrimaryKey
from coodie.sync.document import Document


# ------------------------------------------------------------------
# Model hierarchy
# ------------------------------------------------------------------


class Pet(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""
    pet_type: Annotated[str, Discriminator()] = ""

    class Settings:
        name = "pets"
        keyspace = "test_ks"


class Cat(Pet):
    cuteness: float = 0.0

    class Settings:
        __discriminator_value__ = "cat"


class Dog(Pet):
    loudness: int = 0

    class Settings:
        __discriminator_value__ = "dog"


# ------------------------------------------------------------------
# 9.1 – Discriminator value in Settings
# ------------------------------------------------------------------


def test_discriminator_value_on_subclass():
    assert Cat.Settings.__discriminator_value__ == "cat"
    assert Dog.Settings.__discriminator_value__ == "dog"


def test_no_discriminator_value_on_base():
    assert not hasattr(Pet.Settings, "__discriminator_value__")


# ------------------------------------------------------------------
# 9.2 – Discriminator column detected by schema helpers
# ------------------------------------------------------------------


def test_find_discriminator_column():
    from coodie.schema import _find_discriminator_column

    assert _find_discriminator_column(Pet) == "pet_type"
    assert _find_discriminator_column(Cat) == "pet_type"
    assert _find_discriminator_column(Dog) == "pet_type"


def test_find_discriminator_column_not_polymorphic():
    from coodie.schema import _find_discriminator_column

    class Plain(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = "plain"
            keyspace = "test_ks"

    assert _find_discriminator_column(Plain) is None


def test_resolve_polymorphic_base():
    from coodie.schema import _resolve_polymorphic_base

    assert _resolve_polymorphic_base(Pet) is Pet
    assert _resolve_polymorphic_base(Cat) is Pet
    assert _resolve_polymorphic_base(Dog) is Pet


def test_build_subclass_map():
    from coodie.schema import _build_subclass_map

    mapping = _build_subclass_map(Pet)
    assert mapping["cat"] is Cat
    assert mapping["dog"] is Dog
    # Pet has no __discriminator_value__ so it's not in the map
    assert "pet" not in mapping


def test_discriminator_column_in_schema():
    """The discriminator column appears in build_schema output."""
    from coodie.schema import build_schema

    # Clear cache to rebuild
    if hasattr(Pet, "__schema__") and "__schema__" in Pet.__dict__:
        delattr(Pet, "__schema__")
    schema = build_schema(Pet)
    col_names = [c.name for c in schema]
    assert "pet_type" in col_names


# ------------------------------------------------------------------
# 9.3 – find()/get() auto-filter by discriminator
# ------------------------------------------------------------------


def test_subclass_find_adds_discriminator_filter(registered_mock_driver):
    qs = Cat.find(name="Whiskers")
    # Verify discriminator filter was added
    disc_filters = [(col, op, val) for col, op, val in qs._where if col == "pet_type"]
    assert len(disc_filters) == 1
    assert disc_filters[0] == ("pet_type", "=", "cat")


def test_base_find_no_discriminator_filter(registered_mock_driver):
    qs = Pet.find(name="Any")
    disc_filters = [(col, op, val) for col, op, val in qs._where if col == "pet_type"]
    assert len(disc_filters) == 0


def test_subclass_find_one_filters(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "Whiskers", "pet_type": "cat", "cuteness": 9.5}]
    )
    doc = Cat.find_one(name="Whiskers")
    assert doc is not None
    assert isinstance(doc, Cat)
    stmt, params = registered_mock_driver.executed[0]
    assert '"pet_type" = ?' in stmt
    assert "cat" in params


def test_subclass_get_filters(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "Buddy", "pet_type": "dog", "loudness": 8}]
    )
    doc = Dog.get(name="Buddy")
    assert isinstance(doc, Dog)
    stmt, params = registered_mock_driver.executed[0]
    assert '"pet_type" = ?' in stmt
    assert "dog" in params


# ------------------------------------------------------------------
# 9.4 – save()/insert() auto-set discriminator
# ------------------------------------------------------------------


def test_save_sets_discriminator(registered_mock_driver):
    cat = Cat(name="Whiskers", cuteness=9.5)
    cat.save()
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.pets" in stmt
    assert "cat" in params


def test_insert_sets_discriminator(registered_mock_driver):
    dog = Dog(name="Buddy", loudness=8)
    dog.insert()
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.pets" in stmt
    assert "IF NOT EXISTS" in stmt
    assert "dog" in params


def test_base_save_without_discriminator_value(registered_mock_driver):
    """Base class without __discriminator_value__ saves normally."""
    pet = Pet(name="Generic")
    pet.save()
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.pets" in stmt
    # pet_type should be the default empty string, not overwritten
    assert "cat" not in params
    assert "dog" not in params


# ------------------------------------------------------------------
# 9.5 – Polymorphic deserialization (correct subclass from base query)
# ------------------------------------------------------------------


def test_base_query_returns_correct_subclasses(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {
                "id": uuid4(),
                "name": "Whiskers",
                "pet_type": "cat",
                "cuteness": 9.5,
                "loudness": None,
            },
            {
                "id": uuid4(),
                "name": "Buddy",
                "pet_type": "dog",
                "cuteness": None,
                "loudness": 8,
            },
        ]
    )
    results = Pet.find().all()
    assert len(results) == 2
    assert isinstance(results[0], Cat)
    assert results[0].name == "Whiskers"
    assert results[0].cuteness == 9.5
    assert isinstance(results[1], Dog)
    assert results[1].name == "Buddy"
    assert results[1].loudness == 8


def test_unknown_discriminator_falls_back_to_queried_class(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [{"id": uuid4(), "name": "Parrot", "pet_type": "bird"}]
    )
    results = Pet.find().all()
    assert len(results) == 1
    assert isinstance(results[0], Pet)
    assert results[0].name == "Parrot"


def test_subclass_query_returns_only_subclass(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "Whiskers", "pet_type": "cat", "cuteness": 9.5}]
    )
    results = Cat.find().all()
    assert len(results) == 1
    assert isinstance(results[0], Cat)
    assert results[0].cuteness == 9.5


# ------------------------------------------------------------------
# Table/keyspace delegation
# ------------------------------------------------------------------


def test_subclass_uses_base_table():
    assert Cat._get_table() == "pets"
    assert Dog._get_table() == "pets"
    assert Pet._get_table() == "pets"


def test_subclass_uses_base_keyspace():
    assert Cat._get_keyspace() == "test_ks"
    assert Dog._get_keyspace() == "test_ks"


# ------------------------------------------------------------------
# Base class with discriminator_value
# ------------------------------------------------------------------


class Vehicle(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    make: str = ""
    vehicle_type: Annotated[str, Discriminator()] = ""

    class Settings:
        name = "vehicles"
        keyspace = "test_ks"
        __discriminator_value__ = "vehicle"


class Truck(Vehicle):
    payload_tons: float = 0.0

    class Settings:
        __discriminator_value__ = "truck"


def test_base_with_discriminator_value_filters(registered_mock_driver):
    """Base with __discriminator_value__ also auto-filters."""
    qs = Vehicle.find(make="Ford")
    disc_filters = [
        (col, op, val) for col, op, val in qs._where if col == "vehicle_type"
    ]
    assert len(disc_filters) == 1
    assert disc_filters[0] == ("vehicle_type", "=", "vehicle")


def test_base_with_discriminator_value_saves(registered_mock_driver):
    v = Vehicle(make="Ford")
    v.save()
    stmt, params = registered_mock_driver.executed[0]
    assert "vehicle" in params


# ------------------------------------------------------------------
# Edge cases
# ------------------------------------------------------------------


def test_queryset_iter_polymorphic(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "Whiskers", "pet_type": "cat", "cuteness": 9.5},
        ]
    )
    items = list(Pet.find())
    assert len(items) == 1
    assert isinstance(items[0], Cat)


def test_queryset_first_polymorphic(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [{"id": uuid4(), "name": "Buddy", "pet_type": "dog", "loudness": 8}]
    )
    doc = Pet.find().first()
    assert isinstance(doc, Dog)
