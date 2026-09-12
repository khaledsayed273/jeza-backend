import "dotenv/config";
import { inArray } from "drizzle-orm";
import { ministerialSectors, ministerialProfessions, ministerialPhases, translations } from "../../drizzle/schema";
import { ministerialSectors as sectorData } from "./ministerialData";

async function tr(db: any, entityType: string, entityId: number, lang: string, field: string, value: string) {
  await db.insert(translations).values({ entityType, entityId, lang, field, value });
}

export async function seedMinisterial(db: any) {
  console.log("🏛️  Seeding ministerial data...");

  // idempotent: clear owned rows before re-inserting
  await db.delete(translations).where(
    inArray(translations.entityType, ["ministerial_sector", "ministerial_profession", "ministerial_phase"]),
  );
  await db.delete(ministerialProfessions);
  await db.delete(ministerialPhases);
  await db.delete(ministerialSectors);

  for (let i = 0; i < sectorData.length; i++) {
    const s = sectorData[i];
    const [result] = await db.insert(ministerialSectors).values({
      code: s.id,
      decisionNumber: s.decisionNumber,
      decisionDate: s.decisionDate,
      saudizationPercentage: String(s.saudizationPercentage),
      minWage: String(s.minWage),
      minEmployees: s.minEmployees,
      excludedProfessions: s.excludedProfessions,
      sortOrder: i,
    });
    const sectorId = Number(result.insertId);
    await tr(db, "ministerial_sector", sectorId, "ar", "name", s.name);

    for (let j = 0; j < s.professions.length; j++) {
      const p = s.professions[j];
      const [pResult] = await db.insert(ministerialProfessions).values({
        sectorId,
        code: p.code,
        minWage: p.minWage ? String(p.minWage) : null,
        sortOrder: j,
      });
      const profId = Number(pResult.insertId);
      await tr(db, "ministerial_profession", profId, "ar", "name", p.name);
    }

    for (let k = 0; k < s.implementationPhases.length; k++) {
      const ph = s.implementationPhases[k];
      const [phResult] = await db.insert(ministerialPhases).values({
        sectorId,
        percentage: ph.percentage ? String(ph.percentage) : null,
        date: ph.date ?? null,
        sortOrder: k,
      });
      const phaseId = Number(phResult.insertId);
      await tr(db, "ministerial_phase", phaseId, "ar", "description", ph.description);
    }
  }

  const totalProfs = sectorData.reduce((sum, s) => sum + s.professions.length, 0);
  const totalPhases = sectorData.reduce((sum, s) => sum + s.implementationPhases.length, 0);
  console.log(`   ✓ Ministerial data seeded (${sectorData.length} sectors, ${totalProfs} professions, ${totalPhases} phases)`);
}
