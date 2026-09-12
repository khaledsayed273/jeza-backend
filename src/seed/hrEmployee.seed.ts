import type { MySql2Database } from "drizzle-orm/mysql2";
import {
  hrCostSections,
  hrCostItems,
  leaveTypes,
  employeeMarketData,
} from "../../drizzle/schema";

// ─────────────────────────────────────────────────────────────────────
// Public site constants (consumed by siteNormalized.seed.ts)
// ─────────────────────────────────────────────────────────────────────
export const HOME_SERVICES = [
  { id: "training", path: "/training", titleAr: "قرارات التدريب الوزارية", titleEn: "Ministerial Training Decisions", subAr: "وزارة الموارد البشرية", subEn: "Ministry of HR", descAr: "قرارات التدريب الوزارية ومتطلبات التدريب التعاوني", descEn: "Ministerial training decisions and cooperative training requirements", badgeAr: null, badgeEn: null },
  { id: "platform", path: "/about", titleAr: "تعريف بخدمات المنصة", titleEn: "Platform Services", subAr: "منصة مواكبة", subEn: "Mawakaba Platform", descAr: "تعرّف على خدمات منصة مواكبة المتخصصة في الموارد البشرية", descEn: "Discover Mawakaba platform's specialized HR services", badgeAr: null, badgeEn: null },
  { id: "calculator", path: "/calculator", titleAr: "حاسبة نطاقات والتوطين", titleEn: "Nitaqat & Saudization", subAr: "حاسبة التوطين", subEn: "Saudization Calculator", descAr: "احسب نسبة السعودة ومتطلبات نطاقات لمنشأتك", descEn: "Calculate Saudization percentage and Nitaqat requirements", badgeAr: null, badgeEn: null },
  { id: "end-of-service", path: "/end-of-service", titleAr: "حاسبة المستحقات", titleEn: "Entitlements Calculator", subAr: "مكافأة · إضافي · إجازة", subEn: "Gratuity · Overtime · Leave", descAr: "احسب مكافأة نهاية الخدمة والعمل الإضافي وتعويض الإجازة في مكان واحد", descEn: "Calculate end-of-service gratuity, overtime pay, and leave compensation", badgeAr: "جديد", badgeEn: "New" },
  { id: "updates", path: "/updates", titleAr: "واكب التحديثات", titleEn: "Stay Updated", subAr: "تعلم ذاتي · مصادر رسمية", subEn: "Self-Learning · Official Sources", descAr: "أي تحديث نظامي جديد سيتم إضافته هنا — مصادر رسمية للقراءة والتعلم الذاتي", descEn: "Any new regulatory update will be added here — official sources for self-learning", badgeAr: null, badgeEn: null },
  { id: "hr-explainers", path: "/hr-explainers", titleAr: "شروحات موارد بشرية", titleEn: "HR Explainers", subAr: "تعليم ذاتي · ملفات PDF", subEn: "Self-Learning · PDF Files", descAr: "شروحات ومراجع متخصصة في الموارد البشرية للتعلم الذاتي", descEn: "Specialized HR explainers and references for self-learning", badgeAr: null, badgeEn: null },
  { id: "podcast", path: "/hr-explainers", titleAr: "بودكاست الموارد البشرية", titleEn: "HR Podcast", subAr: "جزاء البقمي · يوتيوب", subEn: "Jaza Al-Baqami · YouTube", descAr: "بودكاست متخصص في الموارد البشرية ونظام العمل السعودي — استمع مباشرة على يوتيوب", descEn: "Specialized HR podcast on Saudi labor law — listen directly on YouTube", badgeAr: null, badgeEn: null, externalUrl: "https://youtu.be/Cu2w-1O2S8I" },
  { id: "nationality-ratio", path: "/nationality-ratio", titleAr: "نسب الجنسيات", titleEn: "Nationality Ratios", subAr: "نظام نطاقات · الجنسيات المقيدة", subEn: "Nitaqat · Restricted Nationalities", descAr: "احسب الحد الأقصى المسموح به لكل جنسية في منشأتك وفق نظام نطاقات", descEn: "Calculate the maximum allowed ratio for each nationality per Nitaqat", badgeAr: null, badgeEn: null },
  { id: "employee-cost", path: "/employee-cost", titleAr: "حاسبة تكاليف الموظفين", titleEn: "Employee Cost Calculator", subAr: "تكاليف مباشرة وخفية", subEn: "Direct & Hidden Costs", descAr: "احسب التكلفة الفعلية لكل موظف أو إدارة شاملة التأمينات والمخصصات والتكاليف الخفية", descEn: "Calculate the true cost per employee or department including GOSI, provisions and hidden costs", badgeAr: "جديد", badgeEn: "New" },
  { id: "hr-cost", path: "/hr-cost", titleAr: "حساب تكاليف الموارد البشرية", titleEn: "HR Cost Calculator", subAr: "رأسمالية · تشغيلية · استراتيجية", subEn: "Capital · Operational · Strategic", descAr: "احسب تكاليف قسم الموارد البشرية بشكل شامل: رأسمالية وتشغيلية واستراتيجية", descEn: "Calculate comprehensive HR department costs: capital, operational, and strategic", badgeAr: "جديد", badgeEn: "New" },
  { id: "turnover-rate", path: "/turnover-rate", titleAr: "حاسبة معدل دوران الموظفين", titleEn: "Employee Turnover Rate", subAr: "شهري · سنوي · مقارنة عالمية", subEn: "Monthly · Annual · Global Benchmarks", descAr: "احسب معدل دوران موظفيك شهرياً وسنوياً وقارنه بالمعدلات العالمية حسب القطاع والوظيفة", descEn: "Calculate monthly & annual employee turnover rate and compare with global benchmarks by sector and job", badgeAr: "جديد", badgeEn: "New" },
  { id: "payroll-sheet", path: "/payroll", titleAr: "مسير الرواتب", titleEn: "Payroll Sheet", subAr: "Excel جماعي · احترافي · لوغو الشركة", subEn: "Group Excel · Professional · Company Logo", descAr: "أنشئ مسير رواتب Excel احترافي لجميع موظفيك بضغطة واحدة مع خصم التأمينات تلقائياً وإمكانية إضافة لوغو الشركة", descEn: "Create a professional Excel payroll sheet for all employees with automatic GOSI deduction and company logo", badgeAr: "جديد", badgeEn: "New" },
  { id: "payroll-calc", path: "/payroll", titleAr: "حاسبة الراتب الفردية", titleEn: "Individual Salary Calculator", subAr: "قسيمة راتب · بدلات بنسبة · أيام المباشرة", subEn: "Pay Slip · Allowance % · Working Days", descAr: "احسب راتب موظف بالتفصيل مع بدل السكن والنقل بنسبة أو مبلغ وأيام العمل الفعلية واطبع قسيمة الراتب", descEn: "Calculate employee salary with housing & transport allowances by percentage or amount, actual working days, and print pay slip", badgeAr: "جديد", badgeEn: "New" },
  { id: "documents-hub", path: "/documents-hub", titleAr: "النماذج والخطابات", titleEn: "Documents & Letters Hub", subAr: "نماذج · خطابات · سياسات · إقرارات", subEn: "Forms · Letters · Policies · Declarations", descAr: "نماذج HR + خطابات بالذكاء الاصطناعي + سياسات وإجراءات + إقرارات التقييم الذاتي", descEn: "HR forms + AI letters + policies + self-assessment declarations", badgeAr: "جديد", badgeEn: "New" },
  { id: "contract-conversion", path: "/contract-conversion", titleAr: "تحول العقد لغير محدد المدة", titleEn: "Contract Conversion", subAr: "المادة 37 · 4 سنوات · 3 تجديدات · للسعودي فقط", subEn: "Art. 37 · 4 Years · 3 Renewals · Saudi Only", descAr: "احسب متى يتحول عقد الموظف السعودي المحدد المدة إلى عقد غير محدد المدة تلقائياً وفق الحالات الثلاث في المادة 37 من نظام العمل", descEn: "Calculate when a Saudi employee's fixed-term contract automatically converts to open-ended per the three cases in Article 37 of Saudi Labor Law", badgeAr: "جديد", badgeEn: "New" },
  { id: "hc-kpi", path: "/hc-kpi", titleAr: "مؤشرات فعالية رأس المال البشري", titleEn: "Human Capital KPI Dashboard", subAr: "قياس · متابعة · تقرير PDF إنفوجرافيك", subEn: "Measure · Track · PDF Infographic Report", descAr: "قِس وتابع مؤشرات الأداء الرئيسية لرأس المال البشري في مؤسستك واحصل على تقرير إنفوجرافيك احترافي ثنائي اللغة", descEn: "Measure and track key HR KPIs for your organization and export a bilingual professional infographic PDF report", badgeAr: "جديد", badgeEn: "New" },
  { id: "leave-calculator", path: "/leave-calculator", titleAr: "حاسبة أرصدة الإجازات", titleEn: "Leave Balance Calculator", subAr: "استحقاق · استخدام · رصيد متبقي", subEn: "Accrued · Used · Remaining Balance", descAr: "احسب رصيد إجازة الموظف بدقة بناءً على تاريخ المباشرة والرصيد السنوي وجميع الإجازات المستخدمة بشكل تفصيلي", descEn: "Calculate employee leave balance accurately based on start date, annual allowance, and all used leaves in detail", badgeAr: "جديد", badgeEn: "New" },
  { id: "probation", path: "/probation", titleAr: "حاسبة فترة التجربة", titleEn: "Probation Calculator", subAr: "تاريخ الانتهاء · الإجازات الممدِّدة · الحد 180 يوم", subEn: "End Date · Extending Leaves · 180-day Cap", descAr: "احسب تاريخ انتهاء فترة التجربة مع مراعاة أيام العيدين والإجازة المرضية والمناسبات الوطنية التي تمدّد فترة التجربة ولا تدخل في حسابها", descEn: "Calculate probation end date accounting for Eid, sick leave and national occasions that extend the period without counting toward it", badgeAr: "جديد", badgeEn: "New" },
  { id: "job-descriptions", path: "/job-descriptions", titleAr: "الأوصاف الوظيفية", titleEn: "Job Descriptions", subAr: "100 وصف وظيفي احترافي", subEn: "100 Professional Job Descriptions", descAr: "مكتبة شاملة من الأوصاف الوظيفية لـ 10 أقسام مع إمكانية البحث والتصفية وتحميل الوصف بصيغة Word", descEn: "Comprehensive library of job descriptions for 10 departments with search, filter, and Word download", badgeAr: "جديد", badgeEn: "New" },
  { id: "org-chart", path: "/org-chart", titleAr: "الهيكل التنظيمي", titleEn: "Org Chart Builder", subAr: "بناء الهياكل الاحترافية", subEn: "Professional Org Charts", descAr: "صمّم هيكلك التنظيمي بسهولة وفق أفضل الممارسات العالمية مع تحليل نطاق الإشراف وعمق الهيكل", descEn: "Design your org chart with best global practices including supervision span and structure depth analysis", badgeAr: "جديد", badgeEn: "New" },
  { id: "workforce-planning", path: "/workforce-planning", titleAr: "تخطيط القوى العاملة", titleEn: "Workforce Planning", subAr: "تحليل الاحتياج الوظيفي", subEn: "Headcount Gap Analysis", descAr: "احسب العجز أو الفائض في القوى العاملة بناءً على عدد الموظفين الحاليين والمتوقعين وتحليل عبء العمل", descEn: "Calculate workforce surplus or deficit based on current headcount, expected needs, and workload analysis", badgeAr: "جديد", badgeEn: "New" },
];

