from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.aio import Document
from coodie.fields import PrimaryKey, Vector, VectorIndex


class DistressSignal(Document):
    signal_id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    callsign: str
    origin: str
    signal_text: str
    category: str  # hull_breach / life_support / navigation / engine_failure / unknown
    threat_level: str  # CRITICAL / HIGH / MEDIUM / LOW / NOISE
    embedding: Annotated[
        list[float],
        Vector(dimensions=384),
        VectorIndex(similarity_function="COSINE"),
    ] = Field(default_factory=list)

    class Settings:
        name = "distress_signals"
        keyspace = "vector_demo"
