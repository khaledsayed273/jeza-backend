import { getSiteConfig, upsertSiteConfig, type SiteConfig } from "./config.repository";

export function getConfig(): Promise<SiteConfig> {
  return getSiteConfig();
}

export async function updateConfig(key: string, value: string): Promise<{ success: boolean }> {
  await upsertSiteConfig(key, value);
  return { success: true };
}
