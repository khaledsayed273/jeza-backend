import type { MySql2Database } from "drizzle-orm/mysql2";
import { inArray } from "drizzle-orm";
import { departments, jobDescriptions, translations } from "../../drizzle/schema";

async function tr(db: MySql2Database<any>, entityType: string, entityId: number, lang: string, field: string, value: string) {
  await db.insert(translations).values({ entityType, entityId, lang, field, value });
}

const DEPT_DATA = [
  { code: "finance", nameAr: "المالية", nameEn: "Finance", icon: "💰", color: "oklch(0.55 0.18 145)", descAr: "إدارة الشؤون المالية والمحاسبية" },
  { code: "sales", nameAr: "المبيعات", nameEn: "Sales", icon: "📈", color: "oklch(0.55 0.22 55)", descAr: "تطوير الأعمال وتحقيق الإيرادات" },
  { code: "procurement", nameAr: "المشتريات", nameEn: "Procurement", icon: "🛒", color: "oklch(0.55 0.18 200)", descAr: "إدارة سلسلة التوريد والمشتريات" },
  { code: "hr", nameAr: "الموارد البشرية", nameEn: "Human Resources", icon: "👥", color: "oklch(0.55 0.22 290)", descAr: "إدارة رأس المال البشري" },
  { code: "quality", nameAr: "الجودة", nameEn: "Quality", icon: "✅", color: "oklch(0.55 0.20 170)", descAr: "ضمان الجودة والتحسين المستمر" },
  { code: "executive", nameAr: "الإدارة التنفيذية", nameEn: "Executive Management", icon: "🏛️", color: "oklch(0.55 0.15 260)", descAr: "القيادة والتوجيه الاستراتيجي" },
  { code: "marketing", nameAr: "التسويق", nameEn: "Marketing", icon: "📣", color: "oklch(0.55 0.22 20)", descAr: "التسويق والعلامة التجارية" },
  { code: "legal", nameAr: "القانون", nameEn: "Legal", icon: "⚖️", color: "oklch(0.50 0.12 240)", descAr: "الشؤون القانونية والامتثال" },
  { code: "support", nameAr: "الخدمات المساندة", nameEn: "Support Services", icon: "🔧", color: "oklch(0.55 0.15 80)", descAr: "الخدمات الإدارية والمساندة" },
  { code: "operations", nameAr: "التشغيل والعمليات", nameEn: "Operations", icon: "⚙️", color: "oklch(0.50 0.18 30)", descAr: "إدارة العمليات والتشغيل" },
];

const LEVEL_MAP: Record<string, string> = {
  "تنفيذي": "executive",
  "إشرافي": "supervisory",
  "إداري": "administrative",
  "متخصص": "specialist",
  "فني": "technical",
};

