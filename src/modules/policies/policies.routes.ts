import type { FastifyInstance } from "fastify";
import * as policiesController from "./policies.controller";

export function registerPoliciesRoutes(app: FastifyInstance) {
  app.get("/api/content/policies", policiesController.getPolicies);
}
