try:
    from importlib.metadata import version, PackageNotFoundError

    try:
        __version__ = version("coodie")
    except PackageNotFoundError:
        try:
            from coodie._version import __version__  # type: ignore[no-redef]
        except ImportError:
            __version__ = "unknown"
except ImportError:
    __version__ = "unknown"

from coodie.aio import (
    Document,
    CounterDocument,
    MaterializedView,
    QuerySet,
    init_coodie,
    execute_raw,
    create_keyspace,
    drop_keyspace,
)
from coodie.batch import BatchQuery, AsyncBatchQuery
from coodie.exceptions import (
    CoodieError,
    DocumentNotFound,
    MultipleDocumentsFound,
    ConfigurationError,
    InvalidQueryError,
    MigrationError,
)
from coodie.fields import (
    Ascii,
    BigInt,
    ClusteringKey,
    Counter,
    Discriminator,
    Double,
    Frozen,
    Indexed,
    PrimaryKey,
    SmallInt,
    Static,
    Time,
    TimeUUID,
    TinyInt,
    VarInt,
    Vector,
    VectorIndex,
)
from coodie.lazy import LazyDocument
from coodie.results import LWTResult, PagedResult
from coodie.usertype import UserType

__all__ = [
    "Document",
    "CounterDocument",
    "MaterializedView",
    "QuerySet",
    "LazyDocument",
    "init_coodie",
    "execute_raw",
    "create_keyspace",
    "drop_keyspace",
    "BatchQuery",
    "AsyncBatchQuery",
    "CoodieError",
    "DocumentNotFound",
    "MultipleDocumentsFound",
    "ConfigurationError",
    "InvalidQueryError",
    "MigrationError",
    "PrimaryKey",
    "ClusteringKey",
    "Indexed",
    "Counter",
    "Discriminator",
    "Static",
    "BigInt",
    "SmallInt",
    "TinyInt",
    "VarInt",
    "Double",
    "Ascii",
    "TimeUUID",
    "Time",
    "Frozen",
    "LWTResult",
    "PagedResult",
    "UserType",
    "Vector",
    "VectorIndex",
]
