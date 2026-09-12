import type { FastifyInstance } from "fastify";
import { requireAdmin, requireUser } from "../../plugins/guard";
import * as subscriptionsController from "./subscriptions.controller";

export function registerSubscriptionRoutes(app: FastifyInstance) {
  app.get("/api/subscriptions/plans", subscriptionsController.listPlans);
  app.get("/api/subscriptions/plans/all", { preHandler: requireAdmin }, subscriptionsController.listAllPlans);
  app.post("/api/subscriptions/plans", { preHandler: requireAdmin }, subscriptionsController.createPlan);
  app.patch("/api/subscriptions/plans/:planId", { preHandler: requireAdmin }, subscriptionsController.updatePlan);
  app.get("/api/subscriptions/me", { preHandler: requireUser }, subscriptionsController.getMySubscription);
  app.get("/api/subscriptions", { preHandler: requireAdmin }, subscriptionsController.listAllSubscriptions);
  app.post("/api/subscriptions", { preHandler: requireAdmin }, subscriptionsController.createSubscription);
  app.delete("/api/subscriptions/plans/:planId", { preHandler: requireAdmin }, subscriptionsController.deletePlan);
}
