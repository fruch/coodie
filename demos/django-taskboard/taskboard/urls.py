"""URL configuration for the Hivemind Kanban task board."""

from django.urls import include, path

urlpatterns = [
    path("", include("tasks.urls")),
]
