import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as service from "./hcKpi.service";

const createOrganizationSchema = z.object({
  nameAr: z.string().min(1).max(200),
  nameEn: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
});

const createReportSchema = z.object({
  organizationId: z.number(),
  titleAr: z.string().min(1).max(200),
  titleEn: z.string().max(200).optional(),
  periodType: z.enum(["monthly", "quarterly"]),
  periodLabel: z.string().min(1).max(50),
  periodStart: z.string(),
  periodEnd: z.string(),
  selectedIndicatorKeys: z.array(z.string()),
  customIndicators: z.array(z.object({
    nameAr: z.string(),
    nameEn: z.string().optional(),
    category: z.string(),
    unit: z.string().optional(),
  })).optional(),
});

const updateReportStatusSchema = z.object({
  status: z.enum(["draft", "completed"]),
});

const updateKpiEntrySchema = z.object({
  currentValue: z.number().nullable().optional(),
  currentValueText: z.string().nullable().optional(),
  benchmark: z.string().nullable().optional(),
  targetValue: z.number().nullable().optional(),
  targetDate: z.string().nullable().optional(),
  initiative: z.string().nullable().optional(),
  initiativeDate: z.string().nullable().optional(),
});

const addCustomIndicatorSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().optional(),
  category: z.string().default("custom"),
  unit: z.string().optional(),
});

function sessionToken(req: FastifyRequest): string | undefined {
  const value = req.headers["x-session-token"];
  return Array.isArray(value) ? value[0] : value;
}

export async function listOrganizations(req: FastifyRequest, _reply: FastifyReply) {
  return service.listOrganizations(req.user, sessionToken(req));
}

export async function createOrganization(req: FastifyRequest, _reply: FastifyReply) {
  const input = createOrganizationSchema.parse(req.body);
  return service.createOrganization(req.user, sessionToken(req), input);
}

export async function updateOrganization(req: FastifyRequest, _reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const input = createOrganizationSchema.parse(req.body);
  return service.updateOrganization(req.user, sessionToken(req), Number(id), input);
}

export async function deleteOrganization(req: FastifyRequest, _reply: FastifyReply) {
  const { id } = req.params as { id: string };
  return service.deleteOrganization(req.user, sessionToken(req), Number(id));
}

export async function listReports(req: FastifyRequest, _reply: FastifyReply) {
  const { organizationId } = req.params as { organizationId: string };
  return service.listReports(req.user, sessionToken(req), Number(organizationId));
}

export async function getReport(req: FastifyRequest, _reply: FastifyReply) {
  const { reportId } = req.params as { reportId: string };
  return service.getReport(req.user, sessionToken(req), Number(reportId));
}

export async function createReport(req: FastifyRequest, _reply: FastifyReply) {
  const input = createReportSchema.parse(req.body);
  return service.createReport(req.user, sessionToken(req), input);
}

export async function updateReportStatus(req: FastifyRequest, _reply: FastifyReply) {
  const { reportId } = req.params as { reportId: string };
  const { status } = updateReportStatusSchema.parse(req.body);
  return service.updateReportStatus(req.user, sessionToken(req), Number(reportId), status);
}

export async function deleteReport(req: FastifyRequest, _reply: FastifyReply) {
  const { reportId } = req.params as { reportId: string };
  return service.deleteReport(req.user, sessionToken(req), Number(reportId));
}

export async function updateKpiEntry(req: FastifyRequest, _reply: FastifyReply) {
  const { entryId } = req.params as { entryId: string };
  const input = updateKpiEntrySchema.parse(req.body);
  return service.updateKpiEntry({ entryId: Number(entryId), ...input });
}

export async function addCustomIndicator(req: FastifyRequest, _reply: FastifyReply) {
  const { reportId } = req.params as { reportId: string };
  const input = addCustomIndicatorSchema.parse(req.body);
  return service.addCustomIndicator({ reportId: Number(reportId), ...input });
}

export async function deleteKpiEntry(req: FastifyRequest, _reply: FastifyReply) {
  const { entryId } = req.params as { entryId: string };
  return service.deleteKpiEntry(Number(entryId));
}
