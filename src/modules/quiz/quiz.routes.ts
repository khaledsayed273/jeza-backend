import type { FastifyInstance } from "fastify";
import * as quizController from "./quiz.controller";

export function registerQuizRoutes(app: FastifyInstance) {
  app.get("/api/content/quiz", quizController.getQuiz);
}
