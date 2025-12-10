import React from "react";
import { openDb, Db } from "./client";
import { migrate } from "./migrate";
import { seedIfEmpty } from "./seed";

const DbContext = React.createContext<Db | null>(null);
const ReadyContext = React.createContext<boolean>(false);

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = React.useState<Db | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const db = await openDb();
      await migrate(db);
      await seedIfEmpty(db);
      setDb(db);
      setReady(true);
    })();
  }, []);

  return (
    <DbContext.Provider value={db}>
      <ReadyContext.Provider value={ready}>{children}</ReadyContext.Provider>
    </DbContext.Provider>
  );
}

export function useDb(): Db {
  const db = React.useContext(DbContext);
  if (!db) throw new Error("DB not ready");
  return db;
}

export function useDbReady(): boolean {
  return React.useContext(ReadyContext);
}
