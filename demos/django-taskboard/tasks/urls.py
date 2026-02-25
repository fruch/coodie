"""URL configuration for the tasks app."""

from django.urls import path

from . import views

urlpatterns = [
    path("", views.board, name="board"),
    path("tasks/create/", views.task_create, name="task_create"),
    path("tasks/<str:board_id>/<str:created_at>/move/", views.task_move, name="task_move"),
    path("tasks/<str:board_id>/<str:created_at>/delete/", views.task_delete, name="task_delete"),
]
