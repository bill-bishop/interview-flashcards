import { Db } from "../db/client";
import { nowIso } from "../../utils/time";
import { pick, shuffle } from "../../utils/random";

export async function createSession(db: Db, input: { jobId: string; mode: "practice" | "interview"; categories: string[]; targetCount: number; }): Promise<string> {
  const id = `sess-${Date.now()}`;
  await db.runAsync(
    "INSERT INTO sessions (id, job_id, mode, categories_json, target_count, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, NULL)",
    [id, input.jobId, input.mode, JSON.stringify(input.categories), input.targetCount, nowIso()]
  );
  return id;
}

export async function getSession(db: Db, sessionId: string) {
  const rows = await db.getAllAsync<any>("SELECT * FROM sessions WHERE id = ?", [sessionId]);
  return rows[0] ?? null;
}

export async function listAttemptsForSession(db: Db, sessionId: string) {
  return await db.getAllAsync<any>("SELECT * FROM attempts WHERE session_id = ? ORDER BY created_at ASC", [sessionId]);
}

export async function upsertAttempt(db: Db, input: { sessionId: string; cardId: string; userAnswer: string; }): Promise<string> {
  const id = `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  await db.runAsync(
    "INSERT INTO attempts (id, session_id, card_id, user_answer, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, input.sessionId, input.cardId, input.userAnswer, nowIso()]
  );
  return id;
}

export async function setSessionCompleted(db: Db, sessionId: string) {
  await db.runAsync("UPDATE sessions SET completed_at = ? WHERE id = ?", [nowIso(), sessionId]);
}

export async function getAttempt(db: Db, attemptId: string) {
  const rows = await db.getAllAsync<any>("SELECT * FROM attempts WHERE id = ?", [attemptId]);
  return rows[0] ?? null;
}

export async function getAttemptEval(db: Db, attemptId: string) {
  const rows = await db.getAllAsync<any>("SELECT * FROM attempt_evals WHERE attempt_id = ?", [attemptId]);
  return rows[0] ?? null;
}

export async function upsertAttemptEval(db: Db, input: { attemptId: string; verdict: string; summary: string; improvements: string[]; suggestedAnswer: string; }) {
  await db.runAsync(
    "INSERT OR REPLACE INTO attempt_evals (attempt_id, verdict, summary, improvements_json, suggested_answer) VALUES (?, ?, ?, ?, ?)",
    [input.attemptId, input.verdict, input.summary, JSON.stringify(input.improvements), input.suggestedAnswer]
  );
}

// Scheduler: pick next unattempted card from selected categories.
// For now: shuffle all cards and skip attempted ones.
export async function pickNextCardId(db: Db, sessionId: string): Promise<string | null> {
  const session = await getSession(db, sessionId);
  if (!session) return null;
  const categories: string[] = JSON.parse(session.categories_json);
  const jobId: string = session.job_id;

  const cards = await db.getAllAsync<any>(
    `SELECT id FROM cards WHERE job_id = ? AND category_key IN (${categories.map(() => "?").join(",")})`,
    [jobId, ...categories]
  );
  const allIds = shuffle(cards.map((c: any) => c.id));

  const attempted = await db.getAllAsync<any>("SELECT card_id FROM attempts WHERE session_id = ?", [sessionId]);
  const attemptedSet = new Set(attempted.map((a: any) => a.card_id));

  const next = allIds.find((id: string) => !attemptedSet.has(id));
  return next ?? null;
}
