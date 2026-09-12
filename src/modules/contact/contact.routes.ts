import type { FastifyInstance } from "fastify";
import * as contactController from "./contact.controller";

export function registerContactRoutes(app: FastifyInstance) {
  app.post("/api/contact/submit", contactController.submit);
}
