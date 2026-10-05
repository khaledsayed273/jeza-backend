import type { FastifyInstance } from "fastify";
import * as templatesController from "./templates.controller";

export function registerTemplatesRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/templates", templatesController.getTemplates);
}
