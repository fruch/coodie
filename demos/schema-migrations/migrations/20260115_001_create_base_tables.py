"""Migration 001 — Create the base ``products`` and ``reviews`` tables.

This is the initial migration.  It creates the two core tables used by
the catalog application with secondary indexes on frequently queried
columns.
"""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Create base products and reviews tables"
    reversible = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute(
            "CREATE TABLE IF NOT EXISTS migrations_demo.products ("
            "id uuid PRIMARY KEY, "
            "name text, "
            "brand text, "
            "category text, "
            "price double, "
            "description text, "
            "tags list<text>, "
            "created_at timestamp)"
        )
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.products (brand)")
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.products (category)")

        await ctx.execute(
            "CREATE TABLE IF NOT EXISTS migrations_demo.reviews ("
            "product_id uuid, "
            "created_at timestamp, "
            "id uuid, "
            "author text, "
            "rating int, "
            "content text, "
            "PRIMARY KEY (product_id, created_at)) "
            "WITH CLUSTERING ORDER BY (created_at DESC)"
        )
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.reviews (rating)")

    async def downgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute("DROP TABLE IF EXISTS migrations_demo.reviews")
        await ctx.execute("DROP TABLE IF EXISTS migrations_demo.products")