export const ABOUT_CERTIFICATIONS = [
  "مدرب ومستشار موارد بشرية معتمد – HERETOGA LTD (رقم: 11376/24CPHRM)",
  "محترف كوتشينج معتمد PCC – أكاديمية اكتوميا الفرنسية",
  "مسؤول الحوكمة والالتزام والمخاطر GRCO – AGRC / LGCA",
  "نظام إدارة الجودة ISO 9001:2015 – AMERICO (2025م)",
  "مدقق داخلي ISO 9001:2015 – رواد الجودة للاستشارات الإدارية (2025م)",
  "تدريب المتدربين TOT – مركز التقنية الحصرية للتدريب (رقم: 21332390)",
  "سفير الاستراتيجية الوطنية للجودة – المواصفات السعودية (رقم: 2408563611655)",
  "Certified Professional in Performance Indicators – The KPI Institute",
  "مدقق الجودة المعتمد – s.ct uk (رقم: 485933246731)",
  "مستشار معتمد في الإدارة الإستراتيجية CSMC – American Institute of Professional Studies",
  "Executive Leadership Development Programme – American Institute of Professional Studies",
  "The Role That Involvement & Recognition Play in Driving Your Team Engagement – SHRM Provider",
];

export const ABOUT_STATS = [
  { value: "+1,292", labelAr: "متدرب", labelEn: "Trainees" },
  { value: "21", labelAr: "دورة", labelEn: "Courses" },
  { value: "198", labelAr: "ساعة تدريب", labelEn: "Training Hours" },
  { value: "98.8%", labelAr: "تقييم", labelEn: "Rating" },
];

