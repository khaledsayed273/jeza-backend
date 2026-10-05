import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── Update Sources (laws & regulations) ──────────────────────────────────────

export const updateSources = mysqlTable("update_sources", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  url: text("url").notNull(),
  type: varchar("type", { length: 10 }).notNull().default("pdf"),
  color: varchar("color", { length: 100 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type UpdateSource = typeof updateSources.$inferSelect;
export type InsertUpdateSource = typeof updateSources.$inferInsert;
