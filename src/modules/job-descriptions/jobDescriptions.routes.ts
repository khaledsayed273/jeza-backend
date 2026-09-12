import type { FastifyInstance } from "fastify";
import * as jobDescriptionsController from "./jobDescriptions.controller";

export function registerJobDescriptionsRoutes(app: FastifyInstance) {
  app.get("/api/content/job-descriptions", jobDescriptionsController.getJobDescriptions);
}
