"""Migration 004 — Add a secondary index on ``products.name`` for search.

Allows ``WHERE name = ?`` queries so users can look up products by name.
"""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Add secondary index on product name for search"
    reversible = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.products (name)")

    async def downgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute("DROP INDEX IF EXISTS migrations_demo.products_name_idx")
