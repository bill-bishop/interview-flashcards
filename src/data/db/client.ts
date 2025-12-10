import * as SQLite from "expo-sqlite";

export type Db = SQLite.SQLiteDatabase;

export async function openDb(): Promise<Db> {
  return await SQLite.openDatabaseAsync("interview_flashcards.db");
}

export async function exec(db: Db, sql: string) {
  await db.execAsync(sql);
}

export async function getOne<T>(db: Db, sql: string, args: any[] = []): Promise<T | null> {
  const rows = await db.getAllAsync<T>(sql, args);
  return rows.length ? rows[0] : null;
}

export async function getAll<T>(db: Db, sql: string, args: any[] = []): Promise<T[]> {
  return await db.getAllAsync<T>(sql, args);
}
