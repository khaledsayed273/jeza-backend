import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { departments, jobDescriptions } from "../../../drizzle/schema";
import { fetchTranslations } from "../../shared/translations";

export async function getJobDescriptionsData() {
  const db = getDb();
  const [dbDepts, dbJobs] = await Promise.all([
    db.select().from(departments).orderBy(asc(departments.sortOrder)),
    db.select().from(jobDescriptions).orderBy(asc(jobDescriptions.sortOrder)),
  ]);
  const [deptTr, jobTr] = await Promise.all([
    fetchTranslations("department"),
    fetchTranslations("job_description"),
  ]);
  return { dbDepts, dbJobs, deptTr, jobTr };
}
