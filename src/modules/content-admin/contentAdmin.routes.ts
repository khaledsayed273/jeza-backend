import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as controller from "./contentAdmin.controller";

export function registerContentAdminRoutes(app: FastifyInstance) {
  app.get("/api/v1/admin/content/:module/:sub", { preHandler: requireAdmin }, controller.listContent);
  app.post("/api/v1/admin/content/:module/:sub", { preHandler: requireAdmin }, controller.createContent);
  app.patch("/api/v1/admin/content/:module/:sub/:id", { preHandler: requireAdmin }, controller.updateContent);
  app.delete("/api/v1/admin/content/:module/:sub/:id", { preHandler: requireAdmin }, controller.deleteContent);
}
