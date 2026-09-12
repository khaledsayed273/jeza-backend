import type { MySql2Database } from "drizzle-orm/mysql2";
import {
  trainingDecisions,
  trainingSectors,
  disclosurePoints,
  sectorBenchmarks,
  jobBenchmarks,
} from "../../drizzle/schema";

// ─────────────────────────────────────────────────────────────────────
// Data copied from:
//   - TrainingPage.tsx (trainingDecisions, trainingSectors, disclosurePoints)
//   - TurnoverRatePage.tsx (sectorBenchmarks, jobBenchmarks)
// ─────────────────────────────────────────────────────────────────────

const TRAINING_DECISIONS = [
  {
    num: "1",
    ar: "يتم تدريب الطلاب السعوديين في المنشآت بهدف تأهيلهم إلى سوق العمل وتطوير مهاراتهم.",
    en: "Saudi students are trained in establishments to qualify them for the labor market and develop their skills.",
  },
  {
    num: "2",
    ar: "يجب على المنشأة التي تضم 50 عاملاً وأكثر تأهيل وتدريب الطلاب من المنشآت الدراسية حسب الخطط المعتمدة من المؤسسات التعليمية، وذلك بنسبة 2% من إجمالي عدد العمال.",
    en: "Establishments with 50 or more workers must train students from educational institutions at a rate of 2% of total workforce.",
  },
  {
    num: "3",
    ar: "يكون عقد التدريب التعاوني مكتوباً ومحدد المدة ويشمل المهارة والمهنة التي يتدرب عليها المتدرب ومدة التدريب ومراحله المتتابعة.",
    en: "The cooperative training contract must be written, time-bound, and include the skill, profession, duration, and sequential stages of training.",
  },
  {
    num: "4",
    ar: "أي منشأة لا تلتزم بقرار التدريب التعاوني تطبق بحقها العقوبات المقررة نظاماً.",
    en: "Any establishment that does not comply with the cooperative training decision will be subject to legally prescribed penalties.",
  },
  {
    num: "5",
    ar: "يستحق المتدرب شهادة خبرة عن الفترة التي قضاها في التدريب تشمل المهنة والمهارة.",
    en: "The trainee is entitled to an experience certificate covering the profession and skill upon completion.",
  },
];

const TRAINING_SECTORS = [
  { ar: "التجزئة والمبيعات", en: "Retail & Sales" },
  { ar: "الصناعة والتصنيع", en: "Industry & Manufacturing" },
  { ar: "الخدمات المالية والمحاسبة", en: "Financial & Accounting Services" },
  { ar: "تقنية المعلومات", en: "Information Technology" },
  { ar: "الرعاية الصحية", en: "Healthcare" },
  { ar: "التعليم والتدريب", en: "Education & Training" },
  { ar: "الضيافة والسياحة", en: "Hospitality & Tourism" },
  { ar: "الإنشاء والمقاولات", en: "Construction & Contracting" },
  { ar: "الخدمات اللوجستية", en: "Logistics & Supply Chain" },
  { ar: "أخرى", en: "Other" },
];

