import { trVal } from "../../shared/translations";
import { getDeclarationsData } from "./declarations.repository";

export async function getDeclarations() {
  const { rows, tr } = await getDeclarationsData();

  const declarationList = rows.map(r => ({
    id: r.id,
    title: trVal(tr, r.id, "title", "ar"),
    intro: trVal(tr, r.id, "intro", "ar"),
    items: r.items ? JSON.parse(r.items) : [],
  }));

  const fileUrl = rows[0]?.fileUrl ?? "";

  return { declarations: declarationList, fileUrl };
}
