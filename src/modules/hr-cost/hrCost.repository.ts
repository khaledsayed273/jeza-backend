import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { hrCostSections, hrCostItems } from "../../../drizzle/schema";

export async function getHrCostContent(): Promise<unknown> {
  const sections = await getDb().select().from(hrCostSections).orderBy(asc(hrCostSections.sortOrder));
  const items = await getDb().select().from(hrCostItems).orderBy(asc(hrCostItems.sortOrder));
  return {
    sections: sections.map((s) => ({
      key: s.key,
      title: s.title,
      items: items
        .filter((it) => it.sectionId === s.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((it) => ({ id: it.itemId, label: it.label })),
    })),
  };
}
