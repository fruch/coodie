"""Product embedding model for the coodie vector search demo."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.aio import Document
from coodie.fields import Indexed, PrimaryKey, Vector, VectorIndex


class ProductEmbedding(Document):
    """A product with a pre-computed embedding vector for ANN search.

    Partition key = ``product_id`` (UUID).
    The ``embedding`` column stores a 16-dimensional float vector and is indexed
    with a cosine-similarity vector index for fast approximate nearest-neighbor
    queries.
    """

    product_id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    category: Annotated[str, Indexed()]
    description: str = ""
    price: float = 0.0
    embedding: Annotated[
        list[float],
        Vector(dimensions=16),
        VectorIndex(similarity_function="COSINE"),
    ] = Field(default_factory=list)

    class Settings:
        name = "product_embeddings"
        keyspace = "vector_demo"
