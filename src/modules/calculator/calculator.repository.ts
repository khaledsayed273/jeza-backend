import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import {
  professionCategories,
  professionCategoryJobs,
  professionCategoryPhases,
  activities2026,
  gosiRateYears,
  gosiRateMeta,
  terminationOptions,
  terminationGroupLabels,
  terminationNoEntitlement,
  nationalityRulesNationalities,
  nationalityRulesSizeThresholds,
} from "../../../drizzle/schema";

const num = (v: unknown) => (v === null || v === undefined ? v : Number(v));

export type CalculatorContent = {
  professionCategories: unknown;
  activities2026: unknown;
  gosiRates: unknown;
  terminationRules: unknown;
  nationalityRules: unknown;
};

export async function getCalculatorContent(): Promise<CalculatorContent> {
  const [cats, catJobs, catPhases, activities, gosiYears, gosiMeta, termOpts, termLabels, termNo, nations, sizeTh] = await Promise.all([
    getDb().select().from(professionCategories).orderBy(asc(professionCategories.sortOrder)),
    getDb().select().from(professionCategoryJobs).orderBy(asc(professionCategoryJobs.sortOrder)),
    getDb().select().from(professionCategoryPhases).orderBy(asc(professionCategoryPhases.sortOrder)),
    getDb().select().from(activities2026).orderBy(asc(activities2026.sortOrder)),
    getDb().select().from(gosiRateYears).orderBy(asc(gosiRateYears.year)),
    getDb().select().from(gosiRateMeta),
    getDb().select().from(terminationOptions).orderBy(asc(terminationOptions.sortOrder)),
    getDb().select().from(terminationGroupLabels),
    getDb().select().from(terminationNoEntitlement),
    getDb().select().from(nationalityRulesNationalities).orderBy(asc(nationalityRulesNationalities.sortOrder)),
    getDb().select().from(nationalityRulesSizeThresholds),
  ]);

  const professionCategoriesOut = cats.map((c) => {
    const { id, sortOrder, ...rest } = c;
    const jobs = catJobs.filter((j) => j.categoryId === id).map(({ id: jid, sortOrder: js, categoryId, ...jr }) => jr);
    const phases = catPhases.filter((p) => p.categoryId === id).map(({ id: pid, sortOrder: ps, categoryId, ...pr }) => pr);
    return { ...rest, id, jobs, ...(phases.length ? { phases } : {}) };
  });

  const activities2026Out = activities.map((a) => ({
    name: a.name,
    m: { low: num(a.mLow), mid: num(a.mMid), high: num(a.mHigh), plat: num(a.mPlat) },
    th: { low: num(a.thLow), mid: num(a.thMid), high: num(a.thHigh), plat: num(a.thPlat) },
  }));

  const rates: Record<string, unknown> = {};
  for (const y of gosiYears) rates[y.year] = { employee: num(y.employee), employer: num(y.employer), saned: num(y.saned) };
  const meta: Record<string, number> = {};
  for (const m of gosiMeta) meta[m.key] = num(m.value) as number;
  const gosiRatesOut = {
    rates,
    nonSaudi: { employee: meta["nonSaudi_employee"], employer: meta["nonSaudi_employer"], saned: meta["nonSaudi_saned"] },
    employeeSaudi: meta["employeeSaudi"],
    sanedEmployee: meta["sanedEmployee"],
    ihtarMihaniRate: meta["ihtarMihaniRate"],
  };

  const groupLabels: Record<string, unknown> = {};
  for (const l of termLabels) groupLabels[l.group] = { ar: l.ar, en: l.en };
  const terminationRulesOut = {
    terminationOptions: termOpts.map(({ id, sortOrder, ...r }) => r),
    groupLabels,
    noEntitlementReasons: termNo.map((n) => n.reason),
  };

  const sizeThresholds: Record<string, unknown> = {};
  for (const s of sizeTh) sizeThresholds[s.tier] = { maxWorkers: s.maxWorkers, nonRestrictedMax: s.nonRestrictedMax };
  const nationalityRulesOut = {
    nationalities: nations.map(({ id, sortOrder, ...r }) => ({ id, ...r })),
    sizeThresholds,
  };

  return {
    professionCategories: professionCategoriesOut,
    activities2026: activities2026Out,
    gosiRates: gosiRatesOut,
    terminationRules: terminationRulesOut,
    nationalityRules: nationalityRulesOut,
  };
}
