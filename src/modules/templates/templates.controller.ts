import type { FastifyReply, FastifyRequest } from "fastify";
import * as templatesService from "./templates.service";

export async function getTemplates(_req: FastifyRequest, _reply: FastifyReply) {
  return templatesService.getTemplates();
}
