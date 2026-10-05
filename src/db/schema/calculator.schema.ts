import { boolean, decimal, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// Calculator
export const professionCategories = mysqlTable("profession_categories", {
  id: varchar("id", { length: 50 }).notNull().primaryKey(),
  label: text("label").notNull(),
  required: int("required"),
  note: text("note").notNull(),
  examples: text("examples").notNull(),
  minWage: varchar("minWage", { length: 50 }),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const professionCategoryJobs = mysqlTable("profession_category_jobs", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: varchar("categoryId", { length: 50 }).notNull(),
  name: text("name").notNull(),
  minWage: int("minWage").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const professionCategoryPhases = mysqlTable("profession_category_phases", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: varchar("categoryId", { length: 50 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  rate: int("rate").notNull(),
  label: text("label").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const activities2026 = mysqlTable("activities_2026", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  mLow: decimal("m_low", { precision: 8, scale: 3 }).notNull(),
  mMid: decimal("m_mid", { precision: 8, scale: 3 }).notNull(),
  mHigh: decimal("m_high", { precision: 8, scale: 3 }).notNull(),
  mPlat: decimal("m_plat", { precision: 8, scale: 3 }).notNull(),
  thLow: decimal("th_low", { precision: 8, scale: 3 }).notNull(),
  thMid: decimal("th_mid", { precision: 8, scale: 3 }).notNull(),
  thHigh: decimal("th_high", { precision: 8, scale: 3 }).notNull(),
  thPlat: decimal("th_plat", { precision: 8, scale: 3 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const gosiRateYears = mysqlTable("gosi_rate_years", {
  id: int("id").autoincrement().primaryKey(),
  year: varchar("year", { length: 4 }).notNull().unique(),
  employee: decimal("employee", { precision: 5, scale: 2 }).notNull(),
  employer: decimal("employer", { precision: 5, scale: 2 }).notNull(),
  saned: decimal("saned", { precision: 5, scale: 2 }).notNull(),
});
export const gosiRateMeta = mysqlTable("gosi_rate_meta", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  value: decimal("value", { precision: 6, scale: 2 }).notNull(),
});
export const terminationOptions = mysqlTable("termination_options", {
  id: int("id").autoincrement().primaryKey(),
  value: varchar("value", { length: 50 }).notNull(),
  labelAr: text("labelAr").notNull(),
  labelEn: text("labelEn").notNull(),
  group: varchar("group", { length: 30 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const terminationGroupLabels = mysqlTable("termination_group_labels", {
  id: int("id").autoincrement().primaryKey(),
  group: varchar("group", { length: 30 }).notNull().unique(),
  ar: text("ar").notNull(),
  en: text("en").notNull(),
});
export const terminationNoEntitlement = mysqlTable("termination_no_entitlement", {
  id: int("id").autoincrement().primaryKey(),
  reason: varchar("reason", { length: 60 }).notNull(),
});
export const nationalityRulesNationalities = mysqlTable("nationality_rules_nationalities", {
  id: varchar("id", { length: 50 }).notNull().primaryKey(),
  labelAr: text("labelAr").notNull(),
  labelEn: text("labelEn").notNull(),
  maxRatio: int("maxRatio"),
  isRestricted: boolean("isRestricted").default(false).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  flag: varchar("flag", { length: 10 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});
export const nationalityRulesSizeThresholds = mysqlTable("nationality_rules_size_thresholds", {
  id: int("id").autoincrement().primaryKey(),
  tier: varchar("tier", { length: 20 }).notNull().unique(),
  maxWorkers: int("maxWorkers"),
  nonRestrictedMax: int("nonRestrictedMax"),
});
