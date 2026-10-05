import type { FastifyInstance } from "fastify";
import * as hrCostController from "./hrCost.controller";

export function registerHrCostRoutes(app: FastifyInstance) {
  app.get("/api/v1/hr-cost", hrCostController.getHrCost);
}
