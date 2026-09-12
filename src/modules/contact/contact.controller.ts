import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as contactService from "./contact.service";

const submitRequestSchema = z.object({
  requestType: z.enum(["individual", "company"]),
  name: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal("")),
  university: z.string().optional(),
  major: z.string().optional(),
  semester: z.string().optional(),
  companyName: z.string().optional(),
  sector: z.string().optional(),
  workersCount: z.string().optional(),
  traineesNeeded: z.string().optional(),
  trainingDuration: z.string().optional(),
  trainingField: z.string().optional(),
  notes: z.string().optional(),
});

export async function submit(req: FastifyRequest, _reply: FastifyReply) {
  const input = submitRequestSchema.parse(req.body);
  return contactService.submitRequest(input);
}
