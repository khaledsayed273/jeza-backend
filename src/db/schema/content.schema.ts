import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── Normalized module content (migrated out of site_content JSON) ──────────────

export const employeeMarketData = mysqlTable("employee_market_data", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  sector: text("sector").notNull(),
  min: int("min").notNull(),
  avg: int("avg").notNull(),
  max: int("max").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const hrCostSections = mysqlTable("hr_cost_sections", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 30 }).notNull().unique(),
  title: text("title").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const hrCostItems = mysqlTable("hr_cost_items", {
  id: int("id").autoincrement().primaryKey(),
  sectionId: int("sectionId").notNull(),
  itemId: varchar("itemId", { length: 50 }).notNull(),
  label: text("label").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const leaveTypes = mysqlTable("leave_types", {
  id: int("id").autoincrement().primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  labelAr: text("labelAr").notNull(),
  labelEn: text("labelEn").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const sectorBenchmarks = mysqlTable("sector_benchmarks", {
  id: int("id").autoincrement().primaryKey(),
  sectorId: varchar("sectorId", { length: 50 }).notNull().unique(),
  ar: text("ar").notNull(),
  en: text("en").notNull(),
  annual: varchar("annual", { length: 20 }).notNull(),
  desc: text("desc").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const jobBenchmarks = mysqlTable("job_benchmarks", {
  id: int("id").autoincrement().primaryKey(),
  jobId: varchar("jobId", { length: 50 }).notNull().unique(),
  ar: text("ar").notNull(),
  en: text("en").notNull(),
  annual: varchar("annual", { length: 20 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const trainingDecisions = mysqlTable("training_decisions", {
  id: int("id").autoincrement().primaryKey(),
  num: varchar("num", { length: 10 }).notNull(),
  ar: text("ar").notNull(),
  en: text("en").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const trainingSectors = mysqlTable("training_sectors", {
  id: int("id").autoincrement().primaryKey(),
  ar: text("ar").notNull(),
  en: text("en").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const disclosurePoints = mysqlTable("disclosure_points", {
  id: int("id").autoincrement().primaryKey(),
  num: varchar("num", { length: 10 }).notNull(),
  titleAr: text("titleAr").notNull(),
  titleEn: text("titleEn").notNull(),
  textAr: text("textAr").notNull(),
  textEn: text("textEn").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
