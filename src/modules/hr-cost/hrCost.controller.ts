import type { FastifyReply, FastifyRequest } from "fastify";
import * as hrCostService from "./hrCost.service";

export async function getHrCost(_req: FastifyRequest, _reply: FastifyReply) {
  return hrCostService.getHrCost();
}
