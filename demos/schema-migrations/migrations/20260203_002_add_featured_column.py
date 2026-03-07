"""Migration 002 — Add a ``featured`` boolean column to ``products``.

Adds the ``featured`` flag so products can be highlighted in the UI, and
creates a secondary index on it for efficient ``WHERE featured = true``
queries.
"""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Add featured boolean column to products"
    reversible = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute('ALTER TABLE migrations_demo.products ADD "featured" boolean')
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.products (featured)")

    async def downgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute('ALTER TABLE migrations_demo.products DROP "featured"')
