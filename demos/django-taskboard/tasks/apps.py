"""Django app configuration for the tasks app."""

from __future__ import annotations

import os
import sys

from django.apps import AppConfig
from django.conf import settings


class TasksConfig(AppConfig):
    """Tasks app — initializes coodie once at startup via ready()."""

    name = "tasks"
    _coodie_ready = False

    def ready(self) -> None:
        """Connect to ScyllaDB/Cassandra when Django starts."""
        if TasksConfig._coodie_ready:
            return
        # Ensure cassandra_models is importable from the project root
        project_root = os.path.dirname(os.path.dirname(__file__))
        if project_root not in sys.path:
            sys.path.insert(0, project_root)

        from coodie.sync import init_coodie

        init_coodie(hosts=settings.SCYLLA_HOSTS, keyspace=settings.SCYLLA_KEYSPACE)
        TasksConfig._coodie_ready = True
