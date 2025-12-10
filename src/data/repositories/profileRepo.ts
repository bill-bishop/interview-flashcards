import { Db, getOne } from "../db/client";
import { nowIso } from "../../utils/time";

export type ProfileRow = {
  id: string;
  resume_text: string;
  portfolio_links_json: string;
  created_at: string;
  updated_at: string;
};

export async function getProfile(db: Db): Promise<ProfileRow | null> {
  return await getOne<ProfileRow>(db, "SELECT * FROM profile LIMIT 1");
}

export async function upsertProfile(db: Db, input: { resumeText: string; portfolioLinksJson: string }) {
  const existing = await getProfile(db);
  const t = nowIso();
  if (!existing) {
    await db.runAsync(
      "INSERT INTO profile (id, resume_text, portfolio_links_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      ["profile-1", input.resumeText, input.portfolioLinksJson, t, t]
    );
  } else {
    await db.runAsync(
      "UPDATE profile SET resume_text = ?, portfolio_links_json = ?, updated_at = ? WHERE id = ?",
      [input.resumeText, input.portfolioLinksJson, t, existing.id]
    );
  }
}
