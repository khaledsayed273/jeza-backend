import type { FastifyReply, FastifyRequest } from "fastify";
import * as hrExplainersService from "./hrExplainers.service";

export async function getHrExplainers(_req: FastifyRequest, _reply: FastifyReply) {
  return hrExplainersService.getHrExplainers();
}
