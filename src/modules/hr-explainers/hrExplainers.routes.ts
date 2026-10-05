import type { FastifyInstance } from "fastify";
import * as hrExplainersController from "./hrExplainers.controller";

export function registerHrExplainersRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/hr-explainers", hrExplainersController.getHrExplainers);
}
