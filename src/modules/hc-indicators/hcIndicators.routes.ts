import type { FastifyInstance } from "fastify";
import * as hcIndicatorsController from "./hcIndicators.controller";

export function registerHcIndicatorsRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/hc-indicators", hcIndicatorsController.getHcIndicators);
}
