import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { quizCategories, quizQuestions } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getQuizData() {
  const db = getDb();
  const [dbCats, dbQuestions] = await Promise.all([
    db.select().from(quizCategories).orderBy(asc(quizCategories.sortOrder)),
    db.select().from(quizQuestions).orderBy(asc(quizQuestions.sortOrder)),
  ]);
  const [catTr, qTr] = await Promise.all([
    fetchTranslations("quiz_category"),
    fetchTranslations("quiz_question"),
  ]);
  return { dbCats, dbQuestions, catTr, qTr };
}