// Compact job data: [id, titleAr, titleEn, deptCode, levelAr, summary, experience, education, responsibilities[], qualifications[], skills[]]
const JOB_DATA: Array<{
  id: string; titleAr: string; titleEn: string; dept: string; level: string;
  summary: string; responsibilities: string[]; qualifications: string[]; skills: string[];
  experience: string; education: string;
}> = [
  {
    id: "fin-001", titleAr: "مدير مالي", titleEn: "Chief Financial Officer (CFO)", dept: "finance", level: "executive",
    summary: "يتولى المدير المالي الإشراف الكامل على الاستراتيجية المالية للمنظمة وإدارة مواردها المالية بكفاءة عالية.",
    responsibilities: ["وضع الاستراتيجية المالية", "الإشراف على إعداد الميزانيات", "إدارة التدفقات النقدية", "الإشراف على التدقيق الداخلي والخارجي", "تقديم التقارير المالية لمجلس الإدارة"],
    qualifications: ["بكالوريوس في المحاسبة أو المالية", "ماجستير في إدارة الأعمال (يُفضَّل)", "شهادة CPA أو CFA", "خبرة 12+ سنة"],
    skills: ["التخطيط الاستراتيجي", "التحليل المالي", "إدارة المخاطر", "القيادة", "IFRS"],
    experience: "12+ سنة", education: "بكالوريوس محاسبة / مالية + ماجستير",
  },
  {
    id: "fin-002", titleAr: "مدير الحسابات", titleEn: "Accounting Manager", dept: "finance", level: "supervisory",
    summary: "يشرف مدير الحسابات على جميع العمليات المحاسبية اليومية ويضمن دقة السجلات المالية.",
    responsibilities: ["الإشراف على فريق المحاسبة", "مراجعة القيود المحاسبية", "إعداد القوائم المالية", "إدارة الإقفال الشهري"],
    qualifications: ["بكالوريوس محاسبة", "خبرة 7+ سنة", "IFRS"],
    skills: ["المحاسبة", "IFRS", "الإشراف", "تحليل البيانات"],
    experience: "7+ سنة", education: "بكالوريوس محاسبة",
  },
  {
    id: "fin-003", titleAr: "محاسب أول", titleEn: "Senior Accountant", dept: "finance", level: "specialist",
    summary: "يقوم بتنفيذ العمليات المحاسبية اليومية ومراجعة القيود وإعداد التقارير المالية.",
    responsibilities: ["تنفيذ القيود المحاسبية", "المتابعة اليومية", "إعداد تقارير التكاليف"],
    qualifications: ["بكالوريوس محاسبة", "خبرة 4+ سنة"],
    skills: ["المحاسبة", "Excel", "ERP"],
    experience: "4+ سنة", education: "بكالوريوس محاسبة",
  },
  {
    id: "fin-004", titleAr: "محاسب", titleEn: "Accountant", dept: "finance", level: "administrative",
    summary: "يقوم بتسجيل المعاملات المالية اليومية وتحصيل المستحقات.",
    responsibilities: ["تسجيل القيود", "تحصيل الذمم", "إعداد قوائم التدفق النقدي"],
    qualifications: ["بكالوريوس محاسبة", "خبرة سنتين+"],
    skills: ["المحاسبة الأساسية", "Excel"],
    experience: "2+ سنة", education: "بكالوريوس محاسبة",
  },
  {
    id: "fin-005", titleAr: "محلل مالي", titleEn: "Financial Analyst", dept: "finance", level: "specialist",
    summary: "يقوم بتحليل البيانات المالية وتقديم التوصيات الاستراتيجية.",
    responsibilities: ["تحليل الأداء المالي", "إعداد النماذج التقديرية", "تقييم الفرص الاستثمارية"],
    qualifications: ["بكالوريوس مالية/اقتصاد", "CFA (يُفضَّل)"],
    skills: ["التحليل المالي", "النمذجة", "Power BI", "Python"],
    experience: "3+ سنة", education: "بكالوريوس مالية",
  },
  {
    id: "hr-001", titleAr: "مدير الموارد البشرية", titleEn: "HR Director", dept: "hr", level: "executive",
    summary: "يقيادة استراتيجية الموارد البشرية وتطوير السياسات والإجراءات.",
    responsibilities: ["وضع استراتيجية الموارد البشرية", "إدارة التوظيف والاختيار", "تطوير السياسات", "إدارة الأداء"],
    qualifications: ["بكالوريوس إدارة أعمال/موارد بشرية", "SHRM أو ما يعادل", "خبرة 10+ سنة"],
    skills: ["الاستراتيجية", "التوظيف", "تطوير السياسات", "إدارة الأداء"],
    experience: "10+ سنة", education: "بكالوريوس إدارة أعمال + ماجستير",
  },
  {
    id: "hr-002", titleAr: "منسق موارد بشرية", titleEn: "HR Coordinator", dept: "hr", level: "administrative",
    summary: "يدعم العمليات اليومية لإدارة الموارد البشرية.",
    responsibilities: ["إدارة ملفات الموظفين", "تنسيق المقابلات", "إعداد التقارير"],
    qualifications: ["بكالوريوس", "خبرة سنة+"],
    skills: ["التنظيم", "沟通", "Excel"],
    experience: "1+ سنة", education: "بكالوريوس",
  },
  {
    id: "hr-003", titleAr: "أخصائي التوظيف", titleEn: "Recruitment Specialist", dept: "hr", level: "specialist",
    summary: "يشرف على عملية التوظيف من الإعلان حتى التعيين.",
    responsibilities: ["نشر الوظائف", "screening", "conducting interviews", " issuing offers"],
    qualifications: ["بكالوريوس", "خبرة 3+ سنة"],
    skills: ["التوظيف", "LinkedIn", "المقابلات"],
    experience: "3+ سنة", education: "بكالوريوس",
  },
  {
    id: "hr-004", titleAr: "أخصائي التدريب والتطوير", titleEn: "Training & Development Specialist", dept: "hr", level: "specialist",
    summary: "يصمم وينفذ برامج التدريب والتطوير.",
    responsibilities: ["تحديد الاحتياجات التدريبية", "تصميم البرامج", "تقييم الفعالية"],
    qualifications: ["بكالوريوس", "خبرة 3+ سنة", "CIPD يُفضَّل"],
    skills: ["تصميم البرامج", "التقييم", "التعليم"],
    experience: "3+ سنة", education: "بكالوريوس",
  },
  {
    id: "hr-005", titleAr: "أخصائي شؤون الموظفين", titleEn: "Employee Relations Specialist", dept: "hr", level: "administrative",
    summary: "يتعامل مع شؤون الموظفين اليومية والتظلمات.",
    responsibilities: ["إدارة شؤون الموظفين", "معالجة التظلمات", "متابعة الحضور والانصراف"],
    qualifications: ["بكالوريوس", "خبرة 2+ سنة"],
    skills: ["التواصل", "حل المشكلات", "نظام العمل"],
    experience: "2+ سنة", education: "بكالوريوس",
  },
  {
    id: "sal-001", titleAr: "مدير المبيعات", titleEn: "Sales Director", dept: "sales", level: "executive",
    summary: "يقيادة فريق المبيعات ويحقق أهداف الإيرادات.",
    responsibilities: ["وضع خطة المبيعات", "إدارة الفريق", "تطوير العملاء", "التنفيذ الاستراتيجي"],
    qualifications: ["بكالوريوس إدارة أعمال", "خبرة 8+ سنة"],
    skills: ["القيادة", "التفاوض", "CRM", "تحليل البيانات"],
    experience: "8+ سنة", education: "بكالوريوس إدارة أعمال",
  },
  {
    id: "sal-002", titleAr: "مندوب مبيعات أول", titleEn: "Senior Sales Representative", dept: "sales", level: "specialist",
    summary: "يحقق أهداف المبيعات المحددة ويفتح أسواقاً جديدة.",
    responsibilities: ["تحقيق أهداف المبيعات", "تطوير علاقات العملاء", "تقديم العروض"],
    qualifications: ["بكالوريوس", "خبرة 3+ سنة"],
    skills: ["المبيعات", "التواصل", "CRM"],
    experience: "3+ سنة", education: "بكالوريوس",
  },
  {
    id: "sal-003", titleAr: "مدير تطوير الأعمال", titleEn: "Business Development Manager", dept: "sales", level: "supervisory",
    summary: "يبحث عن فرص نمو جديدة ويطور شراكات استراتيجية.",
    responsibilities: ["تحديد فرص النمو", "بناء الشراكات", "تحليل السوق"],
    qualifications: ["بكالوريوس", "خبرة 5+ سنة"],
    skills: ["تطوير الأعمال", "التحليل", "التفاوض"],
    experience: "5+ سنة", education: "بكالوريوس",
  },
  {
    id: "pro-001", titleAr: "مدير المشتريات", titleEn: "Procurement Manager", dept: "procurement", level: "executive",
    summary: "يدير عمليات التوريد والمشتريات بكفاءة وفقاً للسياسات المعتمدة.",
    responsibilities: ["وضع سياسات المشتريات", "إدارة الموردين", "التفاوض على العقود"],
    qualifications: ["بكالوريوس إدارة أعمال", "خبرة 7+ سنة"],
    skills: ["المشتريات", "التفاوض", "إدارة الموردين"],
    experience: "7+ سنة", education: "بكالوريوس",
  },
  {
    id: "pro-002", titleAr: "أخصائي مشتريات", titleEn: "Procurement Specialist", dept: "procurement", level: "specialist",
    summary: "ينفذ عمليات الشراء ويراجع عروض الموردين.",
    responsibilities: ["إعداد طلبات الشراء", "مراجعة العروض", "متابعة التوريد"],
    qualifications: ["بكالوريوس", "خبرة 2+ سنة"],
    skills: ["المشتريات", "Excel", "التنظيم"],
    experience: "2+ سنة", education: "بكالوريوس",
  },
  {
    id: "qua-001", titleAr: "مدير الجودة", titleEn: "Quality Manager", dept: "quality", level: "executive",
    summary: "يضمن تطبيق معايير الجودة والتحسين المستمر.",
    responsibilities: ["وضع سياسات الجودة", "إدارة التدقيق الداخلي", "متابعة التحسين"],
    qualifications: ["بكالوريوس هندسة/جودة", "ISO Lead Auditor", "خبرة 7+ سنة"],
    skills: ["إدارة الجودة", "ISO", "Six Sigma", "التحليل"],
    experience: "7+ سنة", education: "بكالوريوس هندسة",
  },
  {
    id: "qua-002", titleAr: "أخصائي ضمان الجودة", titleEn: "Quality Assurance Specialist", dept: "quality", level: "specialist",
    summary: "يقوم بعمليات التدقيق ومراجعة الامتثال لمعايير الجودة.",
    responsibilities: ["conducting audits", "document review", "non-conformance tracking"],
    qualifications: ["بكالوريوس", "خبرة 3+ سنة"],
    skills: ["ISO", "التدقيق", "التقنية"],
    experience: "3+ سنة", education: "بكالوريوس",
  },
  {
    id: "exe-001", titleAr: "الرئيس التنفيذي", titleEn: "Chief Executive Officer (CEO)", dept: "executive", level: "executive",
    summary: "يقيادة المنظمة ويحقق رؤيتها الاستراتيجية.",
    responsibilities: ["وضع الرؤية الاستراتيجية", "إدارة الموارد", "تمثيل المنظمة", "اتخاذ القرارات الاستراتيجية"],
    qualifications: ["ماجستير إدارة أعمال", "خبرة 15+ سنة"],
    skills: ["القيادة الاستراتيجية", "اتخاذ القرارات", "الإدارة"],
    experience: "15+ سنة", education: "ماجستير إدارة أعمال",
  },
  {
    id: "exe-002", titleAr: "مساعد تنفيذي", titleEn: "Executive Assistant", dept: "executive", level: "administrative",
    summary: "يدعم المدير التنفيذي في مهامه اليومية.",
    responsibilities: ["إدارة الجدولة", "إعداد التقارير", "تنسيق الاجتماعات"],
    qualifications: ["بكالوريوس", "خبرة 2+ سنة"],
    skills: ["التنظيم", "沟通", "PowerPoint"],
    experience: "2+ سنة", education: "بكالوريوس",
  },
  {
    id: "mkt-001", titleAr: "مدير التسويق", titleEn: "Marketing Manager", dept: "marketing", level: "executive",
    summary: "يدير استراتيجية التسويق والعلامة التجارية.",
    responsibilities: ["وضع خطة التسويق", "إدارة الحملات", "تحليل السوق"],
    qualifications: ["بكالوريوس تسويق", "خبرة 7+ سنة"],
    skills: ["التسويق الرقمي", "تحليل البيانات", "إدارة الحملات"],
    experience: "7+ سنة", education: "بكالوريوس تسويق",
  },
  {
    id: "mkt-002", titleAr: "أخصائي تسويق رقمي", titleEn: "Digital Marketing Specialist", dept: "marketing", level: "specialist",
    summary: "ينفذ الحملات الرقمية ويحلل أداءها.",
    responsibilities: ["إدارة الحملات الرقمية", "إدارة وسائل التواصل", "تحليل الأداء"],
    qualifications: ["بكالوريوس", "خبرة 2+ سنة"],
    skills: ["Google Ads", "Facebook Ads", "SEO", "تحليل البيانات"],
    experience: "2+ سنة", education: "بكالوريوس",
  },
  {
    id: "leg-001", titleAr: "المستشار القانوني", titleEn: "Legal Counsel", dept: "legal", level: "executive",
    summary: "يوفر الاستشارات القانونية ويضمن الامتثال للأنظمة.",
    responsibilities: ["تقديم الاستشارات القانونية", "مراجعة العقود", "إدارة التقاضي"],
    qualifications: ["بكالوريوس حقوق", "المكتبheiro", "خبرة 8+ سنة"],
    skills: ["القانون", "المقارعة", "العقود", "نظام العمل"],
    experience: "8+ سنة", education: "بكالوريوس حقوق",
  },
  {
    id: "sup-001", titleAr: "مدير الخدمات الإدارية", titleEn: "Administrative Services Manager", dept: "support", level: "supervisory",
    summary: "يدير الخدمات الإدارية والمرافق.",
    responsibilities: ["إدارة المرافق", "الخدمات اللوجستية", "إدارة العقود"],
    qualifications: ["بكالوريوس", "خبرة 5+ سنة"],
    skills: ["الإدارة", "اللوجستيات", "إدارة المرافق"],
    experience: "5+ سنة", education: "بكالوريوس",
  },
  {
    id: "sup-002", titleAr: "موظف استقبال", titleEn: "Receptionist", dept: "support", level: "technical",
    summary: "يستقبل الزوار ويجيب على الاستفسارات.",
    responsibilities: ["استقبال الزوار", "إدارة المكالمات", "تنسيق المواعيد"],
    qualifications: ["ثانوية+", "خبرة سنة+"],
    skills: ["沟通", "الאנגלית", "التنظيم"],
    experience: "1+ سنة", education: "ثانوية",
  },
  {
    id: "ops-001", titleAr: "مدير العمليات", titleEn: "Operations Manager", dept: "operations", level: "executive",
    summary: "يدير العمليات التشغيلية اليومية بكفاءة.",
    responsibilities: ["تحسين العمليات", "إدارة الفرق", "متابعة الأداء"],
    qualifications: ["بكالوريوس", "خبرة 8+ سنة"],
    skills: ["إدارة العمليات", "التحسين المستمر", "KPI"],
    experience: "8+ سنة", education: "بكالوريوس",
  },
  {
    id: "ops-002", titleAr: "مشرف عمليات", titleEn: "Operations Supervisor", dept: "operations", level: "supervisory",
    summary: "يشرف على العمليات التشغيلية اليومية.",
    responsibilities: ["إشراف الفرق", "متابعة الجدولة", "حل المشكلات"],
    qualifications: ["بكالوريوس", "خبرة 4+ سنة"],
    skills: ["الإشراف", "المتابعة", "حل المشكلات"],
    experience: "4+ سنة", education: "بكالوريوس",
  },
];

