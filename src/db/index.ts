import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../drizzle/schema";
import { ENV } from "../config/env";

export type Database = MySql2Database<typeof schema>;

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    const pool = mysql.createPool({
      host: ENV.db.host,
      port: ENV.db.port,
      user: ENV.db.user,
      password: ENV.db.pass,
      database: ENV.db.name,
      waitForConnections: true,
      connectionLimit: 10,
    });
    db = drizzle(pool, { schema, mode: "default" });
  }
  return db;
}

export * from "../../drizzle/schema";
