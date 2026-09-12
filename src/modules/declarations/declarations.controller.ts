import type { FastifyReply, FastifyRequest } from "fastify";
import * as declarationsService from "./declarations.service";

export async function getDeclarations(_req: FastifyRequest, _reply: FastifyReply) {
  return declarationsService.getDeclarations();
}
