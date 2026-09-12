import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { updateSources } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getUpdatesData() {
  const db = getDb();
  const rows = await db.select().from(updateSources).orderBy(asc(updateSources.sortOrder));
  const tr = await fetchTranslations("update_source");
  return { rows, tr };
}
