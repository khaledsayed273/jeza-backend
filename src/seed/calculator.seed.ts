import type { MySql2Database } from "drizzle-orm/mysql2";
import {
  gosiRateYears,
  gosiRateMeta,
  terminationOptions,
  terminationGroupLabels,
  terminationNoEntitlement,
  nationalityRulesNationalities,
  nationalityRulesSizeThresholds,
} from "../../drizzle/schema";

// ─────────────────────────────────────────────────────────────────────
// Data copied from:
//   - EmployeeCostPage.tsx, PayrollPage.tsx (GOSI Rates)
//   - EndOfServicePage.tsx (Termination Rules)
//   - NationalityRatioPage.tsx (Nationality Rules)
// ─────────────────────────────────────────────────────────────────────

const GOSI_RATES = {
  rates: {
    2024: { employee: 9, employer: 9, saned: 0.75 },
    2025: { employee: 9.5, employer: 9.5, saned: 0.75 },
    2026: { employee: 10, employer: 10, saned: 0.75 },
    2027: { employee: 10.5, employer: 10.5, saned: 0.75 },
    2028: { employee: 11, employer: 11, saned: 0.75 },
  },
  nonSaudi: {
    employee: 0,
    employer: 2,
    saned: 0,
  },
  employeeSaudi: 10,
  sanedEmployee: 1,
  ihtarMihaniRate: 2,
};

const TERMINATION_RULES = {
  terminationOptions: [
    { value: "art53_probation", labelAr: "انتهاء فترة التجربة", labelEn: "End of probation period", group: "art53" },
    { value: "art74_mutual", labelAr: "الإنهاء بالتراضي", labelEn: "Mutual termination", group: "art74" },
    { value: "art74_nonrenewal", labelAr: "عدم تجديد العقد", labelEn: "Non-renewal of contract", group: "art74" },
    { value: "art74_resign_fixed", labelAr: "الاستقالة لعقد محدد المدة", labelEn: "Resignation (fixed-term contract)", group: "art74" },
    { value: "art74_unilateral_unlimited", labelAr: "الإنهاء بالإرادة المنفردة لعقد غير محدد المدة", labelEn: "Unilateral termination (unlimited contract)", group: "art74" },
    { value: "art74_retirement", labelAr: "بلوغ العامل سن التقاعد", labelEn: "Worker reaching retirement age", group: "art74" },
    { value: "art74_closure_full", labelAr: "إغلاق المنشأة", labelEn: "Establishment closure", group: "art74" },
    { value: "art74_closure_activity", labelAr: "إغلاق النشاط", labelEn: "Activity closure", group: "art74" },
    { value: "art74_saudization", labelAr: "إنهاء العقد لعامل غير سعودي بسبب التوطين", labelEn: "Termination due to Saudization", group: "art74" },
    { value: "art74_resign_general", labelAr: "استقالة عامة", labelEn: "General resignation", group: "art74" },
    { value: "art75_unilateral", labelAr: "الإرادة المنفردة لأحد الطرفين لعقد غير محدد المدة", labelEn: "Unilateral will (unlimited contract)", group: "art75" },
    { value: "art77_unlawful", labelAr: "الإنهاء غير المشروع", labelEn: "Unlawful termination", group: "art77" },
    { value: "art79_death_incapacity", labelAr: "وفاة أو عجز أحد أطراف العقد", labelEn: "Death or incapacity of a contract party", group: "art79" },
    { value: "art79bis_resign_fixed", labelAr: "استقالة لعقد محدد المدة (خدمة أقل من سنتين)", labelEn: "Resignation – fixed-term (service < 2 years)", group: "art79bis" },
    { value: "art79bis_resign_marriage", labelAr: "استقالة بسبب الزواج", labelEn: "Resignation due to marriage", group: "art79bis" },
    { value: "art79bis_resign_childbirth", labelAr: "استقالة بسبب الوضع (الأمومة)", labelEn: "Resignation due to childbirth (maternity)", group: "art79bis" },
    { value: "art80_dismissal", labelAr: "الفصل التأديبي (المادة 80)", labelEn: "Disciplinary dismissal (Art. 80)", group: "art80" },
    { value: "art81_worker_right", labelAr: "ترك العمل بحق (المادة 81)", labelEn: "Worker's right to leave (Art. 81)", group: "art81" },
    { value: "art82_sick_leave_exhausted", labelAr: "استنفاذ أيام الإجازة المرضية (المادة 82)", labelEn: "Sick leave days exhausted (Art. 82)", group: "art82" },
    { value: "art57_specific_work", labelAr: "انتهاء العقد لعمل معين", labelEn: "Contract end for specific work", group: "art57" },
    { value: "art137_work_injury", labelAr: "إصابة العمل (المادة 137)", labelEn: "Work injury (Art. 137)", group: "art137" },
  ],
  groupLabels: {
    art53: { ar: "المادة 53 — فترة التجربة", en: "Article 53 — Probation Period" },
    art74: { ar: "المادة 74 — حالات الإنهاء المتعددة", en: "Article 74 — Multiple Termination Cases" },
    art75: { ar: "المادة 75 — الإرادة المنفردة", en: "Article 75 — Unilateral Will" },
    art77: { ar: "المادة 77 — الإنهاء غير المشروع", en: "Article 77 — Unlawful Termination" },
    art79: { ar: "المادة 79 — الوفاة أو العجز", en: "Article 79 — Death or Incapacity" },
    art79bis: { ar: "المادة 79 مكرر — استقالة عقد محدد المدة", en: "Article 79 bis — Fixed-term Resignation" },
    art80: { ar: "المادة 80 — الفصل التأديبي", en: "Article 80 — Disciplinary Dismissal" },
    art81: { ar: "المادة 81 — ترك العمل بحق", en: "Article 81 — Worker's Right to Leave" },
    art82: { ar: "المادة 82 — استنفاذ الإجازة المرضية", en: "Article 82 — Sick Leave Exhausted" },
    art57: { ar: "المادة 57 — انتهاء العقد لعمل معين", en: "Article 57 — Specific Work Contract" },
    art137: { ar: "المادة 137 — إصابة العمل", en: "Article 137 — Work Injury" },
  },
  noEntitlementReasons: ["art53_probation", "art80_dismissal", "art79bis_resign_fixed"],
};

