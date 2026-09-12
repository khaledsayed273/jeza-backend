import { trVal } from "../../shared/translations";
import { getUpdatesData } from "./updates.repository";

export async function getUpdates() {
  const { rows, tr } = await getUpdatesData();
  const sources = rows.map(r => ({
    id: r.code,
    titleAr: trVal(tr, r.id, "name", "ar"),
    titleEn: trVal(tr, r.id, "name", "en"),
    descAr: trVal(tr, r.id, "description", "ar"),
    descEn: trVal(tr, r.id, "description", "en"),
    url: r.url,
    type: r.type,
    color: r.color,
  }));
  return { sources };
}
