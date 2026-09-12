import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { hcKpiCategories, hcBuiltinIndicators } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getHcIndicatorsData() {
  const db = getDb();
  const [dbCats, dbIndicators] = await Promise.all([
    db.select().from(hcKpiCategories).orderBy(asc(hcKpiCategories.sortOrder)),
    db.select().from(hcBuiltinIndicators).orderBy(asc(hcBuiltinIndicators.sortOrder)),
  ]);
  const [catTr, indTr] = await Promise.all([
    fetchTranslations("hc_kpi_category"),
    fetchTranslations("hc_builtin_indicator"),
  ]);
  return { dbCats, dbIndicators, catTr, indTr };
}
