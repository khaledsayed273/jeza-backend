import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { policyCategories, policies } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getPoliciesData() {
  const db = getDb();
  const [dbCats, dbPolicies] = await Promise.all([
    db.select().from(policyCategories).orderBy(asc(policyCategories.sortOrder)),
    db.select().from(policies).orderBy(asc(policies.chapterNum)),
  ]);
  const [catTr, polTr] = await Promise.all([
    fetchTranslations("policy_category"),
    fetchTranslations("policy"),
  ]);
  return { dbCats, dbPolicies, catTr, polTr };
}
