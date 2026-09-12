import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as lettersService from "./letters.service";

const generateLetterSchema = z.object({
  companyName: z.string().min(1),
  crNumber: z.string().min(1),
  recipientType: z.enum(["قطاع_خاص", "بنك", "جهة_حكومية"]),
  recipientName: z.string().min(1),
  letterIdea: z.string().min(5),
});

export async function generate(req: FastifyRequest, _reply: FastifyReply) {
  const input = generateLetterSchema.parse(req.body);
  return lettersService.generateLetter(input);
}
