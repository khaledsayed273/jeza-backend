import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── Template Categories ──────────────────────────────────────────────────────

export const templateCategories = mysqlTable("template_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  icon: varchar("icon", { length: 10 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type TemplateCategory = typeof templateCategories.$inferSelect;
export type InsertTemplateCategory = typeof templateCategories.$inferInsert;

// ── HR Forms (templates) ────────────────────────────────────────────────────

export const hrForms = mysqlTable("hr_forms", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  categoryId: int("categoryId").notNull(),
  fileUrl: text("fileUrl").notNull(),
  ext: varchar("ext", { length: 10 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type HrForm = typeof hrForms.$inferSelect;
export type InsertHrForm = typeof hrForms.$inferInsert;
