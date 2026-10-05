import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { ENV } from "../config/env";

export type Database = MySql2Database<typeof schema>;

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    const pool = mysql.createPool({
      uri: ENV.databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
    });
    db = drizzle(pool, { schema, mode: "default" });
  }
  return db;
}

export * from "./schema";
