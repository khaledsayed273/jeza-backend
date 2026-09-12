import { asc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { fetchTranslations, upsertTranslations, deleteTranslations } from "../../shared/translations";
import { NotFoundError, BadRequestError } from "../../shared/errors";
import { contentRegistry, type ContentSubEntity } from "./registry";

function find(module: string, sub: string): ContentSubEntity {
  const entry = contentRegistry.find((r) => r.module === module && r.sub === sub);
  if (!entry) throw NotFoundError("كيان المحتوى غير معروف");
  return entry;
}

function getTableId(entry: ContentSubEntity) {
  return (entry.table as any).id;
}

async function resolveId(entry: ContentSubEntity, raw: string): Promise<number> {
  if (entry.idColumn === "id") return Number(raw);
  const idCol = (entry.table as any)[entry.idColumn];
  const rows = await getDb()
    .select({ id: getTableId(entry) })
    .from(entry.table)
    .where(eq(idCol, raw))
    .limit(1);
  if (!rows[0]) throw NotFoundError("العنصر غير موجود");
  return rows[0].id;
}

function coerceColumns(entry: ContentSubEntity, body: Record<string, unknown>): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const col of entry.columns) {
    if (!(col in body)) continue;
    let v = body[col];
    if (entry.numberColumns?.includes(col)) {
      v = v === "" || v === null || v === undefined ? null : Number(v);
    } else if (entry.jsonColumns?.includes(col)) {
      if (v !== null && v !== undefined && typeof v !== "string") v = JSON.stringify(v);
    }
    values[col] = v;
  }
  return values;
}

async function resolveFks(entry: ContentSubEntity, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const values: Record<string, unknown> = {};
  for (const fk of entry.fkColumns ?? []) {
    const raw = body[fk.column];
    if (raw === undefined || raw === null || raw === "") {
      values[fk.column] = null;
      continue;
    }
    const parent = find(fk.parentModule, fk.parentSub);
    const parentIdCol = (parent.table as any)[parent.idColumn];
    const rows = await getDb()
      .select({ id: getTableId(parent) })
      .from(parent.table)
      .where(eq(parentIdCol, raw as string))
      .limit(1);
    values[fk.column] = rows[0]?.id ?? null;
  }
  return values;
}

export async function listContent(module: string, sub: string) {
  const entry = find(module, sub);
  const rows = await getDb().select().from(entry.table).orderBy(asc((entry.table as any).sortOrder));
  const tr = await fetchTranslations(entry.entityType);

  const out: Record<string, unknown>[] = [];
  for (const r of rows) {
    const rid = r.id as number;
    const naturalId = entry.idColumn === "id" ? rid : ((r as any)[entry.idColumn] ?? rid);
    const row: Record<string, unknown> = { id: naturalId, dbId: rid };
    for (const col of entry.columns) row[col] = (r as any)[col];
    for (const f of entry.translatedFields) {
      row[`${f}Ar`] = tr.get(rid)?.ar?.[f] ?? "";
      row[`${f}En`] = tr.get(rid)?.en?.[f] ?? "";
    }
    for (const fk of entry.fkColumns ?? []) {
      const pid = (r as any)[fk.column];
      if (pid == null) {
        row[fk.column] = null;
        continue;
      }
      const parent = find(fk.parentModule, fk.parentSub);
      const parentIdCol = (parent.table as any)[parent.idColumn];
      const prow = await getDb()
        .select({ code: parentIdCol })
        .from(parent.table)
        .where(eq(getTableId(parent), pid))
        .limit(1);
      row[fk.column] = (prow[0] as any)?.[parent.idColumn] ?? null;
    }
    out.push(row);
  }
  return { rows: out };
}

export async function createContent(module: string, sub: string, body: Record<string, unknown>) {
  const entry = find(module, sub);
  const values = { ...coerceColumns(entry, body), ...(await resolveFks(entry, body)) };

  if (entry.idColumn === "code" && values.code) {
    const idCol = (entry.table as any)[entry.idColumn];
    const existing = await getDb().select({ id: getTableId(entry) }).from(entry.table).where(eq(idCol, values.code)).limit(1);
    if (existing[0]) throw BadRequestError("الكود مكرر — يرجى استخدام كود آخر");
  }

  const result = await getDb().insert(entry.table).values(values);
  const id = Number((result as any).insertId);
  await upsertTranslations(entry.entityType, id, body.translations as any, entry.translatedJsonFields);
  return { id, ...values };
}

export async function updateContent(module: string, sub: string, rawId: string, body: Record<string, unknown>) {
  const entry = find(module, sub);
  const id = await resolveId(entry, rawId);
  const values = { ...coerceColumns(entry, body), ...(await resolveFks(entry, body)) };
  if (Object.keys(values).length) {
    await getDb().update(entry.table).set(values).where(eq(getTableId(entry), id));
  }
  if (body.translations) {
    await upsertTranslations(entry.entityType, id, body.translations as any, entry.translatedJsonFields);
  }
  return { id, ...values };
}

export async function deleteContent(module: string, sub: string, rawId: string) {
  const entry = find(module, sub);
  const id = await resolveId(entry, rawId);
  await deleteTranslations(entry.entityType, id);
  await getDb().delete(entry.table).where(eq(getTableId(entry), id));
  return { id };
}
