import type { MySql2Database } from "drizzle-orm/mysql2";
import { inArray } from "drizzle-orm";
import { quizCategories as quizCatTable, quizQuestions as quizQTable, translations } from "../../drizzle/schema";
import { quizCategories as quizCatData } from "./quizData";

async function tr(db: MySql2Database<any>, entityType: string, entityId: number, lang: string, field: string, value: string) {
  await db.insert(translations).values({ entityType, entityId, lang, field, value });
}

export async function seedQuiz(db: MySql2Database<any>) {
  console.log("❓ Seeding quiz data...");

  // idempotent: clear owned rows before re-inserting
  await db.delete(translations).where(
    inArray(translations.entityType, ["quiz_category", "quiz_question"]),
  );
  await db.delete(quizQTable);
  await db.delete(quizCatTable);

  const catIdMap: Record<string, number> = {};
  for (let i = 0; i < quizCatData.length; i++) {
    const cat = quizCatData[i];
    const [result] = await db.insert(quizCatTable).values({
      code: cat.id,
      color: cat.color,
      bgColor: cat.bgColor,
      borderColor: cat.borderColor,
      icon: cat.icon,
      sortOrder: i,
    });
    const id = Number(result.insertId);
    catIdMap[cat.id] = id;
    await tr(db, "quiz_category", id, "ar", "name", cat.title);

    for (let j = 0; j < cat.questions.length; j++) {
      const q = cat.questions[j];
      const [qResult] = await db.insert(quizQTable).values({
        categoryId: id,
        correctAnswer: q.correctAnswer,
        sortOrder: j,
      });
      const qId = Number(qResult.insertId);
      await tr(db, "quiz_question", qId, "ar", "question", q.question);
      if (q.explanation) {
        await tr(db, "quiz_question", qId, "ar", "explanation", q.explanation);
      }
      for (let k = 0; k < q.options.length; k++) {
        await tr(db, "quiz_question", qId, "ar", `option_${k}`, q.options[k]);
      }
    }
  }

  const totalQuestions = quizCatData.reduce((sum, c) => sum + c.questions.length, 0);
  console.log(`   ✓ Quiz seeded (${quizCatData.length} categories, ${totalQuestions} questions)`);
}
