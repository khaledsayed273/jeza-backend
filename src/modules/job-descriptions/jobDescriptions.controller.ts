import type { FastifyReply, FastifyRequest } from "fastify";
import * as jobDescriptionsService from "./jobDescriptions.service";

export async function getJobDescriptions(_req: FastifyRequest, _reply: FastifyReply) {
  return jobDescriptionsService.getJobDescriptions();
}
