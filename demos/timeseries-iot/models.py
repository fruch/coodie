"""Sensor reading models for the Time-Series IoT demo.

Demonstrates time-bucketed partitions and clustering keys with DESC order:

- **Composite partition key** (``sensor_id`` + ``date_bucket``) keeps each
  sensor's daily data in its own partition — ideal for time-series workloads.
- **ClusteringKey(order="DESC")** stores readings newest-first so the most
  recent values are always at the top of each partition.
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Annotated

from pydantic import Field

from coodie.aio import Document
from coodie.fields import ClusteringKey, Indexed, PrimaryKey


class SensorReading(Document):
    """A single sensor telemetry reading.

    Partition key = ``(sensor_id, date_bucket)``; clustering = ``ts DESC``.
    This layout stores one partition per sensor per day with the newest
    reading always at the physical start of the partition.
    """

    sensor_id: Annotated[str, PrimaryKey(partition_key_index=0)]
    date_bucket: Annotated[date, PrimaryKey(partition_key_index=1)]
    ts: Annotated[datetime, ClusteringKey(order="DESC")] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    temperature: float
    humidity: float
    pressure: float
    battery_pct: Annotated[int, Indexed()] = 100

    class Settings:
        name = "sensor_readings"
        keyspace = "iot"
