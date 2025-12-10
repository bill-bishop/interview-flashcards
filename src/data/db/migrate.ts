import { exec, getAll, getOne, Db } from "./client";
import { MIGRATIONS } from "./schema";
import { nowIso } from "../../utils/time";

export async function migrate(db: Db) {
  // Ensure migrations table exists even before recorded migration run.
  await exec(
    db,
    `
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `
  );

  const applied = await getAll<{ id: number }>(db, "SELECT id FROM migrations ORDER BY id ASC");
  const appliedIds = new Set(applied.map((m) => m.id));

  for (const m of MIGRATIONS) {
    if (appliedIds.has(m.id)) continue;
    await exec(db, m.sql);
    await db.runAsync("INSERT INTO migrations (id, applied_at) VALUES (?, ?)", [m.id, nowIso()]);
  }
}
