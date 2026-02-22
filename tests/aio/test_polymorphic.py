from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

import pytest
from pydantic import Field

from coodie.fields import Discriminator, PrimaryKey
from coodie.aio.document import Document


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
# 9.3 – find()/get() auto-filter by discriminator
# ------------------------------------------------------------------


def test_subclass_find_adds_discriminator_filter(registered_mock_driver):
    qs = Cat.find(name="Whiskers")
    disc_filters = [(col, op, val) for col, op, val in qs._where if col == "pet_type"]
    assert len(disc_filters) == 1
    assert disc_filters[0] == ("pet_type", "=", "cat")


def test_base_find_no_discriminator_filter(registered_mock_driver):
    qs = Pet.find(name="Any")
    disc_filters = [(col, op, val) for col, op, val in qs._where if col == "pet_type"]
    assert len(disc_filters) == 0


@pytest.mark.asyncio
async def test_subclass_find_one_filters(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "Whiskers", "pet_type": "cat", "cuteness": 9.5}]
    )
    doc = await Cat.find_one(name="Whiskers")
    assert doc is not None
    assert isinstance(doc, Cat)
    stmt, params = registered_mock_driver.executed[0]
    assert '"pet_type" = ?' in stmt
    assert "cat" in params


@pytest.mark.asyncio
async def test_subclass_get_filters(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "Buddy", "pet_type": "dog", "loudness": 8}]
    )
    doc = await Dog.get(name="Buddy")
    assert isinstance(doc, Dog)
    stmt, params = registered_mock_driver.executed[0]
    assert '"pet_type" = ?' in stmt
    assert "dog" in params


# ------------------------------------------------------------------
# 9.4 – save()/insert() auto-set discriminator
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_save_sets_discriminator(registered_mock_driver):
    cat = Cat(name="Whiskers", cuteness=9.5)
    await cat.save()
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.pets" in stmt
    assert "cat" in params


@pytest.mark.asyncio
async def test_insert_sets_discriminator(registered_mock_driver):
    dog = Dog(name="Buddy", loudness=8)
    await dog.insert()
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.pets" in stmt
    assert "IF NOT EXISTS" in stmt
    assert "dog" in params


# ------------------------------------------------------------------
# 9.5 – Polymorphic deserialization
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_base_query_returns_correct_subclasses(registered_mock_driver):
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
    results = await Pet.find().all()
    assert len(results) == 2
    assert isinstance(results[0], Cat)
    assert results[0].name == "Whiskers"
    assert results[0].cuteness == 9.5
    assert isinstance(results[1], Dog)
    assert results[1].name == "Buddy"
    assert results[1].loudness == 8


@pytest.mark.asyncio
async def test_unknown_discriminator_falls_back_to_queried_class(
    registered_mock_driver,
):
    registered_mock_driver.set_return_rows(
        [{"id": uuid4(), "name": "Parrot", "pet_type": "bird"}]
    )
    results = await Pet.find().all()
    assert len(results) == 1
    assert isinstance(results[0], Pet)
    assert results[0].name == "Parrot"


@pytest.mark.asyncio
async def test_subclass_query_returns_only_subclass(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "Whiskers", "pet_type": "cat", "cuteness": 9.5}]
    )
    results = await Cat.find().all()
    assert len(results) == 1
    assert isinstance(results[0], Cat)
    assert results[0].cuteness == 9.5


# ------------------------------------------------------------------
# Table/keyspace delegation
# ------------------------------------------------------------------


def test_subclass_uses_base_table():
    assert Cat._get_table() == "pets"
    assert Dog._get_table() == "pets"


def test_subclass_uses_base_keyspace():
    assert Cat._get_keyspace() == "test_ks"
    assert Dog._get_keyspace() == "test_ks"