export const ABOUT_COURSES = [
  { labelAr: "الموارد البشرية", labelEn: "Human Resources" },
  { labelAr: "نظام العمل", labelEn: "Labor Law" },
  { labelAr: "نظام التأمينات", labelEn: "Insurance System" },
  { labelAr: "المنصات الحكومية", labelEn: "Government Platforms" },
  { labelAr: "خدمات الموظفين", labelEn: "Employee Services" },
  { labelAr: "التطوير التنظيمي", labelEn: "Organizational Development" },
];

export const ABOUT_CONTACTS = [
  { labelAr: "واتساب", labelEn: "WhatsApp", hrefType: "whatsapp", color: "oklch(0.55 0.20 145)" },
  { labelAr: "تلقرام", labelEn: "Telegram", value: "@jzaaalbqamy", href: "https://t.me/jzaaalbqamy", color: "oklch(0.55 0.18 220)" },
  { labelAr: "لينكدإن", labelEn: "LinkedIn", valueAr: "جزاء البقمي", valueEn: "Jaza Al-Baqami", href: "https://www.linkedin.com/in/جزاء-البقمي-68b6811a7", color: "oklch(0.45 0.18 250)" },
  { labelAr: "اتصال", labelEn: "Call", hrefType: "tel", color: "oklch(0.55 0.22 290)" },
];

