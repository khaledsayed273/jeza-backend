import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb, hcKpiCategories, hcBuiltinIndicators, hcKpiEntries, hcOrganizations, hcReports, translations } from "../../db";

// ── Translation helpers ─────────────────────────────────────────────────────

async function upsertTranslations(entityType: string, entityId: number, fields: Record<string, string | undefined>) {
  const db = getDb();
  for (const [lang, value] of Object.entries(fields)) {
    if (!value) continue;
    const langCode = lang === "ar" ? "ar" : "en";
    const fieldKey = Object.keys(fields).length === 2 && "ar" in fields && "en" in fields ? "name" : "name";
    // Determine field name from lang key pattern
    let fieldName = "name";
    if (lang.startsWith("title")) fieldName = "title";
    else if (lang.startsWith("name")) fieldName = "name";
    else if (lang.startsWith("indicator")) fieldName = "name";

    await db.insert(translations).values({
      entityType,
      entityId,
      lang: langCode,
      field: fieldName,
      value,
    }).onDuplicateKeyUpdate({ set: { value } });
  }
}

export async function getTranslations(entityType: string, entityId: number) {
  const rows = await getDb()
    .select()
    .from(translations)
    .where(and(eq(translations.entityType, entityType), eq(translations.entityId, entityId)));
  const result: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!result[row.lang]) result[row.lang] = {};
    result[row.lang][row.field] = row.value;
  }
  return result;
}

export async function getTranslationsByEntityType(entityType: string) {
  return getDb()
    .select()
    .from(translations)
    .where(eq(translations.entityType, entityType));
}

export async function getTranslationsByEntityIds(entityType: string, ids: number[]) {
  if (!ids.length) return [];
  return getDb()
    .select()
    .from(translations)
    .where(and(eq(translations.entityType, entityType), inArray(translations.entityId, ids)));
}

// ── KPI Categories (for PDF layout) ───────────────────────────────────────────
export async function listKpiCategoriesForPdf() {
  const db = getDb();
  const cats = await db.select().from(hcKpiCategories).orderBy(asc(hcKpiCategories.sortOrder));
  const trs = await getTranslationsByEntityType("hc_kpi_category");
  const byId = new Map<number, Record<string, Record<string, string>>>();
  for (const t of trs) {
    let langMap = byId.get(t.entityId);
    if (!langMap) { langMap = {}; byId.set(t.entityId, langMap); }
    if (!langMap[t.lang]) langMap[t.lang] = {};
    langMap[t.lang][t.field] = t.value;
  }
  return cats.map(c => ({
    key: c.code,
    ar: byId.get(c.id)?.ar?.name ?? "",
    en: byId.get(c.id)?.en?.name ?? "",
    color: c.color,
  }));
}

// ── Builtin Indicators (bulk, no N+1) ─────────────────────────────────────────
export async function getBuiltinIndicatorsByKeys(keys: string[]) {
  const map = new Map<string, {
    key: string;
    nameAr: string;
    nameEn: string;
    category: string;
    unit: string;
    benchmark: string;
    higherIsBetter: boolean;
  }>();
  if (!keys.length) return map;

  const rows = await getDb()
    .select({
      id: hcBuiltinIndicators.id,
      key: hcBuiltinIndicators.key,
      categoryKey: hcKpiCategories.code,
      unit: hcBuiltinIndicators.unit,
      higherIsBetter: hcBuiltinIndicators.higherIsBetter,
    })
    .from(hcBuiltinIndicators)
    .leftJoin(hcKpiCategories, eq(hcBuiltinIndicators.categoryId, hcKpiCategories.id))
    .where(inArray(hcBuiltinIndicators.key, keys));

  if (!rows.length) return map;

  const ids = rows.map((row) => row.id);
  const trs = await getTranslationsByEntityIds("hc_builtin_indicator", ids);
  const trById = new Map<number, Record<string, Record<string, string>>>();
  for (const t of trs) {
    let langMap = trById.get(t.entityId);
    if (!langMap) { langMap = {}; trById.set(t.entityId, langMap); }
    if (!langMap[t.lang]) langMap[t.lang] = {};
    langMap[t.lang][t.field] = t.value;
  }

  for (const r of rows) {
    const tr = trById.get(r.id) ?? {};
    map.set(r.key, {
      key: r.key,
      nameAr: tr.ar?.name ?? "",
      nameEn: tr.en?.name ?? "",
      category: r.categoryKey ?? "",
      unit: r.unit ?? "",
      benchmark: tr.ar?.benchmark ?? "",
      higherIsBetter: (r.higherIsBetter ?? 1) === 1,
    });
  }
  return map;
}

// ── Organizations ────────────────────────────────────────────────────────────
export async function listOrganizations(ownerId: string) {
  return getDb()
    .select()
    .from(hcOrganizations)
    .where(eq(hcOrganizations.userId, ownerId))
    .orderBy(desc(hcOrganizations.createdAt));
}

export async function createOrganization(values: {
  userId: string;
  nameAr: string;
  nameEn?: string;
  industry?: string;
  size?: "small" | "medium" | "large";
}) {
  const [result] = await getDb().insert(hcOrganizations).values({
    userId: values.userId,
    industry: values.industry,
    size: values.size ?? "medium",
  });
  const id = Number(result.insertId);
  await upsertTranslations("hc_organization", id, { ar: values.nameAr, en: values.nameEn });
  return id;
}

