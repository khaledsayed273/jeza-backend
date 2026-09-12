import type { FastifyReply, FastifyRequest } from "fastify";
import * as quizService from "./quiz.service";

export async function getQuiz(_req: FastifyRequest, _reply: FastifyReply) {
  return quizService.getQuiz();
}
