import type { FastifyInstance } from "fastify";
import * as turnoverController from "./turnover.controller";

export function registerTurnoverRoutes(app: FastifyInstance) {
  app.get("/api/turnover", turnoverController.getTurnover);
}
