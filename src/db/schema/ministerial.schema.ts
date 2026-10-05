import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── Ministerial Sectors ─────────────────────────────────────────────────────

export const ministerialSectors = mysqlTable("ministerial_sectors", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  decisionNumber: varchar("decisionNumber", { length: 100 }),
  decisionDate: varchar("decisionDate", { length: 20 }),
  saudizationPercentage: varchar("saudizationPercentage", { length: 20 }),
  minWage: varchar("minWage", { length: 50 }),
  minEmployees: int("minEmployees"),
  excludedProfessions: text("excludedProfessions"),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type MinisterialSector = typeof ministerialSectors.$inferSelect;
export type InsertMinisterialSector = typeof ministerialSectors.$inferInsert;

// ── Ministerial Professions ─────────────────────────────────────────────────

export const ministerialProfessions = mysqlTable("ministerial_professions", {
  id: int("id").autoincrement().primaryKey(),
  sectorId: int("sectorId").notNull(),
  code: varchar("code", { length: 50 }),
  minWage: varchar("minWage", { length: 50 }),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type MinisterialProfession = typeof ministerialProfessions.$inferSelect;
export type InsertMinisterialProfession = typeof ministerialProfessions.$inferInsert;

// ── Ministerial Phases ──────────────────────────────────────────────────────

export const ministerialPhases = mysqlTable("ministerial_phases", {
  id: int("id").autoincrement().primaryKey(),
  sectorId: int("sectorId").notNull(),
  percentage: varchar("percentage", { length: 20 }),
  date: varchar("date", { length: 20 }),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type MinisterialPhase = typeof ministerialPhases.$inferSelect;
export type InsertMinisterialPhase = typeof ministerialPhases.$inferInsert;
