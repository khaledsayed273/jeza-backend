import type { FastifyInstance } from "fastify";
import * as hrExplainersController from "./hrExplainers.controller";

export function registerHrExplainersRoutes(app: FastifyInstance) {
  app.get("/api/content/hr-explainers", hrExplainersController.getHrExplainers);
}