export const HR_COST_SECTIONS = {
  sections: [
    { key: "capital", title: "التكاليف الرأسمالية", items: [ { id: "offices", label: "مكاتب" }, { id: "equipment", label: "مقتنيات وأثاث" }, { id: "tech", label: "تقنية وأجهزة" }, { id: "assets", label: "أصول ثابتة (استهلاك)" }, { id: "property", label: "ممتلكات أخرى" }, { id: "utilities", label: "مرافق (كهرباء، ماء، إنترنت)" }, { id: "capital_other", label: "أخرى" } ] },
    { key: "opex", title: "المصروفات التشغيلية", items: [ { id: "subscriptions", label: "اشتراكات وفواتير" }, { id: "gov_platforms", label: "منصات حكومية (مسار، قوى، إلخ)" }, { id: "work_permits", label: "رخص عمل وإقامات" }, { id: "health_ins", label: "تأمين طبي" }, { id: "salaries", label: "رواتب وبدلات" }, { id: "bonuses", label: "مكافآت وحوافز" }, { id: "recruitment", label: "توظيف واستقطاب" }, { id: "gov_fees", label: "رسوم حكومية" }, { id: "opex_other", label: "أخرى" } ] },
    { key: "strategic", title: "المصروفات الاستراتيجية", items: [ { id: "work_env", label: "مبادرات تحسين بيئة العمل" }, { id: "training", label: "تدريب وتطوير" }, { id: "strategic_other", label: "أخرى" } ] },
  ],
};

