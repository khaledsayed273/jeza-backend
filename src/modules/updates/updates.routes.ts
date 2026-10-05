import type { FastifyInstance } from "fastify";
import * as updatesController from "./updates.controller";

export function registerUpdatesRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/updates", updatesController.getUpdates);
}