export async function seedJobDescriptions(db: MySql2Database<any>) {
  console.log("💼 Seeding job descriptions...");

  // idempotent: clear owned rows before re-inserting
  await db.delete(translations).where(
    inArray(translations.entityType, ["department", "job_description"]),
  );
  await db.delete(jobDescriptions);
  await db.delete(departments);

  const deptIdMap: Record<string, number> = {};
  for (let i = 0; i < DEPT_DATA.length; i++) {
    const d = DEPT_DATA[i];
    const [result] = await db.insert(departments).values({
      code: d.code, sortOrder: i,
    });
    const id = Number(result.insertId);
    deptIdMap[d.code] = id;
    await tr(db, "department", id, "ar", "name", d.nameAr);
    await tr(db, "department", id, "en", "name", d.nameEn);
    await tr(db, "department", id, "ar", "description", d.descAr);
    await tr(db, "department", id, "ar", "icon", d.icon);
    await tr(db, "department", id, "ar", "color", d.color);
  }

  for (let i = 0; i < JOB_DATA.length; i++) {
    const job = JOB_DATA[i];
    const [result] = await db.insert(jobDescriptions).values({
      code: job.id,
      departmentId: deptIdMap[job.dept] ?? 0,
      level: job.level,
      sortOrder: i,
    });
    const id = Number(result.insertId);
    await tr(db, "job_description", id, "ar", "title", job.titleAr);
    await tr(db, "job_description", id, "en", "title", job.titleEn);
    await tr(db, "job_description", id, "ar", "summary", job.summary);
    await tr(db, "job_description", id, "ar", "responsibilities", JSON.stringify(job.responsibilities));
    await tr(db, "job_description", id, "ar", "qualifications", JSON.stringify(job.qualifications));
    await tr(db, "job_description", id, "ar", "skills", JSON.stringify(job.skills));
    await tr(db, "job_description", id, "ar", "experience", job.experience);
    await tr(db, "job_description", id, "ar", "education", job.education);
  }

  console.log(`   ✓ Job descriptions seeded (${DEPT_DATA.length} departments, ${JOB_DATA.length} jobs)`);
}
