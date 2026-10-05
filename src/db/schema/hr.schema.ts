import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── HR Categories ────────────────────────────────────────────────────────────

export const hrCategories = mysqlTable("hr_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type HrCategory = typeof hrCategories.$inferSelect;
export type InsertHrCategory = typeof hrCategories.$inferInsert;

// ── HR Sources (explainer PDFs) ──────────────────────────────────────────────

export const hrSources = mysqlTable("hr_sources", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  categoryId: int("categoryId").notNull(),
  url: text("url").notNull(),
  color: varchar("color", { length: 100 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type HrSource = typeof hrSources.$inferSelect;
export type InsertHrSource = typeof hrSources.$inferInsert;

// ── HR Images ────────────────────────────────────────────────────────────────

export const hrImages = mysqlTable("hr_images", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  url: text("url").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type HrImage = typeof hrImages.$inferSelect;
export type InsertHrImage = typeof hrImages.$inferInsert;
