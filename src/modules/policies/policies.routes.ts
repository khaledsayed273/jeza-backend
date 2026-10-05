import type { FastifyInstance } from "fastify";
import * as policiesController from "./policies.controller";

export function registerPoliciesRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/policies", policiesController.getPolicies);
}
