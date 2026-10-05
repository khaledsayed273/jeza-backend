import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as configController from "./config.controller";

export function registerConfigRoutes(app: FastifyInstance) {
  app.get("/api/v1/config", configController.getConfig);
  app.patch("/api/v1/admin/config/:key", { preHandler: requireAdmin }, configController.updateConfig);
}