export async function updateOrganization(id: number, ownerId: string, values: {
  nameAr?: string;
  nameEn?: string;
  industry?: string;
  size?: "small" | "medium" | "large";
}) {
  const { nameAr, nameEn, ...rest } = values;
  if (Object.keys(rest).length > 0) {
    await getDb()
      .update(hcOrganizations)
      .set(rest)
      .where(and(eq(hcOrganizations.id, id), eq(hcOrganizations.userId, ownerId)));
  }
  if (nameAr !== undefined || nameEn !== undefined) {
    const existing = await getTranslations("hc_organization", id);
    const fields: Record<string, string | undefined> = {};
    if (nameAr !== undefined) fields.ar = nameAr;
    else if (existing.ar?.name) fields.ar = existing.ar.name;
    if (nameEn !== undefined) fields.en = nameEn;
    else if (existing.en?.name) fields.en = existing.en.name;
    await upsertTranslations("hc_organization", id, fields);
  }
}

export async function deleteOrganization(id: number, ownerId: string) {
  await getDb()
    .delete(hcOrganizations)
    .where(and(eq(hcOrganizations.id, id), eq(hcOrganizations.userId, ownerId)));
}

// ── Reports ──────────────────────────────────────────────────────────────────
export async function listReports(organizationId: number, ownerId: string) {
  return getDb()
    .select()
    .from(hcReports)
    .where(and(
      eq(hcReports.organizationId, organizationId),
      eq(hcReports.userId, ownerId),
    ))
    .orderBy(desc(hcReports.createdAt));
}

export async function getReport(reportId: number, ownerId: string) {
  const result = await getDb()
    .select()
    .from(hcReports)
    .where(and(eq(hcReports.id, reportId), eq(hcReports.userId, ownerId)));
  return result[0];
}

export async function getReportById(reportId: number) {
  const result = await getDb().select().from(hcReports).where(eq(hcReports.id, reportId));
  return result[0];
}

export async function createReport(values: {
  organizationId: number;
  userId: string;
  titleAr: string;
  titleEn?: string;
  periodType: "monthly" | "quarterly";
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
}) {
  const [result] = await getDb().insert(hcReports).values({
    organizationId: values.organizationId,
    userId: values.userId,
    periodType: values.periodType,
    periodLabel: values.periodLabel,
    periodStart: values.periodStart,
    periodEnd: values.periodEnd,
    status: "draft",
  });
  const id = Number(result.insertId);
  await upsertTranslations("hc_report", id, { ar: values.titleAr, en: values.titleEn });
  return id;
}

export async function updateReportStatus(reportId: number, ownerId: string, status: "draft" | "completed") {
  await getDb()
    .update(hcReports)
    .set({ status })
    .where(and(eq(hcReports.id, reportId), eq(hcReports.userId, ownerId)));
}

export async function deleteReport(reportId: number, ownerId: string) {
  await getDb().delete(hcKpiEntries).where(eq(hcKpiEntries.reportId, reportId));
  await getDb()
    .delete(hcReports)
    .where(and(eq(hcReports.id, reportId), eq(hcReports.userId, ownerId)));
}

// ── Entries ──────────────────────────────────────────────────────────────────
export async function listEntries(reportId: number) {
  return getDb().select().from(hcKpiEntries).where(eq(hcKpiEntries.reportId, reportId)).orderBy(hcKpiEntries.category);
}

export async function insertEntry(values: {
  reportId: number;
  indicatorKey: string;
  indicatorNameAr: string;
  indicatorNameEn?: string;
  category: string;
  unit?: string;
  benchmark?: string;
  isCustom?: number;
}) {
  const [result] = await getDb().insert(hcKpiEntries).values({
    reportId: values.reportId,
    indicatorKey: values.indicatorKey,
    category: values.category,
    unit: values.unit,
    benchmark: values.benchmark,
    isCustom: values.isCustom ?? 0,
    trafficLight: "grey",
  });
  const id = Number(result.insertId);
  await upsertTranslations("hc_kpi_entry", id, { ar: values.indicatorNameAr, en: values.indicatorNameEn });
  return id;
}

export async function getEntryIndicatorKey(entryId: number) {
  const result = await getDb()
    .select({ indicatorKey: hcKpiEntries.indicatorKey })
    .from(hcKpiEntries)
    .where(eq(hcKpiEntries.id, entryId));
  return result[0]?.indicatorKey;
}

export async function updateEntry(entryId: number, values: {
  currentValue?: string | null;
  currentValueText?: string | null;
  benchmark?: string | null;
  targetValue?: string | null;
  targetDate?: string | null;
  initiative?: string | null;
  initiativeDate?: string | null;
  trafficLight: "green" | "yellow" | "red" | "grey";
  performanceScore?: string | null;
}) {
  await getDb().update(hcKpiEntries).set(values).where(eq(hcKpiEntries.id, entryId));
}

export async function deleteEntry(entryId: number) {
  await getDb().delete(hcKpiEntries).where(eq(hcKpiEntries.id, entryId));
}

export async function getOrganization(organizationId: number) {
  const result = await getDb().select().from(hcOrganizations).where(eq(hcOrganizations.id, organizationId));
  return result[0];
}
