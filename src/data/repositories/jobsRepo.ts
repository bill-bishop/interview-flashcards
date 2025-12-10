import { Db, getAll, getOne } from "../db/client";
import { JobListing } from "../../features/jobs/domain/jobs.types";
import { nowIso } from "../../utils/time";

export async function listJobs(db: Db): Promise<JobListing[]> {
  return await getAll<JobListing>(db, "SELECT * FROM jobs ORDER BY created_at DESC");
}

export async function getJob(db: Db, jobId: string): Promise<JobListing | null> {
  return await getOne<JobListing>(db, "SELECT * FROM jobs WHERE id = ?", [jobId]);
}

export async function createJob(db: Db, input: { title: string; company: string; jdText: string; sourceType: "paste" | "link"; sourceValue: string; }): Promise<string> {
  const id = `job-${Date.now()}`;
  await db.runAsync(
    "INSERT INTO jobs (id, title, company, source_type, source_value, jd_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, input.title, input.company, input.sourceType, input.sourceValue, input.jdText, nowIso()]
  );
  return id;
}
