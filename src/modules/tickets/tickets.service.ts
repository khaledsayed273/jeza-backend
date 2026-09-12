import { ForbiddenError, NotFoundError } from "../../shared/errors";
import * as repo from "./tickets.repository";

export const listMyTickets = (userId: number) => repo.getUserTickets(userId);
export const listAllTickets = () => repo.getAllTickets();

export async function getTicket(user: { id: number; role: string }, ticketId: number) {
  const ticket = await repo.getTicketById(ticketId);
  if (!ticket) throw NotFoundError("Ticket not found");
  if (ticket.userId !== user.id && user.role !== "admin") {
    throw ForbiddenError("Forbidden");
  }
  const messages = await repo.getTicketMessages(ticketId);
  return { ticket, messages };
}

export async function createTicket(userId: number, input: {
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  message: string;
}) {
  const ticketId = await repo.createTicket({
    userId,
    subject: input.subject,
    category: input.category,
    priority: input.priority,
    status: "open",
  });
  await repo.addTicketMessage({ ticketId, userId, message: input.message });
  return { success: true };
}

export async function addMessage(user: { id: number; role: string }, ticketId: number, message: string) {
  const ticket = await repo.getTicketById(ticketId);
  if (!ticket) throw NotFoundError("Ticket not found");
  if (ticket.userId !== user.id && user.role !== "admin") {
    throw ForbiddenError("Forbidden");
  }
  await repo.addTicketMessage({ ticketId, userId: user.id, message });
  return { success: true };
}

export async function adminAddMessage(userId: number, ticketId: number, message: string) {
  const ticket = await repo.getTicketById(ticketId);
  if (!ticket) throw NotFoundError("Ticket not found");
  await repo.addTicketMessage({ ticketId, userId, message });
  await repo.updateTicketStatus(ticketId, "in_progress");
  return { success: true };
}

export async function updateStatus(ticketId: number, status: "open" | "in_progress" | "resolved" | "closed") {
  await repo.updateTicketStatus(ticketId, status);
  return { success: true };
}
