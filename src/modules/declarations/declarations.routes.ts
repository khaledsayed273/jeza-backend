import type { FastifyInstance } from "fastify";
import * as declarationsController from "./declarations.controller";

export function registerDeclarationsRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/declarations", declarationsController.getDeclarations);
}
