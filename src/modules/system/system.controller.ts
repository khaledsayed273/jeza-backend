import type { FastifyReply, FastifyRequest } from "fastify";

export async function health(_req: FastifyRequest, _reply: FastifyReply) {
  return { ok: true };
}
