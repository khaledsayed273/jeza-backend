import type { FastifyInstance } from "fastify";
import * as trainingController from "./training.controller";

export function registerTrainingRoutes(app: FastifyInstance) {
  app.get("/api/training", trainingController.getTraining);
}
