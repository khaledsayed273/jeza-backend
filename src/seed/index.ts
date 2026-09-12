import "dotenv/config";
import { getDb } from "../db";
import { seedContent } from "./content.seed";
import { seedHcIndicators } from "./hcIndicators.seed";
import { seedJobDescriptions } from "./jobDescriptions.seed";
import { seedMinisterial } from "./ministerial.seed";
import { seedQuiz } from "./quiz.seed";
import { seedProfessionsActivities } from "./professionsActivities.seed";
import { seedSiteConfig } from "./siteConfig.seed";
import { seedCalculator } from "./calculator.seed";
import { seedTrainingTurnover } from "./trainingTurnover.seed";
import { seedHrEmployee } from "./hrEmployee.seed";
import { seedSite } from "./site.seed";
import { seedAdminUser } from "./adminUser.seed";

async function main() {
  const db = getDb();
  console.log("🌱 Starting seed...\n");

  await seedAdminUser(db);
  await seedContent(db);
  await seedHcIndicators(db);
  await seedJobDescriptions(db);
  await seedMinisterial(db);
  await seedQuiz(db);
  await seedProfessionsActivities(db);
  await seedSiteConfig(db);
  await seedCalculator(db);
  await seedTrainingTurnover(db);
  await seedHrEmployee(db);
  await seedSite(db);

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
