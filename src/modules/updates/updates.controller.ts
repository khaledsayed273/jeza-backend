import type { FastifyReply, FastifyRequest } from "fastify";
import * as updatesService from "./updates.service";

export async function getUpdates(_req: FastifyRequest, _reply: FastifyReply) {
  return updatesService.getUpdates();
}
