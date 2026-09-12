import type { FastifyInstance } from "fastify";
import * as leaveController from "./leave.controller";

export function registerLeaveRoutes(app: FastifyInstance) {
  app.get("/api/leave", leaveController.getLeave);
}
