import type { FastifyReply, FastifyRequest } from "fastify";
import * as leaveService from "./leave.service";

export async function getLeave(_req: FastifyRequest, _reply: FastifyReply) {
  return leaveService.getLeave();
}
