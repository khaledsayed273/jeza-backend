import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { declarations } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getDeclarationsData() {
  const db = getDb();
  const rows = await db.select().from(declarations).orderBy(asc(declarations.sortOrder));
  const tr = await fetchTranslations("declaration");
  return { rows, tr };
}
