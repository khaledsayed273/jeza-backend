import { desc, eq } from "drizzle-orm";
import { getDb, supportTickets, ticketMessages } from "../../db";

export async function createTicket(ticket: {
  userId: number;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  status?: "open" | "in_progress" | "resolved" | "closed";
}) {
  const [result] = await getDb().insert(supportTickets).values({
    userId: ticket.userId,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status ?? "open",
  }).$returningId();
  return result.id;
}

export async function getTicketById(ticketId: number) {
  const result = await getDb().select().from(supportTickets).where(eq(supportTickets.id, ticketId)).limit(1);
  return result[0];
}

export async function getUserTickets(userId: number) {
  return getDb().select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
}

export async function getAllTickets() {
  return getDb().select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
}

export async function updateTicketStatus(ticketId: number, status: string) {
  await getDb().update(supportTickets).set({ status: status as any, updatedAt: new Date() }).where(eq(supportTickets.id, ticketId));
}

export async function addTicketMessage(msg: {
  ticketId: number;
  userId: number;
  message: string;
}) {
  await getDb().insert(ticketMessages).values(msg);
}

export async function getTicketMessages(ticketId: number) {
  return getDb().select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt);
}
