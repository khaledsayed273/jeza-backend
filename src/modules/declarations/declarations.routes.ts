import type { FastifyInstance } from "fastify";
import * as declarationsController from "./declarations.controller";

export function registerDeclarationsRoutes(app: FastifyInstance) {
  app.get("/api/content/declarations", declarationsController.getDeclarations);
}
