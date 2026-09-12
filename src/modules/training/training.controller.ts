import type { FastifyReply, FastifyRequest } from "fastify";
import * as trainingService from "./training.service";

export async function getTraining(_req: FastifyRequest, _reply: FastifyReply) {
  return trainingService.getTraining();
}
