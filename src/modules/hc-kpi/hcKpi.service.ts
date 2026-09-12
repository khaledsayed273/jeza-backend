import type { User } from "../../db";
import { calcPerformanceScore, calcTrafficLight } from "./hcKpiCalc";
import * as repo from "./hcKpi.repository";

type OwnerUser = { id: number } | undefined;

function getOwnerId(user: OwnerUser, sessionToken?: string): string {
  if (user?.id) return `user_${user.id}`;
  if (sessionToken) return `anon_${sessionToken}`;
  return "anon_default";
}

// ── Organizations ────────────────────────────────────────────────────────────
export async function listOrganizations(user: OwnerUser, sessionToken?: string) {
  const ownerId = getOwnerId(user, sessionToken);
  const orgs = await repo.listOrganizations(ownerId);
  const trMap = await repo.getTranslationsByEntityType("hc_organization");
  const byId = new Map<number, typeof trMap>();
  for (const t of trMap) {
    let arr = byId.get(t.entityId);
    if (!arr) { arr = []; byId.set(t.entityId, arr); }
    arr.push(t);
  }
  return orgs.map(o => {
    const trs = byId.get(o.id) ?? [];
    const ar = Object.fromEntries(trs.filter(t => t.lang === "ar").map(t => [t.field, t.value]));
    const en = Object.fromEntries(trs.filter(t => t.lang === "en").map(t => [t.field, t.value]));
    return { ...o, nameAr: ar.name ?? "", nameEn: en.name ?? "" };
  });
}

export async function createOrganization(user: OwnerUser, sessionToken: string | undefined, input: {
  nameAr: string;
  nameEn?: string;
  industry?: string;
  size?: "small" | "medium" | "large";
}) {
  const ownerId = getOwnerId(user, sessionToken);
  const id = await repo.createOrganization({
    userId: ownerId,
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    industry: input.industry,
    size: input.size,
  });
  return { id };
}

export async function updateOrganization(user: OwnerUser, sessionToken: string | undefined, id: number, input: {
  nameAr: string;
  nameEn?: string;
  industry?: string;
  size?: "small" | "medium" | "large";
}) {
  const ownerId = getOwnerId(user, sessionToken);
  await repo.updateOrganization(id, ownerId, input);
  return { success: true };
}

export async function deleteOrganization(user: OwnerUser, sessionToken: string | undefined, id: number) {
  const ownerId = getOwnerId(user, sessionToken);
  await repo.deleteOrganization(id, ownerId);
  return { success: true };
}

// ── Reports ──────────────────────────────────────────────────────────────────
export async function listReports(user: OwnerUser, sessionToken: string | undefined, organizationId: number) {
  const ownerId = getOwnerId(user, sessionToken);
  const reports = await repo.listReports(organizationId, ownerId);
  const trMap = await repo.getTranslationsByEntityType("hc_report");
  const byId = new Map<number, typeof trMap>();
  for (const t of trMap) {
    let arr = byId.get(t.entityId);
    if (!arr) { arr = []; byId.set(t.entityId, arr); }
    arr.push(t);
  }
  return reports.map(r => {
    const trs = byId.get(r.id) ?? [];
    const ar = Object.fromEntries(trs.filter(t => t.lang === "ar").map(t => [t.field, t.value]));
    return { ...r, titleAr: ar.title ?? ar.name ?? "" };
  });
}

export async function getReport(user: OwnerUser, sessionToken: string | undefined, reportId: number) {
  const ownerId = getOwnerId(user, sessionToken);
  const report = await repo.getReport(reportId, ownerId);
  if (!report) throw new Error("Report not found");

  const entries = await repo.listEntries(reportId);

  // Attach translations to report
  const reportTrs = await repo.getTranslations("hc_report", report.id);
  const reportAr = reportTrs.ar ?? {};
  const reportEn = reportTrs.en ?? {};
  const enrichedReport = { ...report, titleAr: reportAr.title ?? reportAr.name ?? "", titleEn: reportEn.title ?? reportEn.name ?? "" };

  // Attach translations to entries
  const entryTrMap = await repo.getTranslationsByEntityType("hc_kpi_entry");
  const entryById = new Map<number, typeof entryTrMap>();
  for (const t of entryTrMap) {
    let arr = entryById.get(t.entityId);
    if (!arr) { arr = []; entryById.set(t.entityId, arr); }
    arr.push(t);
  }
  const enrichedEntries = entries.map(e => {
    const trs = entryById.get(e.id) ?? [];
    const ar = Object.fromEntries(trs.filter(t => t.lang === "ar").map(t => [t.field, t.value]));
    const en = Object.fromEntries(trs.filter(t => t.lang === "en").map(t => [t.field, t.value]));
    return { ...e, indicatorNameAr: ar.name ?? "", indicatorNameEn: en.name ?? "" };
  });

  return { report: enrichedReport, entries: enrichedEntries };
}

