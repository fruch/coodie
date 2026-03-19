"""Migration 003 — Set a default TTL of one year on the ``reviews`` table.

Old reviews are automatically expired after 365 days (31 536 000 seconds).
"""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Set one-year default TTL on reviews table"
    reversible = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute("ALTER TABLE migrations_demo.reviews WITH default_time_to_live = 31536000")

    async def downgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute("ALTER TABLE migrations_demo.reviews WITH default_time_to_live = 0")
