import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as controller from "./contentAdmin.controller";

export function registerContentAdminRoutes(app: FastifyInstance) {
  app.get("/api/admin/content/:module/:sub", { preHandler: requireAdmin }, controller.listContent);
  app.post("/api/admin/content/:module/:sub", { preHandler: requireAdmin }, controller.createContent);
  app.patch("/api/admin/content/:module/:sub/:id", { preHandler: requireAdmin }, controller.updateContent);
  app.delete("/api/admin/content/:module/:sub/:id", { preHandler: requireAdmin }, controller.deleteContent);
}
