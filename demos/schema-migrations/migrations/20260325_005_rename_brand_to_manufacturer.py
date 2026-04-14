"""Migration 005 — Rename ``brand`` → ``manufacturer`` on the ``products`` table.

This migration demonstrates a **column rename with data migration**:

1. Add the new ``manufacturer`` text column.
2. Copy every existing ``brand`` value into ``manufacturer`` via ``scan_table()``.
3. Drop the old ``brand`` column.

Rolling back this migration re-creates ``brand``, copies data back from
``manufacturer``, and drops ``manufacturer``.  Because the rollback also
involves a data migration, it is only safe while the data still exists in
the source column.  See the README section *Data Migrations & Rollback*
for a detailed discussion.
"""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Rename brand to manufacturer (data migration)"
    reversible = True
    allow_destructive = True  # drops the old 'brand' column

    async def upgrade(self, ctx: MigrationContext) -> None:
        # Step 1 — Add the new column (guard: sync_table may have created it already)
        if not await ctx.column_exists("migrations_demo", "products", "manufacturer"):
            await ctx.execute('ALTER TABLE migrations_demo.products ADD "manufacturer" text')

        # Step 2 — Copy data: brand → manufacturer (only if brand still exists)
        if await ctx.column_exists("migrations_demo", "products", "brand"):
            async for row in ctx.scan_table("migrations_demo", "products"):
                if row.get("brand"):
                    await ctx.execute(
                        'UPDATE migrations_demo.products SET "manufacturer" = ? WHERE id = ?',
                        [row["brand"], row["id"]],
                    )

            # Step 3 — Drop the secondary index on brand before dropping the column
            if await ctx.index_exists("migrations_demo", "products", "products_brand_idx"):
                await ctx.execute("DROP INDEX IF EXISTS migrations_demo.products_brand_idx")

            # Step 4 — Drop the old column
            await ctx.execute('ALTER TABLE migrations_demo.products DROP "brand"')

    async def downgrade(self, ctx: MigrationContext) -> None:
        # Step 1 — Re-create the old column
        if not await ctx.column_exists("migrations_demo", "products", "brand"):
            await ctx.execute('ALTER TABLE migrations_demo.products ADD "brand" text')

        # Step 2 — Copy data back: manufacturer → brand
        if await ctx.column_exists("migrations_demo", "products", "manufacturer"):
            async for row in ctx.scan_table("migrations_demo", "products"):
                if row.get("manufacturer"):
                    await ctx.execute(
                        'UPDATE migrations_demo.products SET "brand" = ? WHERE id = ?',
                        [row["manufacturer"], row["id"]],
                    )

            # Step 3 — Drop the index on manufacturer before dropping the column
            if await ctx.index_exists("migrations_demo", "products", "products_manufacturer_idx"):
                await ctx.execute("DROP INDEX IF EXISTS migrations_demo.products_manufacturer_idx")

            # Step 4 — Drop the new column
            await ctx.execute('ALTER TABLE migrations_demo.products DROP "manufacturer"')
