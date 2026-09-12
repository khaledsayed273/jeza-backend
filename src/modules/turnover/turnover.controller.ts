import type { FastifyReply, FastifyRequest } from "fastify";
import * as turnoverService from "./turnover.service";

export async function getTurnover(_req: FastifyRequest, _reply: FastifyReply) {
  return turnoverService.getTurnover();
}
