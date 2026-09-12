import { trVal } from "../../shared/translations";
import { getHrExplainersData } from "./hrExplainers.repository";

export async function getHrExplainers() {
  const { dbCategories, dbSources, dbImages, catTr, srcTr, imgTr } = await getHrExplainersData();

  const categories = dbCategories.map(c => ({
    id: c.code,
    labelAr: trVal(catTr, c.id, "name", "ar"),
    labelEn: trVal(catTr, c.id, "name", "en"),
    color: c.color,
    icon: c.icon,
  }));

  const sources = dbSources.map(s => ({
    id: s.code,
    titleAr: trVal(srcTr, s.id, "name", "ar"),
    category: dbCategories.find(c => c.id === s.categoryId)?.code ?? "",
    url: s.url,
    color: s.color,
  }));

  const images = dbImages.map(i => ({
    id: i.code,
    titleAr: trVal(imgTr, i.id, "name", "ar"),
    url: i.url,
  }));

  return { sources, categories, images };
}
