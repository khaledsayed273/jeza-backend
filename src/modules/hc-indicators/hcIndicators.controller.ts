import type { FastifyReply, FastifyRequest } from "fastify";
import * as hcIndicatorsService from "./hcIndicators.service";

export async function getHcIndicators(_req: FastifyRequest, _reply: FastifyReply) {
  return hcIndicatorsService.getHcIndicators();
}
