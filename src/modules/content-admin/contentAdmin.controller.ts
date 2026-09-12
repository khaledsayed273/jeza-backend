import type { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./contentAdmin.service";

function params(req: FastifyRequest) {
  return req.params as { module: string; sub: string; id?: string };
}

export async function listContent(req: FastifyRequest, _reply: FastifyReply) {
  const { module, sub } = params(req);
  return service.listContent(module, sub);
}

export async function createContent(req: FastifyRequest, reply: FastifyReply) {
  const { module, sub } = params(req);
  const result = await service.createContent(module, sub, (req.body as Record<string, unknown>) ?? {});
  return reply.status(201).send(result);
}

export async function updateContent(req: FastifyRequest, _reply: FastifyReply) {
  const { module, sub, id } = params(req);
  return service.updateContent(module, sub, id as string, (req.body as Record<string, unknown>) ?? {});
}

export async function deleteContent(req: FastifyRequest, _reply: FastifyReply) {
  const { module, sub, id } = params(req);
  return service.deleteContent(module, sub, id as string);
}
