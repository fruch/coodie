"""Unit tests for the coodie CLI (migrations/cli.py)."""

from __future__ import annotations

import pytest

from coodie.migrations.cli import _build_parser, main


class TestCLIParser:
    def test_no_command_returns_1(self, capsys):
        result = main([])
        assert result == 1

    def test_migrate_requires_keyspace(self):
        parser = _build_parser()
        with pytest.raises(SystemExit):
            parser.parse_args(["migrate"])

    def test_migrate_parses_all_flags(self):
        parser = _build_parser()
        args = parser.parse_args(
            [
                "migrate",
                "--keyspace",
                "test_ks",
                "--hosts",
                "10.0.0.1",
                "10.0.0.2",
                "--migrations-dir",
                "/tmp/migrations",
                "--dry-run",
                "--target",
                "20260115_001",
            ]
        )
        assert args.keyspace == "test_ks"
        assert args.hosts == ["10.0.0.1", "10.0.0.2"]
        assert args.migrations_dir == "/tmp/migrations"
        assert args.dry_run is True
        assert args.target == "20260115_001"

    def test_migrate_rollback_flags(self):
        parser = _build_parser()
        args = parser.parse_args(
            [
                "migrate",
                "--keyspace",
                "test_ks",
                "--rollback",
                "--steps",
                "3",
            ]
        )
        assert args.rollback is True
        assert args.steps == 3

    def test_migrate_status_flag(self):
        parser = _build_parser()
        args = parser.parse_args(
            [
                "migrate",
                "--keyspace",
                "test_ks",
                "--status",
            ]
        )
        assert args.status is True

    def test_default_driver_type(self):
        parser = _build_parser()
        args = parser.parse_args(["migrate", "--keyspace", "test_ks"])
        assert args.driver_type == "scylla"
