import { int, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

// ── Translations (central bilingual store) ───────────────────────────────────

export const translations = mysqlTable("translations", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: int("entityId").notNull(),
  lang: varchar("lang", { length: 5 }).notNull(),
  field: varchar("field", { length: 100 }).notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  unique("unique_translation").on(t.entityType, t.entityId, t.lang, t.field),
]);

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;
