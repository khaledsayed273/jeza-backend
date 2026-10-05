import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ── HC KPI Categories ───────────────────────────────────────────────────────

export const hcKpiCategories = mysqlTable("hc_kpi_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type HcKpiCategory = typeof hcKpiCategories.$inferSelect;
export type InsertHcKpiCategory = typeof hcKpiCategories.$inferInsert;

// ── HC Built-in Indicators ──────────────────────────────────────────────────

export const hcBuiltinIndicators = mysqlTable("hc_builtin_indicators", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  categoryId: int("categoryId").notNull(),
  unit: varchar("unit", { length: 30 }),
  higherIsBetter: int("higherIsBetter").default(1),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type HcBuiltinIndicator = typeof hcBuiltinIndicators.$inferSelect;
export type InsertHcBuiltinIndicator = typeof hcBuiltinIndicators.$inferInsert;

// ── HC Organizations ────────────────────────────────────────────────────────

export const hcOrganizations = mysqlTable("hc_organizations", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 100 }).notNull(),
  industry: varchar("industry", { length: 100 }),
  size: mysqlEnum("size", ["small", "medium", "large"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HcOrganization = typeof hcOrganizations.$inferSelect;
export type InsertHcOrganization = typeof hcOrganizations.$inferInsert;

// ── HC Reports ──────────────────────────────────────────────────────────────

export const hcReports = mysqlTable("hc_reports", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  userId: varchar("userId", { length: 100 }).notNull(),
  periodType: mysqlEnum("periodType", ["monthly", "quarterly"]).default("quarterly").notNull(),
  periodLabel: varchar("periodLabel", { length: 50 }).notNull(),
  periodStart: varchar("periodStart", { length: 20 }).notNull(),
  periodEnd: varchar("periodEnd", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["draft", "completed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HcReport = typeof hcReports.$inferSelect;
export type InsertHcReport = typeof hcReports.$inferInsert;

// ── HC KPI Entries ──────────────────────────────────────────────────────────

export const hcKpiEntries = mysqlTable("hc_kpi_entries", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull(),
  indicatorKey: varchar("indicatorKey", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  currentValue: decimal("currentValue", { precision: 12, scale: 2 }),
  currentValueText: text("currentValueText"),
  unit: varchar("unit", { length: 30 }),
  benchmark: text("benchmark"),
  targetValue: decimal("targetValue", { precision: 12, scale: 2 }),
  targetDate: varchar("targetDate", { length: 20 }),
  initiative: text("initiative"),
  initiativeDate: varchar("initiativeDate", { length: 20 }),
  performanceScore: decimal("performanceScore", { precision: 5, scale: 2 }),
  trafficLight: mysqlEnum("trafficLight", ["green", "yellow", "red", "grey"]).default("grey"),
  isCustom: int("isCustom").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HcKpiEntry = typeof hcKpiEntries.$inferSelect;
export type InsertHcKpiEntry = typeof hcKpiEntries.$inferInsert;
