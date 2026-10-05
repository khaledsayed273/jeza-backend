import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

// ── Saudization Rules (CalculatorPage) ───────────────────────────────────────

export const saudizationRules = mysqlTable("saudization_rules", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  requiredPercentage: int("requiredPercentage"),
  minEmployees: int("minEmployees").default(1),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type SaudizationRule = typeof saudizationRules.$inferSelect;
export type InsertSaudizationRule = typeof saudizationRules.$inferInsert;