const NATIONALITY_RULES = {
  nationalities: [
    { id: "bangladeshi", labelAr: "الجنسية البنقالية", labelEn: "Bangladeshi", maxRatio: 40, isRestricted: true, color: "oklch(0.55 0.18 145)", flag: "\uD83C\uDDE7\uD83C\uDDE9" },
    { id: "indian", labelAr: "الجنسية الهندية", labelEn: "Indian", maxRatio: 40, isRestricted: true, color: "oklch(0.55 0.22 55)", flag: "\uD83C\uDDEE\uD83C\uDDF3" },
    { id: "yemeni", labelAr: "الجنسية اليمنية", labelEn: "Yemeni", maxRatio: 25, isRestricted: true, color: "oklch(0.55 0.20 25)", flag: "\uD83C\uDDFE\uD83C\uDDEA" },
    { id: "ethiopian", labelAr: "الجنسية الإثيوبية", labelEn: "Ethiopian", maxRatio: 1, isRestricted: true, color: "oklch(0.55 0.18 170)", flag: "\uD83C\uDDEA\uD83C\uDDF9" },
    { id: "other", labelAr: "جنسية أخرى (غير مقيدة)", labelEn: "Other (Non-restricted)", maxRatio: null, isRestricted: false, color: "oklch(0.55 0.22 290)", flag: "\uD83C\uDF0D" },
  ],
  sizeThresholds: {
    small: { maxWorkers: 19, nonRestrictedMax: null },
    medium: { maxWorkers: 49, nonRestrictedMax: 70 },
    large: { maxWorkers: null, nonRestrictedMax: 40 },
  },
};

// ─────────────────────────────────────────────────────────────────────

export async function seedCalculator(db: MySql2Database<any>) {
  console.log("  → Seeding normalized calculator tables...");

  // gosi rates
  await db.delete(gosiRateMeta);
  await db.delete(gosiRateYears);
  await db.insert(gosiRateYears).values(
    Object.entries(GOSI_RATES.rates).map(([year, v]) => ({
      year,
      employee: String(v.employee),
      employer: String(v.employer),
      saned: String(v.saned),
    })),
  );
  await db.insert(gosiRateMeta).values([
    { key: "nonSaudi_employee", value: String(GOSI_RATES.nonSaudi.employee) },
    { key: "nonSaudi_employer", value: String(GOSI_RATES.nonSaudi.employer) },
    { key: "nonSaudi_saned", value: String(GOSI_RATES.nonSaudi.saned) },
    { key: "employeeSaudi", value: String(GOSI_RATES.employeeSaudi) },
    { key: "sanedEmployee", value: String(GOSI_RATES.sanedEmployee) },
    { key: "ihtarMihaniRate", value: String(GOSI_RATES.ihtarMihaniRate) },
  ]);

  // termination rules
  await db.delete(terminationNoEntitlement);
  await db.delete(terminationGroupLabels);
  await db.delete(terminationOptions);
  await db.insert(terminationOptions).values(
    TERMINATION_RULES.terminationOptions.map((o, i) => ({ value: o.value, labelAr: o.labelAr, labelEn: o.labelEn, group: o.group, sortOrder: i })),
  );
  await db.insert(terminationGroupLabels).values(
    Object.entries(TERMINATION_RULES.groupLabels).map(([group, v]) => ({ group, ar: v.ar, en: v.en })),
  );
  await db.insert(terminationNoEntitlement).values(
    TERMINATION_RULES.noEntitlementReasons.map((r) => ({ reason: r })),
  );

  // nationality rules
  await db.delete(nationalityRulesSizeThresholds);
  await db.delete(nationalityRulesNationalities);
  await db.insert(nationalityRulesNationalities).values(
    NATIONALITY_RULES.nationalities.map((n, i) => ({
      id: n.id,
      labelAr: n.labelAr,
      labelEn: n.labelEn,
      maxRatio: n.maxRatio,
      isRestricted: n.isRestricted,
      color: n.color,
      flag: n.flag,
      sortOrder: i,
    })),
  );
  await db.insert(nationalityRulesSizeThresholds).values(
    Object.entries(NATIONALITY_RULES.sizeThresholds).map(([tier, v]) => ({
      tier,
      maxWorkers: v.maxWorkers,
      nonRestrictedMax: v.nonRestrictedMax,
    })),
  );

  console.log("    ✓ gosiRates / terminationRules / nationalityRules");
}
