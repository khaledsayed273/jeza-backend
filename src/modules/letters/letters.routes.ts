import type { FastifyInstance } from "fastify";
import * as lettersController from "./letters.controller";

export function registerLettersRoutes(app: FastifyInstance) {
  app.post("/api/letters/generate", lettersController.generate);
}
