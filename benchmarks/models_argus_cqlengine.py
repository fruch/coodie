"""cqlengine model definitions inspired by scylladb/argus patterns.

Real-world models drawn from Argus's User, TestRun, Event, Notification, and
Comment tables to benchmark patterns found in production applications.
"""

import uuid
from datetime import datetime, timezone

from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model


class CqlArgusUser(Model):
    """User model — secondary-index lookups, List<Text> roles, save-after-mutate."""

    __table_name__ = "bench_argus_user"
    __keyspace__ = "bench_ks"

    id = columns.UUID(primary_key=True, default=uuid.uuid4)
    username = columns.Text(index=True)
    full_name = columns.Text()
    email = columns.Text(index=True)
    registration_date = columns.DateTime(default=lambda: datetime.now(timezone.utc))
    roles = columns.List(value_type=columns.Text)
    picture_id = columns.UUID()
    api_token = columns.Text(index=True)


class CqlArgusTestRun(Model):
    """TestRun model — composite partition key + clustering, many indexes.

    Mirrors Argus PluginModelBase: build_id partition, start_time clustering DESC.
    """

    __table_name__ = "bench_argus_test_run"
    __keyspace__ = "bench_ks"

    build_id = columns.Text(primary_key=True, partition_key=True)
    start_time = columns.DateTime(
        primary_key=True,
        clustering_order="DESC",
        default=lambda: datetime.now(timezone.utc),
    )
    id = columns.UUID(index=True, default=uuid.uuid4)
    release_id = columns.UUID(index=True)
    group_id = columns.UUID(index=True)
    test_id = columns.UUID(index=True)
    assignee = columns.UUID(index=True)
    status = columns.Text(default=lambda: "created")
    investigation_status = columns.Text(default=lambda: "not_investigated")
    heartbeat = columns.Integer(default=lambda: 0)
    end_time = columns.DateTime()
    build_job_url = columns.Text()
    scylla_version = columns.Text()


class CqlArgusEvent(Model):
    """Event model — UUID partition + multiple indexes, sorted by created_at."""

    __table_name__ = "bench_argus_event"
    __keyspace__ = "bench_ks"

    id = columns.UUID(primary_key=True, default=uuid.uuid4)
    release_id = columns.UUID(index=True)
    group_id = columns.UUID(index=True)
    test_id = columns.UUID(index=True)
    run_id = columns.UUID(index=True)
    user_id = columns.UUID(index=True)
    kind = columns.Text(index=True)
    body = columns.Text()
    created_at = columns.DateTime(default=lambda: datetime.now(timezone.utc))


class CqlArgusNotification(Model):
    """Notification model — partition by receiver, TimeUUID clustering DESC.

    Mirrors Argus ArgusNotification: receiver is partition key, id (TimeUUID)
    is clustering key DESC for time-ordered reads per user.
    """

    __table_name__ = "bench_argus_notification"
    __keyspace__ = "bench_ks"

    receiver = columns.UUID(primary_key=True, partition_key=True)
    id = columns.TimeUUID(primary_key=True, clustering_order="DESC", default=uuid.uuid1)
    type = columns.Text()
    state = columns.Integer(default=lambda: 0)
    sender = columns.UUID()
    source_type = columns.Text()
    source_id = columns.UUID()
    title = columns.Text()
    content = columns.Text()


class CqlArgusComment(Model):
    """Comment model — partition by id, clustering by posted_at DESC."""

    __table_name__ = "bench_argus_comment"
    __keyspace__ = "bench_ks"

    id = columns.UUID(primary_key=True, partition_key=True, default=uuid.uuid4)
    test_run_id = columns.UUID(index=True)
    user_id = columns.UUID(index=True)
    release_id = columns.UUID(index=True)
    posted_at = columns.BigInt(primary_key=True, clustering_order="DESC")
    message = columns.Text()
    mentions = columns.List(value_type=columns.UUID, default=[])
    reactions = columns.Map(key_type=columns.Text, value_type=columns.Integer)