export async function createReport(user: OwnerUser, sessionToken: string | undefined, input: {
  organizationId: number;
  titleAr: string;
  titleEn?: string;
  periodType: "monthly" | "quarterly";
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  selectedIndicatorKeys: string[];
  customIndicators?: Array<{ nameAr: string; nameEn?: string; category: string; unit?: string }>;
}) {
  const ownerId = getOwnerId(user, sessionToken);
  const reportId = await repo.createReport({
    organizationId: input.organizationId,
    userId: ownerId,
    titleAr: input.titleAr,
    titleEn: input.titleEn,
    periodType: input.periodType,
    periodLabel: input.periodLabel,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
  });

  const indMap = await repo.getBuiltinIndicatorsByKeys(input.selectedIndicatorKeys);
  for (const key of input.selectedIndicatorKeys) {
    const ind = indMap.get(key);
    if (!ind) continue;
    await repo.insertEntry({
      reportId,
      indicatorKey: ind.key,
      indicatorNameAr: ind.nameAr,
      indicatorNameEn: ind.nameEn,
      category: ind.category,
      unit: ind.unit,
      benchmark: ind.benchmark,
      isCustom: 0,
    });
  }

  for (const custom of input.customIndicators ?? []) {
    await repo.insertEntry({
      reportId,
      indicatorKey: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      indicatorNameAr: custom.nameAr,
      indicatorNameEn: custom.nameEn,
      category: custom.category || "custom",
      unit: custom.unit,
      isCustom: 1,
    });
  }

  return { reportId };
}

export async function updateReportStatus(user: OwnerUser, sessionToken: string | undefined, reportId: number, status: "draft" | "completed") {
  const ownerId = getOwnerId(user, sessionToken);
  await repo.updateReportStatus(reportId, ownerId, status);
  return { success: true };
}

export async function deleteReport(user: OwnerUser, sessionToken: string | undefined, reportId: number) {
  const ownerId = getOwnerId(user, sessionToken);
  await repo.deleteReport(reportId, ownerId);
  return { success: true };
}

// ── Entries ──────────────────────────────────────────────────────────────────
export async function updateKpiEntry(input: {
  entryId: number;
  currentValue?: number | null;
  currentValueText?: string | null;
  benchmark?: string | null;
  targetValue?: number | null;
  targetDate?: string | null;
  initiative?: string | null;
  initiativeDate?: string | null;
}) {
  let trafficLight: "green" | "yellow" | "red" | "grey" = "grey";
  let performanceScore: number | null = null;

  if (input.currentValue != null && input.targetValue != null) {
    const indicatorKey = await repo.getEntryIndicatorKey(input.entryId);
    const ind = indicatorKey ? (await repo.getBuiltinIndicatorsByKeys([indicatorKey])).get(indicatorKey) : null;
    const higherIsBetter = ind?.higherIsBetter ?? true;

    trafficLight = calcTrafficLight(input.currentValue, input.targetValue, higherIsBetter);
    performanceScore = calcPerformanceScore(input.currentValue, input.targetValue, higherIsBetter);
  }

  await repo.updateEntry(input.entryId, {
    currentValue: input.currentValue?.toString(),
    currentValueText: input.currentValueText,
    benchmark: input.benchmark,
    targetValue: input.targetValue?.toString(),
    targetDate: input.targetDate,
    initiative: input.initiative,
    initiativeDate: input.initiativeDate,
    trafficLight,
    performanceScore: performanceScore?.toString(),
  });

  return { success: true, trafficLight, performanceScore };
}

export async function addCustomIndicator(input: {
  reportId: number;
  nameAr: string;
  nameEn?: string;
  category?: string;
  unit?: string;
}) {
  const id = await repo.insertEntry({
    reportId: input.reportId,
    indicatorKey: `custom_${Date.now()}`,
    indicatorNameAr: input.nameAr,
    indicatorNameEn: input.nameEn,
    category: input.category ?? "custom",
    unit: input.unit,
    isCustom: 1,
  });
  return { id };
}

export async function deleteKpiEntry(entryId: number) {
  await repo.deleteEntry(entryId);
  return { success: true };
}