const DISCLOSURE_POINTS = [
  {
    num: "1",
    titleAr: "من يلتزم بالإفصاح؟",
    titleEn: "Who must disclose?",
    textAr: "كل منشأة تملك 50 عاملاً وأكثر يجب عليها الإفصاح عن بيانات التدريب للعمال السعوديين وغير السعوديين عبر منصة قوى.",
    textEn: "Every establishment with 50 or more workers must disclose training data for Saudi and non-Saudi workers via the Qiwa platform.",
  },
  {
    num: "2",
    titleAr: "ماذا يشمل الإفصاح؟",
    titleEn: "What does disclosure include?",
    textAr: "عدد المتدربين الكلي، متوسط ساعات التدريب للعامل، ميزانية التدريب السنوية، نسبة الميزانية من أجور العاملين، أنواع وأنشطة التدريب المنفذة، وخطط التدريب للعام القادم.",
    textEn: "Total number of trainees, average training hours per worker, annual training budget, budget percentage of wages, types of training activities, and next year's training plans.",
  },
  {
    num: "3",
    titleAr: "متى يكون التوثيق؟",
    titleEn: "When is documentation required?",
    textAr: "من شهر سبتمبر إلى نهاية العام من كل سنة. تكون ورش التدريب والدورات والمحاضرات والندوات بما لا يقل عن ساعتين تدريبيتين لكل وحدة، ومحاضرات التدريب الإلكتروني بما لا يقل عن أربع ساعات.",
    textEn: "From September to the end of each year. Training workshops, courses, lectures, and seminars must be at least 2 training hours per unit, and e-learning lectures at least 4 hours.",
  },
  {
    num: "4",
    titleAr: "عقوبات عدم الالتزام",
    titleEn: "Non-compliance penalties",
    textAr: "المنشآت من 50 إلى 499 موظف: 5,000 ريال للمرة الأولى و10,000 ريال عند التكرار. من 500 إلى 2,999 موظف: 10,000 ريال للمرة الأولى و20,000 ريال عند التكرار. أكثر من 3,000 موظف: 15,000 ريال للمرة الأولى و30,000 ريال عند التكرار.",
    textEn: "50-499 employees: SAR 5,000 first time, SAR 10,000 repeat. 500-2,999 employees: SAR 10,000 first time, SAR 20,000 repeat. 3,000+ employees: SAR 15,000 first time, SAR 30,000 repeat.",
  },
];

const SECTOR_BENCHMARKS = {
  retail:       { ar: "التجزئة والمبيعات",       en: "Retail & Sales",         annual: 60,  desc: "قطاع ذو معدل دوران مرتفع طبيعياً بسبب العمالة الموسمية والعقود المؤقتة" },
  hospitality:  { ar: "الضيافة والفنادق",         en: "Hospitality & Hotels",   annual: 73,  desc: "من أعلى القطاعات دوراناً نظراً لطبيعة العمل المتقطعة وضغط الورديات" },
  healthcare:   { ar: "الرعاية الصحية",           en: "Healthcare",             annual: 22,  desc: "معدل متوسط مع ارتفاع ملحوظ في التمريض والوظائف الميدانية" },
  tech:         { ar: "التقنية والمعلومات",       en: "Technology & IT",        annual: 13,  desc: "معدل منخفض نسبياً لكن التنافس على الكفاءات يرفعه في بعض التخصصات" },
  finance:      { ar: "المال والمصارف",           en: "Finance & Banking",      annual: 18,  desc: "معدل معتدل مع ارتفاع في الوظائف الأمامية (front office)" },
  manufacturing:{ ar: "التصنيع والإنتاج",        en: "Manufacturing",          annual: 30,  desc: "يتأثر بظروف العمل وساعات الورديات ومستوى الأتمتة" },
  construction: { ar: "المقاولات والبناء",        en: "Construction",           annual: 21,  desc: "يرتفع في مراحل انتهاء المشاريع ويتأثر بالعمالة الموسمية" },
  education:    { ar: "التعليم والتدريب",         en: "Education & Training",   annual: 16,  desc: "مستقر نسبياً مع ارتفاع في المدارس الخاصة والمراكز التدريبية" },
  logistics:    { ar: "اللوجستيات والنقل",        en: "Logistics & Transport",  annual: 35,  desc: "ضغط العمل الميداني وساعات الوردية الطويلة يرفعان المعدل" },
  government:   { ar: "الحكومي والشبه حكومي",    en: "Government & Semi-Gov",  annual: 8,   desc: "من أقل القطاعات دوراناً بسبب الاستقرار الوظيفي والمزايا" },
  energy:       { ar: "الطاقة والبترول",          en: "Energy & Petroleum",     annual: 10,  desc: "استقرار عالٍ مدعوم بالرواتب التنافسية والمزايا الشاملة" },
  telecom:      { ar: "الاتصالات",               en: "Telecommunications",     annual: 15,  desc: "معدل منخفض نسبياً مع تحديات في الاحتفاظ بالكفاءات التقنية" },
  media:        { ar: "الإعلام والتسويق",         en: "Media & Marketing",      annual: 25,  desc: "يتأثر بطبيعة المشاريع والعقود المؤقتة والإبداعية" },
  realestate:   { ar: "العقارات",                en: "Real Estate",            annual: 27,  desc: "يرتفع في فرق المبيعات ويستقر في الإدارة والتشغيل" },
  other:        { ar: "قطاع آخر",               en: "Other",                  annual: 20,  desc: "المتوسط العام لمعظم القطاعات" },
};

