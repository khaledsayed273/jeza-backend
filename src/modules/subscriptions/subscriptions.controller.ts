import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as service from "./subscriptions.service";

const createPlanSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().optional(),
  priceMonthly: z.number().positive(),
  priceYearly: z.number().positive(),
  features: z.string().optional(),
});

const updatePlanSchema = z.object({
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  priceMonthly: z.number().optional(),
  priceYearly: z.number().optional(),
  features: z.string().optional(),
  active: z.number().optional(),
});

const createSubscriptionSchema = z.object({
  userId: z.number(),
  planId: z.number(),
  type: z.enum(["monthly", "yearly"]),
  endDate: z.string(),
});

export async function listPlans(_req: FastifyRequest, _reply: FastifyReply) {
  return service.listPlans();
}

export async function listAllPlans(_req: FastifyRequest, _reply: FastifyReply) {
  return service.listAllPlans();
}

export async function createPlan(req: FastifyRequest, _reply: FastifyReply) {
  const input = createPlanSchema.parse(req.body);
  return service.createPlan(input);
}

export async function updatePlan(req: FastifyRequest, _reply: FastifyReply) {
  const { planId } = req.params as { planId: string };
  const input = updatePlanSchema.parse(req.body);
  return service.updatePlan(Number(planId), input);
}

export async function getMySubscription(req: FastifyRequest, _reply: FastifyReply) {
  return service.getMySubscription(req.user!.id);
}

export async function listAllSubscriptions(_req: FastifyRequest, _reply: FastifyReply) {
  return service.listAllSubscriptions();
}

export async function createSubscription(req: FastifyRequest, _reply: FastifyReply) {
  const input = createSubscriptionSchema.parse(req.body);
  return service.createSubscription(input);
}

export async function deletePlan(req: FastifyRequest, _reply: FastifyReply) {
  const { planId } = req.params as { planId: string };
  return service.deletePlan(Number(planId));
}
