import { getDb } from "../../db";
import { siteConfig } from "../../../drizzle/schema";

export type SiteConfig = Record<string, string>;

export async function getSiteConfig(): Promise<SiteConfig> {
  const rows = await getDb().select().from(siteConfig);
  const config: Record<string, string> = {};
  for (const r of rows) {
    config[r.key] = r.value;
  }
  return config;
}

export async function upsertSiteConfig(key: string, value: string) {
  await getDb()
    .insert(siteConfig)
    .values({ key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}
