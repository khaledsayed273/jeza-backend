import type { FastifyInstance } from "fastify";
import { requireAdmin, requireUser } from "../../plugins/guard";
import * as ticketsController from "./tickets.controller";

export function registerTicketRoutes(app: FastifyInstance) {
  app.get("/api/v1/tickets", { preHandler: requireUser }, ticketsController.listMyTickets);
  app.get("/api/v1/tickets/all", { preHandler: requireAdmin }, ticketsController.listAllTickets);
  app.get("/api/v1/tickets/:ticketId", { preHandler: requireUser }, ticketsController.getTicket);
  app.post("/api/v1/tickets", { preHandler: requireUser }, ticketsController.createTicket);
  app.post("/api/v1/tickets/:ticketId/messages", { preHandler: requireUser }, ticketsController.addMessage);
  app.post("/api/v1/tickets/:ticketId/admin-messages", { preHandler: requireAdmin }, ticketsController.adminAddMessage);
  app.patch("/api/v1/tickets/:ticketId/status", { preHandler: requireAdmin }, ticketsController.updateStatus);
}
