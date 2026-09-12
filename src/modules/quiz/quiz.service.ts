import { trVal } from "../../shared/translations";
import { getQuizData } from "./quiz.repository";

export async function getQuiz() {
  const { dbCats, dbQuestions, catTr, qTr } = await getQuizData();

  const categories = dbCats.map(c => {
    const questions = dbQuestions
      .filter(q => q.categoryId === c.id)
      .map(q => {
        const opts = [0, 1, 2, 3].map(i => trVal(qTr, q.id, `option_${i}`, "ar")).filter(Boolean);
        return {
          question: trVal(qTr, q.id, "question", "ar"),
          options: opts,
          correctAnswer: q.correctAnswer,
          explanation: trVal(qTr, q.id, "explanation", "ar") || undefined,
        };
      });
    return {
      id: c.code,
      title: trVal(catTr, c.id, "name", "ar"),
      color: c.color,
      bgColor: c.bgColor,
      borderColor: c.borderColor,
      icon: c.icon,
      questions,
    };
  });

  return { categories };
}
