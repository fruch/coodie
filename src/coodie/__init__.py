__version__ = "0.0.1"

from coodie.aio import Document, QuerySet, init_coodie
from coodie.exceptions import (
    CoodieError,
    DocumentNotFound,
    MultipleDocumentsFound,
    ConfigurationError,
    InvalidQueryError,
)
from coodie.fields import PrimaryKey, ClusteringKey, Indexed, Counter

__all__ = [
    "Document",
    "QuerySet",
    "init_coodie",
    "CoodieError",
    "DocumentNotFound",
    "MultipleDocumentsFound",
    "ConfigurationError",
    "InvalidQueryError",
    "PrimaryKey",
    "ClusteringKey",
    "Indexed",
    "Counter",
]
