import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

// ── Quiz Categories ─────────────────────────────────────────────────────────

export const quizCategories = mysqlTable("quiz_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 100 }),
  bgColor: varchar("bgColor", { length: 100 }),
  borderColor: varchar("borderColor", { length: 100 }),
  icon: varchar("icon", { length: 10 }),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type QuizCategory = typeof quizCategories.$inferSelect;
export type InsertQuizCategory = typeof quizCategories.$inferInsert;

// ── Quiz Questions ──────────────────────────────────────────────────────────

export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  correctAnswer: int("correctAnswer").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
