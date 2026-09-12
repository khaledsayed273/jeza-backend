import { trVal } from "../../shared/translations";
import { getHcIndicatorsData } from "./hcIndicators.repository";

export async function getHcIndicators() {
  const { dbCats, dbIndicators, catTr, indTr } = await getHcIndicatorsData();

  const categories = dbCats.map(c => ({
    key: c.code,
    ar: trVal(catTr, c.id, "name", "ar"),
    en: trVal(catTr, c.id, "name", "en"),
    color: c.color,
  }));

  const indicators = dbIndicators.map(ind => {
    const ar = indTr.get(ind.id)?.ar ?? {};
    const en = indTr.get(ind.id)?.en ?? {};
    const cat = dbCats.find(c => c.id === ind.categoryId);
    return {
      key: ind.key,
      nameAr: ar.name ?? "",
      nameEn: en.name ?? "",
      category: cat?.code ?? "",
      unit: ind.unit ?? "",
      higherIsBetter: (ind.higherIsBetter ?? 1) === 1,
      benchmarkAr: ar.benchmark ?? "",
      benchmarkEn: en.benchmark ?? "",
      descriptionAr: ar.description ?? "",
      descriptionEn: en.description ?? "",
      unitAr: ar.unit ?? ind.unit ?? "",
    };
  });

  return { categories, indicators };
}
