import typing
from typing import Any, Callable, Generator, Type

from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model as CassandraModel
from cassandra.cqlengine.models import ModelMetaClass as CassandraModelMetaClass
from pydantic.main import BaseModel, Extra, ModelField, ModelMetaclass


@classmethod  # type: ignore
def __get_validators__(cls: Any) -> Generator[Callable[[Any], None], None, None]:
    yield cls.__validate


@classmethod  # type: ignore
def __validate(cls: Any, v: Any) -> None:
    return cls().validate(v)


columns.Column.__get_validators__ = __get_validators__
columns.Column.__validate = __validate


class AddColumsType(type):
    def __new__(mcs, name: str, bases: tuple[Any], attrs: dict[str, Any]) -> Any:

        is_abstract = attrs["__abstract__"] = attrs.get("__abstract__", False)
        if not is_abstract:
            for base in bases:
                annotations = typing.get_type_hints(base) | attrs.get(
                    "__annotations__", {}
                )
                fields = attrs.get("__fields__", {})
                base._defined_columns = {
                    k: v.__column__type__(**v.__kwargs__)
                    for k, v in annotations.items()
                    if hasattr(v, "__column__type__")
                }

                base._defined_columns |= {
                    k: v()
                    for k, v in annotations.items()
                    if isinstance(v, type) and issubclass(v, columns.Column)
                }

                base._defined_columns |= {
                    k: v
                    for k, v in annotations.items()
                    if isinstance(v, columns.Column)
                }

                base._defined_columns |= {
                    k: v.default
                    for k, v in fields.items()
                    if isinstance(v.default, columns.Column)
                }
                base._defined_columns |= {
                    k: v.field_info.default
                    for k, v in fields.items()
                    if isinstance(v.field_info.default, columns.Column)
                }

                for k, v in base._defined_columns.items():
                    field: ModelField = attrs.get("__fields__", {}).get(k)
                    if field:
                        field.required = v.required
                        field.default = v.default

        klass = super().__new__(mcs, name, bases, attrs)
        return klass


class CombinedType(ModelMetaclass, AddColumsType, CassandraModelMetaClass):
    pass


class ColumnFamily(BaseModel, CassandraModel, metaclass=CombinedType):
    __abstract__ = True

    def __init__(self, **kwargs: dict[str, Any]):
        BaseModel.__init__(self, **kwargs)
        CassandraModel.__init__(self, **kwargs)

        # private field we want to hide from pydantic
        self.__exclude_fields__ = {
            "_is_persisted",
            "_conditional",
            "_timeout",
            "_values",
            "__exclude_fields__",
            "_timestamp",
            "_ttl",
            "_batch",
            "_connection",
        }

        # update all values that pydantic create using default factories
        for k, v in self.dict().items():
            if value := self._values.get(k):
                value.setval(v)

    def validate(self) -> None:
        return CassandraModel.validate(self)

    class Config:
        extra = Extra.allow


def PrimaryKey(typ: Type[object]) -> Type[object]:
    class NewType(typ):  # type: ignore
        __kwargs__ = dict(primary_key=True)
        __column__type__ = columns.UUID  # need to automatically map

    NewType.__name__ = f"PrimaryKey {typ.__name__}"
    return NewType


def Indexed(typ: Type[object]) -> Type[object]:
    class NewType(typ):  # type: ignore
        __kwargs__ = dict(index=True)
        __column__type__ = (
            columns.Text
        )  # need to automatically map from str/int/float and other simple types

    NewType.__name__ = f"Indexed {typ.__name__}"
    return NewType
