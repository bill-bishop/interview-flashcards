export const MIGRATIONS: { id: number; sql: string }[] = [
  {
    id: 1,
    sql: `
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY NOT NULL,
      resume_text TEXT NOT NULL,
      portfolio_links_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_value TEXT NOT NULL,
      jd_text TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deck_categories (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      key TEXT NOT NULL,
      label TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      UNIQUE(job_id, key)
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      category_key TEXT NOT NULL,
      question TEXT NOT NULL,
      suggested_answer TEXT NOT NULL,
      tags_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      categories_json TEXT NOT NULL,
      target_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      card_id TEXT NOT NULL,
      user_answer TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempt_evals (
      attempt_id TEXT PRIMARY KEY NOT NULL,
      verdict TEXT NOT NULL,
      summary TEXT NOT NULL,
      improvements_json TEXT NOT NULL,
      suggested_answer TEXT NOT NULL
    );
    `,
  },
];
