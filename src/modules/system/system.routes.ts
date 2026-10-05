import type { FastifyInstance } from "fastify";
import * as systemController from "./system.controller";

export function registerSystemRoutes(app: FastifyInstance) {
  app.get("/api/v1/system/health", systemController.health);
}
