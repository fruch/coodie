"""Migration 006 — Add ITA-mandated ``hazard_class`` column to ``products``.

BACKGROUND
----------
Following Interdimensional Trade Authority Directive Ω-7, all artifacts listed
on the Infinite Bazaar must carry a hazard classification (1 = inert curiosity,
5 = reality-destabilising).  Unclassified items will be seized by MerchBot
Enforcement Squad at the next customs checkpoint.

This migration adds the ``hazard_class`` int column and a secondary index so
compliance officers can instantly pull all Class-5 inventory for containment
review.

KNOWN INCIDENT — 2026-04-10
----------------------------
The first deployment of this migration failed at Step 1 with:

    InvalidRequest: Unknown type frobnitz

A junior engineer typed ``frobnitz`` instead of ``int``.  The migration aborted
before touching any data.  Because the column was never added, re-running after
the fix was safe — no partial state to clean up.

See demo.sh "Step: Failure & Recovery" for a live walkthrough of the incident.
"""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Add ITA Directive Ω-7 hazard_class column (int) to products"
    reversible = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        if not await ctx.column_exists("migrations_demo", "products", "hazard_class"):
            await ctx.execute('ALTER TABLE migrations_demo.products ADD "hazard_class" int')
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.products (hazard_class)")

    async def downgrade(self, ctx: MigrationContext) -> None:
        if await ctx.index_exists("migrations_demo", "products", "products_hazard_class_idx"):
            await ctx.execute("DROP INDEX IF EXISTS migrations_demo.products_hazard_class_idx")
        if await ctx.column_exists("migrations_demo", "products", "hazard_class"):
            await ctx.execute('ALTER TABLE migrations_demo.products DROP "hazard_class"')
