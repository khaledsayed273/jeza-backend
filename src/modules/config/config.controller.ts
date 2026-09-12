import type { FastifyReply, FastifyRequest } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as configService from "./config.service";

export async function getConfig(_req: FastifyRequest, _reply: FastifyReply) {
  return configService.getConfig();
}

export async function updateConfig(req: FastifyRequest, _reply: FastifyReply) {
  const { key } = req.params as { key: string };
  const { value } = req.body as { value: string };
  return configService.updateConfig(key, value);
}
