import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { hrCategories, hrSources, hrImages } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getHrExplainersData() {
  const db = getDb();
  const [dbCategories, dbSources, dbImages] = await Promise.all([
    db.select().from(hrCategories).orderBy(asc(hrCategories.sortOrder)),
    db.select().from(hrSources).orderBy(asc(hrSources.sortOrder)),
    db.select().from(hrImages).orderBy(asc(hrImages.sortOrder)),
  ]);
  const [catTr, srcTr, imgTr] = await Promise.all([
    fetchTranslations("hr_category"),
    fetchTranslations("hr_source"),
    fetchTranslations("hr_image"),
  ]);
  return { dbCategories, dbSources, dbImages, catTr, srcTr, imgTr };
}