const JOB_BENCHMARKS = {
  sales:        { ar: "المبيعات",                en: "Sales",                  annual: 35 },
  customer_svc: { ar: "خدمة العملاء",            en: "Customer Service",       annual: 45 },
  hr:           { ar: "الموارد البشرية",          en: "Human Resources",        annual: 14 },
  finance_acc:  { ar: "المالية والمحاسبة",        en: "Finance & Accounting",   annual: 12 },
  it_dev:       { ar: "تقنية المعلومات والبرمجة", en: "IT & Development",       annual: 13 },
  operations:   { ar: "العمليات والتشغيل",        en: "Operations",             annual: 22 },
  admin:        { ar: "الإدارية والسكرتارية",     en: "Administrative",         annual: 18 },
  management:   { ar: "الإدارة العليا",           en: "Senior Management",      annual: 9  },
  marketing:    { ar: "التسويق",                 en: "Marketing",              annual: 20 },
  engineering:  { ar: "الهندسة",                en: "Engineering",            annual: 11 },
  nursing:      { ar: "التمريض والرعاية",         en: "Nursing & Care",         annual: 28 },
  security:     { ar: "الأمن والحراسة",           en: "Security & Guards",      annual: 40 },
  driver:       { ar: "السائقون والنقل",          en: "Drivers & Transport",    annual: 38 },
  other_job:    { ar: "وظيفة أخرى",             en: "Other",                  annual: 20 },
};

// ─────────────────────────────────────────────────────────────────────

export async function seedTrainingTurnover(db: MySql2Database<any>) {
  console.log("  → Seeding normalized training / turnover tables...");

  await db.delete(trainingDecisions);
  await db.insert(trainingDecisions).values(
    TRAINING_DECISIONS.map((d, i) => ({ num: d.num, ar: d.ar, en: d.en, sortOrder: i })),
  );

  await db.delete(trainingSectors);
  await db.insert(trainingSectors).values(
    TRAINING_SECTORS.map((s, i) => ({ ar: s.ar, en: s.en, sortOrder: i })),
  );

  await db.delete(disclosurePoints);
  await db.insert(disclosurePoints).values(
    DISCLOSURE_POINTS.map((p, i) => ({ num: p.num, titleAr: p.titleAr, titleEn: p.titleEn, textAr: p.textAr, textEn: p.textEn, sortOrder: i })),
  );

  await db.delete(sectorBenchmarks);
  await db.insert(sectorBenchmarks).values(
    Object.entries(SECTOR_BENCHMARKS).map(([sectorId, v], i) => ({
      sectorId,
      ar: v.ar,
      en: v.en,
      annual: String(v.annual),
      desc: v.desc,
      sortOrder: i,
    })),
  );

  await db.delete(jobBenchmarks);
  await db.insert(jobBenchmarks).values(
    Object.entries(JOB_BENCHMARKS).map(([jobId, v], i) => ({
      jobId,
      ar: v.ar,
      en: v.en,
      annual: String(v.annual),
      sortOrder: i,
    })),
  );

  console.log("    ✓ trainingDecisions / trainingSectors / disclosurePoints");
  console.log("    ✓ sectorBenchmarks / jobBenchmarks");
}
