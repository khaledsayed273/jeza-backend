import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { sectorBenchmarks, jobBenchmarks } from "../../../drizzle/schema";

export type TurnoverContent = {
  sectorBenchmarks: unknown;
  jobBenchmarks: unknown;
};

export async function getTurnoverContent(): Promise<TurnoverContent> {
  const sectors = await getDb().select().from(sectorBenchmarks).orderBy(asc(sectorBenchmarks.sortOrder));
  const jobs = await getDb().select().from(jobBenchmarks).orderBy(asc(jobBenchmarks.sortOrder));

  const sectorMap: Record<string, unknown> = {};
  for (const s of sectors) {
    const { id, sortOrder, sectorId, ...rest } = s;
    sectorMap[sectorId] = rest;
  }
  const jobMap: Record<string, unknown> = {};
  for (const j of jobs) {
    const { id, sortOrder, jobId, ...rest } = j;
    jobMap[jobId] = rest;
  }

  return { sectorBenchmarks: sectorMap, jobBenchmarks: jobMap };
}
