import type { FastifyInstance } from "fastify";
import { requireAdmin, requireUser } from "../../plugins/guard";
import * as subscriptionsController from "./subscriptions.controller";

export function registerSubscriptionRoutes(app: FastifyInstance) {
  app.get("/api/v1/subscriptions/plans", subscriptionsController.listPlans);
  app.get("/api/v1/subscriptions/plans/all", { preHandler: requireAdmin }, subscriptionsController.listAllPlans);
  app.post("/api/v1/subscriptions/plans", { preHandler: requireAdmin }, subscriptionsController.createPlan);
  app.patch("/api/v1/subscriptions/plans/:planId", { preHandler: requireAdmin }, subscriptionsController.updatePlan);
  app.get("/api/v1/subscriptions/me", { preHandler: requireUser }, subscriptionsController.getMySubscription);
  app.get("/api/v1/subscriptions", { preHandler: requireAdmin }, subscriptionsController.listAllSubscriptions);
  app.post("/api/v1/subscriptions", { preHandler: requireAdmin }, subscriptionsController.createSubscription);
  app.delete("/api/v1/subscriptions/plans/:planId", { preHandler: requireAdmin }, subscriptionsController.deletePlan);
}
