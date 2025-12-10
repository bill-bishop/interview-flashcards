import { Db, getAll } from "../db/client";

export type CategoryCount = { key: string; label: string; count: number };

export async function getCategoryCounts(db: Db, jobId: string): Promise<CategoryCount[]> {
  const rows = await getAll<any>(
    db,
    `
    SELECT dc.key as key, dc.label as label, COUNT(c.id) as count
    FROM deck_categories dc
    LEFT JOIN cards c ON c.job_id = dc.job_id AND c.category_key = dc.key
    WHERE dc.job_id = ?
    GROUP BY dc.key, dc.label
    ORDER BY dc.order_index ASC
  `,
    [jobId]
  );
  return rows.map((r: any) => ({ key: r.key, label: r.label, count: Number(r.count ?? 0) }));
}

export async function getCardsForJobAndCategories(db: Db, jobId: string, categories: string[]) {
  const placeholders = categories.map(() => "?").join(",");
  return await getAll<any>(
    db,
    `SELECT * FROM cards WHERE job_id = ? AND category_key IN (${placeholders})`,
    [jobId, ...categories]
  );
}

export async function getCardById(db: Db, cardId: string) {
  const rows = await db.getAllAsync<any>("SELECT * FROM cards WHERE id = ?", [cardId]);
  return rows[0] ?? null;
}
