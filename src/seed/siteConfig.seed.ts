import type { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { siteConfig } from "../../drizzle/schema";

const configEntries = [
  {
    key: "logo_url",
    value: "https://d2xsxph8kpxj0f.cloudfront.net/310519663364198732/2vuJLs9j7vTiL4E4emfRJ8/muwakaba_logo_v2-SCNMsUQ2s4hs6UtaXq88Y7.webp",
  },
  {
    key: "whatsapp_number",
    value: "966558648275",
  },
  {
    key: "whatsapp_message",
    value: "السلام عليكم، أودّ الاستفسار عن خدمات التوطين والموارد البشرية.",
  },
  {
    key: "support_email",
    value: "support@muwakaba.sa",
  },
  {
    key: "contact_email",
    value: "jzaalbqmy183@gmail.com",
  },
  {
    key: "phone_number",
    value: "0558648275",
  },
];

export async function seedSiteConfig(db: MySql2Database<any>) {
  console.log("  ⚙️  Seeding site_config...");
  for (const entry of configEntries) {
    const existing = await db.select().from(siteConfig).where(eq(siteConfig.key, entry.key)).limit(1);
    if (existing.length === 0) {
      await db.insert(siteConfig).values(entry);
    }
  }
  console.log(`  ✅ site_config seeded (${configEntries.length} entries)`);
}
