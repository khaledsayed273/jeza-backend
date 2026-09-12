import { trVal } from "../../shared/translations";
import { getTemplatesData } from "./templates.repository";

export async function getTemplates() {
  const { dbCats, dbForms, catTr, formTr } = await getTemplatesData();

  const categories = dbCats.map(c => trVal(catTr, c.id, "name", "ar"));
  const categoryIcons: Record<string, string> = {};
  for (const c of dbCats) {
    categoryIcons[trVal(catTr, c.id, "name", "ar")] = c.icon;
  }

  const forms = dbForms.map(f => ({
    code: f.code,
    ar: trVal(formTr, f.id, "name", "ar"),
    en: trVal(formTr, f.id, "name", "en"),
    category: (() => {
      const cat = dbCats.find(c => c.id === f.categoryId);
      return cat ? trVal(catTr, cat.id, "name", "ar") : "";
    })(),
    file: f.fileUrl,
    ext: f.ext,
  }));

  return { forms, categories, categoryIcons };
}
