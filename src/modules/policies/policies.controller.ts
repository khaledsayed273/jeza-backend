import type { FastifyReply, FastifyRequest } from "fastify";
import * as policiesService from "./policies.service";

export async function getPolicies(_req: FastifyRequest, _reply: FastifyReply) {
  return policiesService.getPolicies();
}
