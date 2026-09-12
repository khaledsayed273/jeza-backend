import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { translations, type InsertTranslation } from "../../drizzle/schema";

type TrMap = Map<number, Record<string, Record<string, string>>>;

export async function fetchTranslations(entityType: string): Promise<TrMap> {
  const rows = await getDb().select().from(translations).where(eq(translations.entityType, entityType));
  const map: TrMap = new Map();
  for (const r of rows) {
    let entity = map.get(r.entityId);
    if (!entity) {
      entity = {};
      map.set(r.entityId, entity);
    }
    if (!entity[r.lang]) entity[r.lang] = {};
    entity[r.lang][r.field] = r.value;
  }
  return map;
}

export function trVal(trMap: TrMap, id: number, field: string, lang = "ar"): string {
  return trMap.get(id)?.[lang]?.[field] ?? "";
}

type TrInput = { ar?: Record<string, unknown>; en?: Record<string, unknown> };
type TrJsonFields = string[];

export async function upsertTranslations(
  entityType: string,
  entityId: number,
  tr: TrInput | undefined,
  jsonFields: TrJsonFields = [],
): Promise<void> {
  if (!tr) return;
  const rows: InsertTranslation[] = [];
  for (const lang of ["ar", "en"] as const) {
    const fields = tr[lang];
    if (!fields) continue;
    for (const [field, raw] of Object.entries(fields)) {
      if (raw === undefined || raw === null) continue;
      let value = raw as string;
      if (typeof raw === "object") value = JSON.stringify(raw);
      else if (typeof raw !== "string") value = String(raw);
      else if (jsonFields.includes(field)) {
        try { JSON.parse(raw); value = raw; } catch { value = JSON.stringify(raw); }
      }
      rows.push({ entityType, entityId, lang, field, value });
    }
  }
  if (rows.length) {
    await getDb()
      .insert(translations)
      .values(rows)
      .onDuplicateKeyUpdate({ set: { value: sql`VALUES(value)` } });
  }
}

export async function deleteTranslations(entityType: string, entityId: number): Promise<void> {
  await getDb()
    .delete(translations)
    .where(and(eq(translations.entityType, entityType), eq(translations.entityId, entityId)));
}
