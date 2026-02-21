from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from coodie.drivers import get_driver, register_driver, _registry
from coodie.drivers.base import AbstractDriver
from coodie.exceptions import ConfigurationError
from tests.conftest import MockDriver


def test_register_and_get_driver(mock_driver):
    _registry.clear()
    register_driver("test", mock_driver, default=True)
    assert get_driver("test") is mock_driver
    assert get_driver() is mock_driver
    _registry.clear()


def test_get_driver_no_registration_raises():
    _registry.clear()
    with pytest.raises(ConfigurationError):
        get_driver()
    _registry.clear()


def test_mock_driver_execute(mock_driver):
    mock_driver.set_return_rows([{"id": "1", "name": "Alice"}])
    rows = mock_driver.execute("SELECT * FROM ks.t", [])
    assert rows == [{"id": "1", "name": "Alice"}]
    assert mock_driver.executed[0][0] == "SELECT * FROM ks.t"


async def test_mock_driver_execute_async(mock_driver):
    mock_driver.set_return_rows([{"id": "2"}])
    rows = await mock_driver.execute_async("SELECT * FROM ks.t", [])
    assert rows == [{"id": "2"}]


def test_abstract_driver_cannot_instantiate():
    with pytest.raises(TypeError):
        AbstractDriver()
