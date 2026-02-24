from __future__ import annotations

import inspect

import coodie.aio.document as aio_doc
import coodie.sync.document as sync_doc


def public_methods(cls: type) -> set[str]:
    return {name for name, _ in inspect.getmembers(cls, predicate=inspect.isfunction) if not name.startswith("_")}


def test_document_public_method_parity():
    """Both sync and async Document must expose the same set of public method names."""
    sync_methods = public_methods(sync_doc.Document)
    async_methods = public_methods(aio_doc.Document)

    # These should be identical — if not, there's API drift
    assert sync_methods == async_methods, (
        f"API drift detected!\nsync-only: {sync_methods - async_methods}\nasync-only: {async_methods - sync_methods}"
    )


def test_counter_document_public_method_parity():
    """Both sync and async CounterDocument must expose the same set of public method names."""
    sync_methods = public_methods(sync_doc.CounterDocument)
    async_methods = public_methods(aio_doc.CounterDocument)

    assert sync_methods == async_methods, (
        f"CounterDocument API drift detected!\n"
        f"sync-only: {sync_methods - async_methods}\n"
        f"async-only: {async_methods - sync_methods}"
    )


def test_materialized_view_public_method_parity():
    """Both sync and async MaterializedView must expose the same set of public method names."""
    sync_methods = public_methods(sync_doc.MaterializedView)
    async_methods = public_methods(aio_doc.MaterializedView)

    assert sync_methods == async_methods, (
        f"MaterializedView API drift detected!\n"
        f"sync-only: {sync_methods - async_methods}\n"
        f"async-only: {async_methods - sync_methods}"
    )
