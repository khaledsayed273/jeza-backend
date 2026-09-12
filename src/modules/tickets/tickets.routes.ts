import type { FastifyInstance } from "fastify";
import { requireAdmin, requireUser } from "../../plugins/guard";
import * as ticketsController from "./tickets.controller";

export function registerTicketRoutes(app: FastifyInstance) {
  app.get("/api/tickets", { preHandler: requireUser }, ticketsController.listMyTickets);
  app.get("/api/tickets/all", { preHandler: requireAdmin }, ticketsController.listAllTickets);
  app.get("/api/tickets/:ticketId", { preHandler: requireUser }, ticketsController.getTicket);
  app.post("/api/tickets", { preHandler: requireUser }, ticketsController.createTicket);
  app.post("/api/tickets/:ticketId/messages", { preHandler: requireUser }, ticketsController.addMessage);
  app.post("/api/tickets/:ticketId/admin-messages", { preHandler: requireAdmin }, ticketsController.adminAddMessage);
  app.patch("/api/tickets/:ticketId/status", { preHandler: requireAdmin }, ticketsController.updateStatus);
}
