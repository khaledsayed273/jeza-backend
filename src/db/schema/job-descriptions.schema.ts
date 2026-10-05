import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

// ── Departments ──────────────────────────────────────────────────────────────

export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

// ── Job Descriptions ────────────────────────────────────────────────────────

export const jobDescriptions = mysqlTable("job_descriptions", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  departmentId: int("departmentId").notNull(),
  level: varchar("level", { length: 30 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type JobDescription = typeof jobDescriptions.$inferSelect;
export type InsertJobDescription = typeof jobDescriptions.$inferInsert;
