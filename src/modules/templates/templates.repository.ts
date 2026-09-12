import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { templateCategories, hrForms } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getTemplatesData() {
  const db = getDb();
  const [dbCats, dbForms] = await Promise.all([
    db.select().from(templateCategories).orderBy(asc(templateCategories.sortOrder)),
    db.select().from(hrForms).orderBy(asc(hrForms.sortOrder)),
  ]);
  const [catTr, formTr] = await Promise.all([
    fetchTranslations("template_category"),
    fetchTranslations("hr_form"),
  ]);
  return { dbCats, dbForms, catTr, formTr };
}
