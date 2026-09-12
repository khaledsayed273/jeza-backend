import type { FastifyInstance } from "fastify";
import * as hrCostController from "./hrCost.controller";

export function registerHrCostRoutes(app: FastifyInstance) {
  app.get("/api/hr-cost", hrCostController.getHrCost);
}
