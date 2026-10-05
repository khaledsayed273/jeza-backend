import type { FastifyInstance } from "fastify";
import * as employeeMarketController from "./employeeMarket.controller";

export function registerEmployeeMarketRoutes(app: FastifyInstance) {
  app.get("/api/v1/employee-market", employeeMarketController.getEmployeeMarket);
}
