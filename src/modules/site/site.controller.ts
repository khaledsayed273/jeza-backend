import type { FastifyReply, FastifyRequest } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as siteService from "./site.service";

export async function getHome(_req: FastifyRequest, _reply: FastifyReply) {
  return siteService.getHome();
}

export async function getAbout(_req: FastifyRequest, _reply: FastifyReply) {
  return siteService.getAbout();
}

export async function getResources(_req: FastifyRequest, _reply: FastifyReply) {
  return siteService.getResources();
}

export async function getFaq(_req: FastifyRequest, _reply: FastifyReply) {
  return siteService.getFaq();
}

export async function replaceHome(req: FastifyRequest, reply: FastifyReply) {
  const parsed = siteService.homeSchema.parse(req.body);
  await siteService.replaceHome(parsed);
  return reply.send({ success: true });
}

export async function replaceAbout(req: FastifyRequest, reply: FastifyReply) {
  const parsed = siteService.aboutSchema.parse(req.body);
  await siteService.replaceAbout(parsed);
  return reply.send({ success: true });
}

export async function replaceResources(req: FastifyRequest, reply: FastifyReply) {
  const parsed = siteService.resourcesSchema.parse(req.body);
  await siteService.replaceResources(parsed);
  return reply.send({ success: true });
}

export async function replaceFaq(req: FastifyRequest, reply: FastifyReply) {
  const parsed = siteService.faqSchema.parse(req.body);
  await siteService.replaceFaq(parsed);
  return reply.send({ success: true });
}
