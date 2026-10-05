import type { FastifyInstance } from "fastify";
import * as calculatorController from "./calculator.controller";

export function registerCalculatorRoutes(app: FastifyInstance) {
  app.get("/api/v1/calculator", calculatorController.getCalculator);
}
