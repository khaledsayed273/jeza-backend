import type { FastifyReply, FastifyRequest } from "fastify";
import * as calculatorService from "./calculator.service";

export async function getCalculator(_req: FastifyRequest, _reply: FastifyReply) {
  return calculatorService.getCalculator();
}
