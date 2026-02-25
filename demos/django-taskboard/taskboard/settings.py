"""Django settings for the Hivemind Kanban task board demo."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "demo-secret-key-not-for-production"

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "tasks.apps.TasksConfig",
]

MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Use cookie-based CSRF so we don't need SessionMiddleware
CSRF_USE_SESSIONS = False

ROOT_URLCONF = "taskboard.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "taskboard.wsgi.application"

# Django uses SQLite for its own tables (minimal — no auth in this demo)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

STATIC_URL = "static/"

# ScyllaDB / Cassandra connection settings (used by coodie)
SCYLLA_HOSTS = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
SCYLLA_KEYSPACE = os.getenv("SCYLLA_KEYSPACE", "taskboard")
