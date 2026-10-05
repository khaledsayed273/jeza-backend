import type { FastifyInstance } from "fastify";
import * as turnoverController from "./turnover.controller";

export function registerTurnoverRoutes(app: FastifyInstance) {
  app.get("/api/v1/turnover", turnoverController.getTurnover);
}
