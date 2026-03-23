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
        # Step 1 — Add the new column
        await ctx.execute('ALTER TABLE migrations_demo.products ADD "manufacturer" text')

        # Step 2 — Copy data: brand → manufacturer
        async for row in ctx.scan_table("migrations_demo", "products"):
            if row.get("brand"):
                await ctx.execute(
                    'UPDATE migrations_demo.products SET "manufacturer" = ? WHERE id = ?',
                    [row["brand"], row["id"]],
                )

        # Step 3 — Drop the old column
        await ctx.execute('ALTER TABLE migrations_demo.products DROP "brand"')

    async def downgrade(self, ctx: MigrationContext) -> None:
        # Reverse: re-create brand, copy manufacturer back, drop manufacturer
        await ctx.execute('ALTER TABLE migrations_demo.products ADD "brand" text')

        async for row in ctx.scan_table("migrations_demo", "products"):
            if row.get("manufacturer"):
                await ctx.execute(
                    'UPDATE migrations_demo.products SET "brand" = ? WHERE id = ?',
                    [row["manufacturer"], row["id"]],
                )

        await ctx.execute('ALTER TABLE migrations_demo.products DROP "manufacturer"')
