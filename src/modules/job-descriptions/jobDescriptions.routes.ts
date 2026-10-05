import type { FastifyInstance } from "fastify";
import * as jobDescriptionsController from "./jobDescriptions.controller";

export function registerJobDescriptionsRoutes(app: FastifyInstance) {
  app.get("/api/v1/content/job-descriptions", jobDescriptionsController.getJobDescriptions);
}
