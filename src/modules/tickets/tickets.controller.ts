import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as service from "./tickets.service";

const createTicketSchema = z.object({
  subject: z.string().min(3).max(300),
  category: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  message: z.string().min(1),
});

const addMessageSchema = z.object({
  message: z.string().min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});

export async function listMyTickets(req: FastifyRequest, _reply: FastifyReply) {
  return service.listMyTickets(req.user!.id);
}

export async function listAllTickets(_req: FastifyRequest, _reply: FastifyReply) {
  return service.listAllTickets();
}

export async function getTicket(req: FastifyRequest, _reply: FastifyReply) {
  const { ticketId } = req.params as { ticketId: string };
  return service.getTicket(req.user!, Number(ticketId));
}

export async function createTicket(req: FastifyRequest, _reply: FastifyReply) {
  const input = createTicketSchema.parse(req.body);
  return service.createTicket(req.user!.id, input);
}

export async function addMessage(req: FastifyRequest, _reply: FastifyReply) {
  const { ticketId } = req.params as { ticketId: string };
  const { message } = addMessageSchema.parse(req.body);
  return service.addMessage(req.user!, Number(ticketId), message);
}

export async function adminAddMessage(req: FastifyRequest, _reply: FastifyReply) {
  const { ticketId } = req.params as { ticketId: string };
  const { message } = addMessageSchema.parse(req.body);
  return service.adminAddMessage(req.user!.id, Number(ticketId), message);
}

export async function updateStatus(req: FastifyRequest, _reply: FastifyReply) {
  const { ticketId } = req.params as { ticketId: string };
  const { status } = updateStatusSchema.parse(req.body);
  return service.updateStatus(Number(ticketId), status);
}
