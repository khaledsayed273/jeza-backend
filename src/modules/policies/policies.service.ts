import { trVal } from "../../shared/translations";
import { getPoliciesData } from "./policies.repository";

export async function getPolicies() {
  const { dbCats, dbPolicies, catTr, polTr } = await getPoliciesData();

  const categories = dbCats.map(c => trVal(catTr, c.id, "name", "ar"));
  const categoryColors: Record<string, string> = {};
  for (const c of dbCats) {
    categoryColors[trVal(catTr, c.id, "name", "ar")] = c.color;
  }

  const policyList = dbPolicies.map(p => {
    const catName = (() => {
      const cat = dbCats.find(c => c.id === p.categoryId);
      return cat ? trVal(catTr, cat.id, "name", "ar") : "";
    })();
    return {
      id: p.code,
      ar: trVal(polTr, p.id, "name", "ar"),
      en: trVal(polTr, p.id, "name", "en"),
      category: catName,
      chapterNum: p.chapterNum,
      objectives: p.objectives ? JSON.parse(p.objectives) : [],
      policies: p.policiesData ? JSON.parse(p.policiesData) : [],
      procedures: p.proceduresData ? JSON.parse(p.proceduresData) : [],
    };
  });

  const fileUrl = "/uploads/hr-policies-procedures-2024_1001ae28.docx";

  return { policies: policyList, categories, categoryColors, fileUrl };
}
