import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── Policy Categories ────────────────────────────────────────────────────────

export const policyCategories = mysqlTable("policy_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 100 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type PolicyCategory = typeof policyCategories.$inferSelect;
export type InsertPolicyCategory = typeof policyCategories.$inferInsert;

// ── Policies ─────────────────────────────────────────────────────────────────

export const policies = mysqlTable("policies", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  chapterNum: int("chapterNum").notNull(),
  categoryId: int("categoryId").notNull(),
  objectives: text("objectives"),
  policiesData: text("policiesData"),
  proceduresData: text("proceduresData"),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = typeof policies.$inferInsert;

// ── Declarations ─────────────────────────────────────────────────────────────

export const declarations = mysqlTable("declarations", {
  id: int("id").autoincrement().primaryKey(),
  sortOrder: int("sortOrder").default(0).notNull(),
  items: text("items"),
  fileUrl: text("fileUrl"),
});

export type Declaration = typeof declarations.$inferSelect;
export type InsertDeclaration = typeof declarations.$inferInsert;