export const LEAVE_TYPES = [
  { value: "annual", labelAr: "إجازة سنوية", labelEn: "Annual Leave" },
  { value: "sick", labelAr: "إجازة مرضية", labelEn: "Sick Leave" },
  { value: "emergency", labelAr: "إجازة طارئة", labelEn: "Emergency Leave" },
  { value: "maternity", labelAr: "إجازة أمومة", labelEn: "Maternity Leave" },
  { value: "paternity", labelAr: "إجازة أبوة", labelEn: "Paternity Leave" },
  { value: "hajj", labelAr: "إجازة حج", labelEn: "Hajj Leave" },
  { value: "unpaid", labelAr: "إجازة بدون راتب", labelEn: "Unpaid Leave" },
  { value: "other", labelAr: "أخرى", labelEn: "Other" },
];

export const EMPLOYEE_MARKET_DATA = [
  { title: "مهندس برمجيات", sector: "تقنية المعلومات", min: 8000, avg: 14000, max: 22000 },
  { title: "محاسب", sector: "المالية", min: 5000, avg: 8500, max: 14000 },
  { title: "مدير موارد بشرية", sector: "الموارد البشرية", min: 10000, avg: 16000, max: 25000 },
  { title: "مختص توظيف", sector: "الموارد البشرية", min: 5000, avg: 8000, max: 13000 },
  { title: "مدير مشروع", sector: "الإدارة", min: 12000, avg: 18000, max: 30000 },
  { title: "مهندس مدني", sector: "الهندسة", min: 7000, avg: 12000, max: 20000 },
  { title: "طبيب", sector: "الصحة", min: 15000, avg: 25000, max: 45000 },
  { title: "ممرض/ة", sector: "الصحة", min: 4000, avg: 7000, max: 12000 },
  { title: "معلم/ة", sector: "التعليم", min: 4000, avg: 6500, max: 10000 },
  { title: "مدير مبيعات", sector: "المبيعات", min: 8000, avg: 13000, max: 22000 },
  { title: "مختص تسويق", sector: "التسويق", min: 5000, avg: 9000, max: 15000 },
  { title: "محلل بيانات", sector: "تقنية المعلومات", min: 7000, avg: 12000, max: 20000 },
];

export async function seedHrEmployee(db: MySql2Database<any>) {
  console.log("  → Seeding normalized hrCost / leave / employeeMarket...");

  // hr-cost
  await db.delete(hrCostItems);
  await db.delete(hrCostSections);
  for (const [si, sec] of HR_COST_SECTIONS.sections.entries()) {
    const res: any = await db.insert(hrCostSections).values({ key: sec.key, title: sec.title, sortOrder: si });
    const sectionId = Number(res[0].insertId);
    if (sec.items.length) {
      await db.insert(hrCostItems).values(
        sec.items.map((it, i) => ({ sectionId, itemId: it.id, label: it.label, sortOrder: i })),
      );
    }
  }

  // leave
  await db.delete(leaveTypes);
  await db.insert(leaveTypes).values(
    LEAVE_TYPES.map((l, i) => ({ value: l.value, labelAr: l.labelAr, labelEn: l.labelEn, sortOrder: i })),
  );

  // employee-market
  await db.delete(employeeMarketData);
  await db.insert(employeeMarketData).values(
    EMPLOYEE_MARKET_DATA.map((e, i) => ({ title: e.title, sector: e.sector, min: e.min, avg: e.avg, max: e.max, sortOrder: i })),
  );

  console.log("    ✓ hrCostSections / leaveTypes / employeeMarketData");
}
