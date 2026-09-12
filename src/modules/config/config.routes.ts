import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as configController from "./config.controller";

export function registerConfigRoutes(app: FastifyInstance) {
  app.get("/api/config", configController.getConfig);
  app.patch("/api/admin/config/:key", { preHandler: requireAdmin }, configController.updateConfig);
}
