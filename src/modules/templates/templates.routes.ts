import type { FastifyInstance } from "fastify";
import * as templatesController from "./templates.controller";

export function registerTemplatesRoutes(app: FastifyInstance) {
  app.get("/api/content/templates", templatesController.getTemplates);
}
