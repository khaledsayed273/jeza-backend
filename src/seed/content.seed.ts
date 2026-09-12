import type { MySql2Database } from "drizzle-orm/mysql2";
import { inArray } from "drizzle-orm";
import {
  hrCategories, hrSources, hrImages, updateSources,
  templateCategories, hrForms,
  policyCategories, policies, declarations, translations,
} from "../../drizzle/schema";

// ─── HR Explainers ──────────────────────────────────────────────────────────

const hrCatData = [
  { id: "all" as const,           labelAr: "الكل",                  labelEn: "All",              color: "oklch(0.55 0.22 290)", icon: "⊞" },
  { id: "contracts" as const,     labelAr: "العقود ونظام العمل",    labelEn: "Contracts",        color: "oklch(0.50 0.18 220)", icon: "📄" },
  { id: "insurance" as const,     labelAr: "التأمينات والإصابات",   labelEn: "Insurance",        color: "oklch(0.50 0.18 145)", icon: "🛡" },
  { id: "penalties" as const,     labelAr: "العقوبات والجزاءات",    labelEn: "Penalties",        color: "oklch(0.50 0.18 290)", icon: "⚖" },
  { id: "platforms" as const,     labelAr: "المنصات الحكومية",      labelEn: "Gov Platforms",    color: "oklch(0.50 0.18 55)",  icon: "🖥" },
  { id: "hr-management" as const, labelAr: "إدارة الموارد البشرية", labelEn: "HR Management",    color: "oklch(0.50 0.18 180)", icon: "👥" },
];

const hrSrcData = [
  { id: "fixed-contract",   titleAr: "العقد محدد المدة",                     category: "contracts" as const,     url: "/uploads/hr-fixed-term-contract_07d4c005.pdf",          color: "oklch(0.50 0.18 220)" },
  { id: "open-contract",    titleAr: "العقد غير محدد المدة",                  category: "contracts" as const,     url: "/uploads/hr-open-term-contract_c1850aef.pdf",            color: "oklch(0.50 0.18 220)" },
  { id: "notice-period",    titleAr: "فترة الإشعار والإخطار",                 category: "contracts" as const,     url: "/uploads/hr-notice-period_f57139a4.pdf",                 color: "oklch(0.50 0.18 220)" },
  { id: "overtime",         titleAr: "العمل الإضافي",                         category: "contracts" as const,     url: "/uploads/hr-overtime_e5fdee37.pdf",                      color: "oklch(0.50 0.18 220)" },
  { id: "labor-summary",    titleAr: "الاختصار لفهم نظام العمل",              category: "contracts" as const,     url: "/uploads/hr-labor-law-summary_899815dc.pdf",              color: "oklch(0.50 0.18 220)" },
  { id: "legal-skills",     titleAr: "مهارات قانونية لنظام العمل",            category: "contracts" as const,     url: "/uploads/hr-legal-skills_49f7eede.pdf",                  color: "oklch(0.50 0.18 220)" },
  { id: "work-injury",      titleAr: "إصابة العمل",                           category: "insurance" as const,     url: "/uploads/hr-work-injury_2d0e2cdf.pdf",                   color: "oklch(0.50 0.18 145)" },
  { id: "gosi-rates",       titleAr: "نسب التأمينات الاجتماعية",              category: "insurance" as const,     url: "/uploads/hr-gosi-rates-new_fe4e4d49.pdf",                color: "oklch(0.50 0.18 145)" },
  { id: "social-insurance", titleAr: "التأمينات الاجتماعية",                  category: "insurance" as const,     url: "/uploads/hr-social-insurance-guide_975a3149.pdf",        color: "oklch(0.50 0.18 145)" },
  { id: "penalties-new",    titleAr: "لائحة العقوبات الجديدة",                category: "penalties" as const,     url: "/uploads/hr-penalties-regulation-new_fe676604.pdf",     color: "oklch(0.50 0.18 290)" },
  { id: "legal-penalties",  titleAr: "العقوبات النظامية",                     category: "penalties" as const,     url: "/uploads/hr-legal-penalties_5c22543b.pdf",               color: "oklch(0.50 0.18 290)" },
  { id: "emp-penalties",    titleAr: "العقوبات على صاحب العمل والعامل",       category: "penalties" as const,     url: "/uploads/hr-employer-worker-penalties_f5c1ef63.pdf",     color: "oklch(0.50 0.18 290)" },
  { id: "gov-platforms",    titleAr: "المنصات الحكومية",                      category: "platforms" as const,     url: "/uploads/hr-gov-platforms_c6a17813.pdf",                 color: "oklch(0.50 0.18 55)"  },
  { id: "eight-platforms",  titleAr: "أدوار ثماني منصات حكومية",             category: "platforms" as const,     url: "/uploads/hr-eight-platforms_ca4c5aeb.pdf",               color: "oklch(0.50 0.18 55)"  },
  { id: "labor-market",     titleAr: "منصات سوق العمل",                       category: "platforms" as const,     url: "/uploads/hr-labor-market-platforms_17544382.pdf",        color: "oklch(0.50 0.18 55)"  },
  { id: "nitaqat",          titleAr: "نطاقات المطور",                         category: "platforms" as const,     url: "/uploads/hr-nitaqat-developer_4adb4022.pdf",             color: "oklch(0.50 0.18 55)"  },
  { id: "employee-affairs", titleAr: "شؤون الموظفين",                         category: "hr-management" as const, url: "/uploads/hr-employee-affairs_d04196c0.pdf",              color: "oklch(0.50 0.18 180)" },
  { id: "workforce-plan",   titleAr: "تخطيط القوى العاملة",                   category: "hr-management" as const, url: "/uploads/hr-workforce-planning_b6ba6b0a.pdf",            color: "oklch(0.50 0.18 180)" },
  { id: "job-class",        titleAr: "التصنيف الموحد للمهن",                  category: "hr-management" as const, url: "/uploads/hr-job-classification_ae515702.pdf",            color: "oklch(0.50 0.18 180)" },
  { id: "initiatives",      titleAr: "مبادرات الموارد البشرية",               category: "hr-management" as const, url: "/uploads/hr-initiatives_ceddd3c2.pdf",                   color: "oklch(0.50 0.18 180)" },
  { id: "ministerial",      titleAr: "معلومات مهمة عن القرارات الوزارية",     category: "hr-management" as const, url: "/uploads/hr-ministerial-decisions_68713605.pdf",         color: "oklch(0.50 0.18 180)" },
  { id: "hr-development",   titleAr: "تطوير الموارد البشرية",                 category: "hr-management" as const, url: "/uploads/hr-development_3cafbc84.pdf",                   color: "oklch(0.50 0.18 180)" },
  { id: "job-integration",  titleAr: "الاندماج الوظيفي",                      category: "hr-management" as const, url: "/uploads/hr-job-integration_7339ec66.pdf",               color: "oklch(0.50 0.18 180)" },
];

const hrImgData = [
  { id: "img-01",  titleAr: "نسب المهن ونسب التوطين",                         url: "/uploads/IMG_1230_d27ec21a.png" },
  { id: "img-02",  titleAr: "نسب التوطين للمهن التالية",                      url: "/uploads/IMG_1222_e5ae4836.jpeg" },
  { id: "img-03",  titleAr: "مستحقات إنهاء العلاقة التعاقدية",                  url: "/uploads/AA21AC5E-0663-4D1A-882F-2930AFE100C3_c6559e4d.png" },
  { id: "img-04",  titleAr: "مستحقات إنهاء العلاقة والإشعار",               url: "/uploads/AA21AC5E-0663-4D1A-882F-2930AFE100C3(1)_8ec7a049.png" },
  { id: "img-05",  titleAr: "الفرق بين الركائز والأهداف الاستراتيجية",         url: "/uploads/5DC19C54-DECF-4292-8E95-CB4FAEE1D2B0_c5e663ad.png" },
  { id: "img-06",  titleAr: "الفرق بين الهياكل التنظيمية والوظيفية",        url: "/uploads/17122D84-5C40-4EA4-B53E-88CDF6351C00_870c130b.png" },
  { id: "img-07",  titleAr: "الفرق بين الوصف التنظيمي والوظيفي",          url: "/uploads/B44CE03F-BB69-4C20-9C7F-759725AE0804_291e5a83.png" },
  { id: "img-08",  titleAr: "صياغة ركائز وأهداف استراتيجية الموارد البشرية",     url: "/uploads/78C62129-05A9-482F-BD3B-86BAA9CCF6FF_57e0defb.png" },
  { id: "img-09",  titleAr: "مصطلحات مهمة في تخطيط الموارد البشرية",      url: "/uploads/37FB403C-EEF2-46B3-AB49-F458E107A5BC_b188a5d2.png" },
  { id: "img-10",  titleAr: "تداخل الإجازات: السنوية والمرضية والأعياد",        url: "/uploads/6F355927-9837-47BB-8D91-AD286DB5C1FA_65de7ea2.png" },
  { id: "img-11",  titleAr: "أركان وضوابط تعويض المادة 77",                     url: "/uploads/1334D148-68F1-445F-A711-530F552A9956_885a2d0d.png" },
  { id: "img-12",  titleAr: "ضوابط التحقيق العمالي",                            url: "/uploads/BF6555AB-BBF4-4AE7-BB30-7FD6A55D0C9D_876a712e.png" },
  { id: "img-13",  titleAr: "إجراءات الاستقالة في العمل",                           url: "/uploads/ECDB560A-4DC0-498F-BD6D-B8581A77F37E_fc5b8e14.png" },
  { id: "img-14",  titleAr: "من يتحمل التكاليف والرسوم الحكومية؟",             url: "/uploads/5CD5D49E-8664-4079-AC32-87369B6B100F_242a01fe.png" },
  { id: "img-15",  titleAr: "خدمة إدارة عقود العمل من قوى",                   url: "/uploads/IMG_1008_8d7c67ad.png" },
  { id: "img-16",  titleAr: "مهلة البحث عن عمل في العقد غير محدد",              url: "/uploads/IMG_0999_d4de9f64.png" },
  { id: "img-17",  titleAr: "الوظائف الموطنة في مهنة المبيعات",                  url: "/uploads/C49446A9-E090-43D8-A61C-075DFC670B21_06c45c5b.png" },
  { id: "img-18",  titleAr: "الوظائف الموطنة في مهن التسويق",                  url: "/uploads/550CB036-B882-4E79-A27E-DEC4D490C502_75fa4d84.png" },
  { id: "img-19",  titleAr: "الوظائف الموطنة في مهن المشتريات",                url: "/uploads/5ACC8D92-20C7-48AB-A67E-1CE7E569314B_9476c5fd.png" },
  { id: "img-20",  titleAr: "الوظائف الموطنة في المهن الإدارية (1)",            url: "/uploads/E49849CC-78C2-4766-A2CD-D06E90D77FF1_0b01c507.png" },
  { id: "img-21",  titleAr: "الوظائف الموطنة في المهن الإدارية (2)",            url: "/uploads/F089C912-3507-4B4A-A90F-47A0328903DD_b1fd4720.png" },
  { id: "img-22",  titleAr: "تحويل العقد من محدد إلى غير محدد",               url: "/uploads/3E3037A4-4E29-4B77-B465-EA1666CFF6BD_9f53af71.png" },
  { id: "img-23",  titleAr: "تصنيف الكيانات حسب عدد العمالة",                  url: "/uploads/FD78E54B-4C69-4518-B84D-BB11C966F396_9b64ee10.png" },
  { id: "img-24",  titleAr: "أنواع الإجازات في نظام العمل السعودي",           url: "/uploads/6025A212-1F2B-4F6A-A83B-FEC3F6948C20_7fcae949.png" },
  { id: "img-25",  titleAr: "حساب مكافأة نهاية الخدمة",                        url: "/uploads/0CFFAF8A-43D6-4A86-B307-70270A5D9AF5_fb32bcf3.png" },
  { id: "img-26",  titleAr: "حساب مكافأة نهاية الخدمة بالأيام",               url: "/uploads/FF32A682-19AE-486D-B426-6CE19A70F028_a8843f51.png" },
];

// ─── Updates ─────────────────────────────────────────────────────────────────

const updateSrcData = [
  {
    id: "labor-law-2026",
    titleAr: "نظام العمل 2026",
    titleEn: "Labor Law 2026",
    descAr: "نظام العمل السعودي — الإصدار المحدّث 2026 الصادر عن وزارة الموارد البشرية",
    descEn: "Saudi Labor Law — updated 2026 edition issued by the Ministry of HR",
    url: "/uploads/labor-law-2026_0773840c.pdf",
    type: "pdf" as const,
    color: "oklch(0.50 0.18 220)",
  },
  {
    id: "labor-law-exec",
    titleAr: "اللائحة التنفيذية لنظام العمل",
    titleEn: "Labor Law Executive Regulations",
    descAr: "اللائحة التنفيذية لنظام العمل السعودي وملحقاتها الكاملة",
    descEn: "Saudi Labor Law executive regulations and full annexes",
    url: "/uploads/labor-law-executive-regulations_309033f5.pdf",
    type: "pdf" as const,
    color: "oklch(0.55 0.22 290)",
  },
  {
    id: "health-insurance",
    titleAr: "لائحة الضمان الصحي التعاوني",
    titleEn: "Cooperative Health Insurance Regulations",
    descAr: "اللائحة التنفيذية لنظام الضمان الصحي التعاوني — يونيو 2023",
    descEn: "Executive regulations for cooperative health insurance — June 2023",
    url: "/uploads/health-insurance-regulations_19354b6a.pdf",
    type: "pdf" as const,
    color: "oklch(0.50 0.18 145)",
  },
  {
    id: "social-insurance",
    titleAr: "نظام التأمينات الاجتماعية",
    titleEn: "Social Insurance System",
    descAr: "نظام التأمينات الاجتماعية السعودي — الأحكام والاشتراكات والمستحقات",
    descEn: "Saudi Social Insurance System — provisions, contributions and benefits",
    url: "/uploads/social-insurance-system_48121976.pdf",
    type: "pdf" as const,
    color: "oklch(0.52 0.20 180)",
  },
  {
    id: "saned",
    titleAr: "نظام ساند",
    titleEn: "SANED System",
    descAr: "نظام دعم العاطلين عن العمل — الأحكام والشروط والاستحقاقات",
    descEn: "Unemployment support system — terms, conditions and benefits",
    url: "/uploads/saned-system_4d3f5ebe.pdf",
    type: "pdf" as const,
    color: "oklch(0.55 0.18 55)",
  },
  {
    id: "gosi-guide",
    titleAr: "كتيب أصحاب الأعمال — التأمينات",
    titleEn: "Employers' GOSI Guide",
    descAr: "دليل أصحاب الأعمال في التأمينات الاجتماعية — الاشتراكات والالتزامات",
    descEn: "Employers' guide to social insurance — contributions and obligations",
    url: "/uploads/employers-gosi-guide_0319ca73.pdf",
    type: "pdf" as const,
    color: "oklch(0.52 0.20 320)",
  },
  {
    id: "nitaqat-2026",
    titleAr: "نطاقات المطور 2026",
    titleEn: "Nitaqat Developer 2026",
    descAr: "دليل نطاقات المطور لعام 2026 — نسب السعودة والتصنيفات المحدّثة",
    descEn: "Nitaqat Developer guide 2026 — updated Saudization rates and classifications",
    url: "/uploads/nitaqat-developer-2026_ead52d43.pdf",
    type: "pdf" as const,
    color: "oklch(0.55 0.20 260)",
  },
  {
    id: "hrsd",
    titleAr: "وزارة الموارد البشرية",
    titleEn: "Ministry of HR",
    descAr: "الموقع الرسمي لوزارة الموارد البشرية والتنمية الاجتماعية",
    descEn: "Official website of the Ministry of Human Resources",
    url: "https://hrsd.gov.sa",
    type: "link" as const,
    color: "oklch(0.50 0.18 35)",
  },
  {
    id: "gosi",
    titleAr: "المؤسسة العامة للتأمينات",
    titleEn: "GOSI Portal",
    descAr: "الموقع الرسمي للمؤسسة العامة للتأمينات الاجتماعية",
    descEn: "Official portal of the General Organization for Social Insurance",
    url: "https://www.gosi.gov.sa",
    type: "link" as const,
    color: "oklch(0.50 0.18 180)",
  },
];

// ─── Templates ───────────────────────────────────────────────────────────────

const templateFileUrls = {
  file1: "/uploads/hr-forms-20_c3160123.xlsx",
  file2: "/uploads/hr-forms-resources_4114c583.xlsx",
  fAbsence: "/uploads/form-monthly-absence-report_f0cd27c1.docx",
  fGrievance: "/uploads/form-grievance_b99c966f.docx",
  fJobOffer: "/uploads/form-job-offer_b884c790.doc",
  fWorkforce: "/uploads/form-workforce_226c7c55.xls",
  fSurvey: "/uploads/form-survey_3c2a93b3.doc",
  fLeaveReq: "/uploads/form-leave-request_7ffc99f4.docx",
  fCoopTrain: "/uploads/form-coop-training_fabb4c4c.xlsx",
  fVehicle: "/uploads/form-vehicle-receipt_ddc387b5.docx",
  fExitInt: "/uploads/form-exit-interview_f7e6da1c.docx",
  fLeaveTrack: "/uploads/form-leave-tracker_bb080800.xlsm",
  fDelegation: "/uploads/form-delegation_8bcc2668.pdf",
  fClearance: "/uploads/form-clearance_4e56e399.docx",
  fWelcome: "/uploads/form-welcome-letter_f8b298fd.docx",
  fCoopContract: "/uploads/form-coop-contract_8590403c.docx",
};

const hrFormData = [
  { code: "HR001", ar: "طلب تعيين", en: "Employment Request", category: "توظيف", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR002", ar: "تقرير مقابلة", en: "Interview Report", category: "توظيف", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR003", ar: "نموذج طلب توظيف", en: "Job Application Form", category: "توظيف", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR004", ar: "إجراءات التعيين", en: "Recruitment Procedures", category: "توظيف", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR005", ar: "إخطار مباشرة عمل لموظف جديد", en: "Notice Of Starting Work", category: "توظيف", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR028", ar: "عرض وظيفي", en: "Job Offer Letter", category: "توظيف", file: templateFileUrls.fJobOffer, ext: "Word" },
  { code: "HR029", ar: "رسالة ترحيب بموظف جديد", en: "Employee Welcome Letter", category: "توظيف", file: templateFileUrls.fWelcome, ext: "Word" },
  { code: "HR006", ar: "نموذج تقييم الأداء خلال فترة التجربة", en: "Performance Evaluation (Probation)", category: "أداء", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR030", ar: "استفتاء / استبيان", en: "Survey / Questionnaire", category: "أداء", file: templateFileUrls.fSurvey, ext: "Word" },
  { code: "HR007", ar: "تفويض بتحويل راتب", en: "Authorization to Transfer Salary", category: "رواتب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR021", ar: "طلب سلفة", en: "Advance Payment Request", category: "رواتب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR031", ar: "نموذج تفويض", en: "Delegation Form", category: "رواتب", file: templateFileUrls.fDelegation, ext: "PDF" },
  { code: "HR008", ar: "سجل حضور الموظف", en: "Employee Attendance Log", category: "حضور وإجازات", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR009", ar: "تقرير التأخير والغياب الشهري للموظفين", en: "Monthly Absence & Delay Report", category: "حضور وإجازات", file: templateFileUrls.fAbsence, ext: "Word" },
  { code: "HR010", ar: "طلب إجازة ومباشرة العمل بعد العودة", en: "Vacation Request + Return to Work", category: "حضور وإجازات", file: templateFileUrls.fLeaveReq, ext: "Word" },
  { code: "HR022", ar: "طلب مغادرة عمل", en: "Time-Off Work Request", category: "حضور وإجازات", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR032", ar: "نموذج تتبع إجازات الموظفين", en: "Employee Leave Tracker", category: "حضور وإجازات", file: templateFileUrls.fLeaveTrack, ext: "Excel" },
  { code: "HR011", ar: "طلب توجيه خطاب إنذار", en: "Request For Violation Notification", category: "تأديب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR012", ar: "نموذج خطاب إنذار", en: "Violation Notification Form", category: "تأديب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR023", ar: "نموذج تظلم", en: "Grievance Form", category: "تأديب", file: templateFileUrls.fGrievance, ext: "Word" },
  { code: "HR013", ar: "نموذج نقل موظف", en: "Employee / Position Transfer Form", category: "نقل وانتداب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR017", ar: "نموذج رحلة عمل (انتداب)", en: "Business Trip Form", category: "نقل وانتداب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR014", ar: "طلب مراجعة بدلات", en: "Benefits Review Request", category: "مزايا", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR020", ar: "طلب إضافة وتعديل تأمين طبي", en: "Medical Insurance Addition/Edit", category: "مزايا", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR015", ar: "طلب حضور تدريب", en: "Training Attendance Request", category: "تدريب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR016", ar: "نموذج تقييم تدريب", en: "Training Evaluation Form", category: "تدريب", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR033", ar: "نموذج التدريب التعاوني", en: "Cooperative Training Form", category: "تدريب", file: templateFileUrls.fCoopTrain, ext: "Excel" },
  { code: "HR034", ar: "عقد التدريب التعاوني", en: "Cooperative Training Contract", category: "تدريب", file: templateFileUrls.fCoopContract, ext: "Word" },
  { code: "HR018", ar: "نموذج طلب خدمة حكومية", en: "Government Service Request", category: "خدمات حكومية", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR025", ar: "نموذج طلب من الشئون الصحية", en: "M.O.H. Request Form", category: "خدمات حكومية", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR035", ar: "نموذج القوى العاملة", en: "Workforce Form", category: "خدمات حكومية", file: templateFileUrls.fWorkforce, ext: "Excel" },
  { code: "HR019", ar: "نموذج طلب من الشئون الإدارية", en: "Admin Service Request Form", category: "إدارية", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR024", ar: "طلب الموافقة على عمل وقت إضافي", en: "Overtime Approval Request", category: "إدارية", file: templateFileUrls.file1, ext: "Excel" },
  { code: "HR026", ar: "نموذج إخلاء طرف موظف", en: "Employee Clearance Form", category: "إدارية", file: templateFileUrls.fClearance, ext: "Word" },
  { code: "HR027", ar: "نموذج استلام وتسليم سيارة", en: "Vehicle Delivery Form", category: "إدارية", file: templateFileUrls.fVehicle, ext: "Word" },
  { code: "HR-R01", ar: "استقالة", en: "Resignation Form", category: "إنهاء خدمة", file: templateFileUrls.file2, ext: "Excel" },
  { code: "HR036", ar: "مقابلة مغادرة الموظف", en: "Exit Interview", category: "إنهاء خدمة", file: templateFileUrls.fExitInt, ext: "Word" },
];

const tmplCatData = ["الكل", "توظيف", "أداء", "رواتب", "حضور وإجازات", "تأديب", "نقل وانتداب", "مزايا", "تدريب", "خدمات حكومية", "إدارية", "إنهاء خدمة"];

const tmplCatIcons: Record<string, string> = {
  "الكل": "⊞",
  "توظيف": "👤",
  "أداء": "📊",
  "رواتب": "💰",
  "حضور وإجازات": "📅",
  "تأديب": "⚖",
  "نقل وانتداب": "🔄",
  "مزايا": "🏥",
  "تدريب": "🎓",
  "خدمات حكومية": "🏛",
  "إدارية": "📋",
  "إنهاء خدمة": "🚪",
};

// ─── Policies ────────────────────────────────────────────────────────────────

const policyData = [
  {
    id: "ch02", chapterNum: 2, ar: "التوظيف", en: "Recruitment", category: "توظيف",
    objectives: ["توضيح سياسات وإجراءات التوظيف ليتم اتباعها من قبل المعنيين في إدارة الموارد البشرية والمدراء وكافة الموظفين."],
    policies: ["التوظيف يكون بناءً على حاجة فعلية وليست مجرد توقعات لتفادي التوظيف العشوائي غير المبرر.", "الأولوية في التوظيف تكون للكفاءات الوطنية السعودية.", "يجب أن تتوفر في المتقدم للوظيفة المؤهلات والخبرات المطلوبة.", "لا يجوز توظيف أي شخص دون الحصول على الموافقات اللازمة."],
    procedures: ["تخطيط احتياجات الموارد البشرية", "ضوابط التوظيف", "مصادر التوظيف", "إجراءات الاختيار والتعيين"],
  },
  {
    id: "ch03", chapterNum: 3, ar: "تسجيل موظف جديد", en: "New Employee In-Processing", category: "توظيف",
    objectives: ["توضيح سياسات وإجراءات تسجيل الموظفين الجدد.", "توفير نظام تسجيل البيانات بما يحفظ حقوق الشركة والموظف."],
    policies: ["التحاق الموظف بالشركة لا يعتد به إلا وفق الإجراءات التي تمت من خلال النماذج والوثائق المحددة.", "وثائق التوظيف يجب أن تكون مكتملة قبل بدء العمل."],
    procedures: ["استلام وثائق الموظف الجديد", "تسجيل بيانات الموظف في النظام", "إصدار بطاقة الموظف"],
  },
  {
    id: "ch04", chapterNum: 4, ar: "تهيئة الموظف الجديد", en: "Orientation Program", category: "توظيف",
    objectives: ["وضع برنامج تهيئة لكل موظف جديد بما يحقق اطلاعه على مجمل النشاطات والإجراءات والأنظمة بالشركة.", "توضيح الأدوار والمسؤوليات للموظف الجديد."],
    policies: ["تحرص الشركة على إطلاع كافة موظفيها الجدد على مختلف أقسام وإدارات الشركة لتسهيل اندماجهم في بيئة العمل.", "يجب أن يكمل الموظف الجديد برنامج التهيئة خلال الأسابيع الأولى من التحاقه."],
    procedures: ["جولة تعريفية بالشركة", "تعريف الموظف بزملائه ومديره المباشر", "شرح السياسات والإجراءات الأساسية", "تقييم برنامج التهيئة"],
  },
  {
    id: "ch05", chapterNum: 5, ar: "الترقيات والزيادات", en: "Promotion and Increments", category: "رواتب ومزايا",
    objectives: ["توضيح سياسات وإجراءات الترقيات ومنح الزيادات.", "توفير بيئة تنافسية تحفز الموظفين على التميز."],
    policies: ["الترقية تكون بناءً على الأداء والكفاءة وليس على الأقدمية فقط.", "يجب أن تتوفر وظيفة شاغرة لإتمام الترقية.", "الزيادات السنوية تُمنح وفق تقييم الأداء."],
    procedures: ["تقييم الأداء السنوي", "مراجعة الهيكل الوظيفي", "اعتماد قرار الترقية", "تحديث بيانات الموظف"],
  },
  {
    id: "ch06", chapterNum: 6, ar: "البدلات", en: "Allowances", category: "رواتب ومزايا",
    objectives: ["توضيح سياسات وإجراءات منح البدلات واشتراطاتها.", "تحديد النسب والمقدار المحدد لكل بدل."],
    policies: ["بدل السكن يُمنح للموظفين على عقد عائلي حيث لا توفر الشركة سكناً.", "بدل النقل يُمنح للموظف الذي لا توفر له الشركة وسيلة مواصلات.", "بدل الاتصالات يُمنح لبعض الموظفين حسب طبيعة عملهم.", "بدل الخدمة الطويلة يُمنح تقديراً لاستمرارية الموظف."],
    procedures: ["تحديد أهلية الموظف للبدل", "اعتماد البدل من المدير المختص", "إدراج البدل في مسير الرواتب"],
  },
  {
    id: "ch07", chapterNum: 7, ar: "الرعاية الصحية", en: "Medical Care", category: "رواتب ومزايا",
    objectives: ["توضيح سياسات وإجراءات التأمين الصحي للموظفين وأسرهم."],
    policies: ["توفر الشركة تأمين صحي لجميع الموظفين وفق نظام التأمين الصحي التعاوني.", "يشمل التأمين الصحي أسرة الموظف وفق الشروط المحددة.", "يجب على الموظف إبلاغ إدارة الموارد البشرية عند تغيير بيانات أسرته."],
    procedures: ["تسجيل الموظف في نظام التأمين الصحي", "إصدار بطاقة التأمين", "إجراءات المطالبات الطبية"],
  },
  {
    id: "ch08", chapterNum: 8, ar: "أوقات العمل والراحة", en: "Work and Rest Schedule", category: "حضور وإجازات",
    objectives: ["تنظيم أوقات العمل والراحة وفق نظام العمل السعودي."],
    policies: ["ساعات العمل الرسمية 8 ساعات يومياً و48 ساعة أسبوعياً.", "في شهر رمضان المبارك تُخفض ساعات العمل إلى 6 ساعات يومياً.", "يحق للموظف فترة راحة لا تقل عن 30 دقيقة يومياً."],
    procedures: ["جدول أوقات العمل", "تسجيل الحضور والانصراف", "إجراءات التأخر والغياب"],
  },
  {
    id: "ch09", chapterNum: 9, ar: "الإجازات والعطل الرسمية", en: "Vacation and Official Holidays", category: "حضور وإجازات",
    objectives: ["توضيح سياسات وإجراءات الإجازات السنوية والعطل الرسمية."],
    policies: ["الإجازة السنوية 21 يوم عمل للموظف الذي أمضى أقل من 5 سنوات.", "الإجازة السنوية 30 يوم عمل للموظف الذي أمضى 5 سنوات فأكثر.", "إجازة الأمومة 10 أسابيع.", "إجازة الوفاة 5 أيام لوفاة الزوج أو الزوجة أو الأصول أو الفروع.", "إجازة الزواج 5 أيام."],
    procedures: ["تقديم طلب الإجازة", "اعتماد الإجازة من المدير المباشر", "تسجيل الإجازة في النظام", "إجراءات العودة من الإجازة"],
  },
  {
    id: "ch10", chapterNum: 10, ar: "رحلات العمل", en: "Business Trips", category: "إدارية",
    objectives: ["توضيح سياسات وإجراءات رحلات العمل والانتداب."],
    policies: ["رحلات العمل تكون بناءً على حاجة فعلية ومعتمدة من الإدارة.", "يتم صرف بدل الانتداب وفق الجدول المعتمد.", "يجب تقديم تقرير عن رحلة العمل بعد العودة."],
    procedures: ["طلب الانتداب", "اعتماد الانتداب", "صرف مستحقات الانتداب", "تقرير ما بعد الانتداب"],
  },
  {
    id: "ch11", chapterNum: 11, ar: "العمل الإضافي", en: "Overtime", category: "رواتب ومزايا",
    objectives: ["توضيح سياسات وإجراءات العمل الإضافي واحتسابه."],
    policies: ["العمل الإضافي يكون بموافقة مسبقة من المدير المختص.", "يُحتسب العمل الإضافي بمعدل 150% من الأجر الأساسي.", "لا يجوز تجاوز 10 ساعات إضافية في اليوم الواحد."],
    procedures: ["طلب الموافقة على العمل الإضافي", "تسجيل ساعات العمل الإضافي", "احتساب وصرف مستحقات العمل الإضافي"],
  },
  {
    id: "ch12", chapterNum: 12, ar: "الإجراءات الجزائية", en: "Disciplinary Actions", category: "تأديب",
    objectives: ["وضع إطار واضح للإجراءات الجزائية يضمن العدالة والشفافية."],
    policies: ["الجزاءات تُطبق بشكل متدرج وفق جسامة المخالفة.", "يحق للموظف الاطلاع على المخالفة المنسوبة إليه والدفاع عن نفسه.", "يجب توثيق جميع الجزاءات في ملف الموظف."],
    procedures: ["التحقيق في المخالفة", "إخطار الموظف بالمخالفة", "إصدار قرار الجزاء", "حق التظلم"],
  },
  {
    id: "ch13", chapterNum: 13, ar: "التظلم", en: "Complain", category: "تأديب",
    objectives: ["توفير قناة رسمية للموظفين لرفع تظلماتهم وشكاواهم."],
    policies: ["يحق لكل موظف رفع تظلم دون خوف من الانتقام.", "يجب البت في التظلمات خلال مدة محددة.", "سرية التظلمات مكفولة."],
    procedures: ["تقديم نموذج التظلم", "دراسة التظلم", "الرد على المتظلم", "إغلاق ملف التظلم"],
  },
  {
    id: "ch14", chapterNum: 14, ar: "تقييم الأداء", en: "Performance Appraisal", category: "أداء",
    objectives: ["وضع نظام موضوعي وشفاف لتقييم أداء الموظفين."],
    policies: ["يُجرى تقييم الأداء مرة واحدة على الأقل سنوياً.", "يشارك الموظف في عملية التقييم الذاتي.", "نتائج التقييم تؤثر على قرارات الترقية والزيادة."],
    procedures: ["نماذج التقييم", "كتابة التقييم", "معدلات الأداء", "التوزيع الإحصائي لمعدلات الأداء", "مناقشة تقييم الأداء"],
  },
  {
    id: "ch15", chapterNum: 15, ar: "إنهاء الخدمات", en: "Termination", category: "إنهاء خدمة",
    objectives: ["توضيح سياسات وإجراءات إنهاء الخدمات بشكل عادل وقانوني."],
    policies: ["إنهاء الخدمة يكون وفق أحكام نظام العمل السعودي.", "يجب إعطاء إشعار مسبق وفق المدة المحددة في العقد أو النظام.", "يُصدر للموظف شهادة خدمة عند انتهاء عمله."],
    procedures: ["مقتضيات إنهاء الخدمات", "إشعار إنهاء الخدمات", "تاريخ إنهاء الخدمات", "شهادة الخدمة", "مقابلة المغادرة"],
  },
  {
    id: "ch16", chapterNum: 16, ar: "مكافأة نهاية الخدمة", en: "End of Service Award", category: "رواتب ومزايا",
    objectives: ["توضيح سياسات وإجراءات احتساب ودفع مكافأة نهاية الخدمة."],
    policies: ["مكافأة نهاية الخدمة تُحتسب وفق نظام العمل السعودي.", "الموظف الذي أمضى أقل من سنتين لا يستحق مكافأة نهاية الخدمة.", "من أمضى من سنتين إلى أقل من 5 سنوات يستحق ثلث الأجر عن كل سنة.", "من أمضى من 5 إلى أقل من 10 سنوات يستحق ثلثي الأجر عن كل سنة.", "من أمضى 10 سنوات فأكثر يستحق أجراً كاملاً عن كل سنة."],
    procedures: ["الاستحقاق", "احتساب مقدار المكافأة", "دفع المكافأة الكاملة", "دفع المكافأة المخفضة", "وقت دفع مكافأة نهاية الخدمات"],
  },
  {
    id: "ch17", chapterNum: 17, ar: "إخلاء الطرف", en: "Out-Processing", category: "إنهاء خدمة",
    objectives: ["ضمان استيفاء جميع الالتزامات المالية والإدارية عند مغادرة الموظف."],
    policies: ["لا يُصرف للموظف مستحقاته إلا بعد إتمام إجراءات إخلاء الطرف.", "يجب إعادة جميع ممتلكات الشركة قبل المغادرة."],
    procedures: ["الالتزامات المالية غير المسددة", "خطوات إخلاء الطرف", "نموذج إخلاء الطرف"],
  },
  {
    id: "ch18", chapterNum: 18, ar: "العلاقات الحكومية", en: "Government Relations", category: "إدارية",
    objectives: ["توضيح إجراءات التعامل مع الجهات الحكومية وإدارة وثائق الموظفين."],
    policies: ["تتولى إدارة الموارد البشرية تنظيم جميع المعاملات الحكومية.", "يجب الحفاظ على سجل محدث لجميع الوثائق الهامة."],
    procedures: ["الحصول على تأشيرة الخروج والعودة", "الحصول على تأشيرة الخروج النهائي", "الحصول على تأشيرة الدخول لدول أخرى", "تجديد جواز السفر", "رخصة القيادة"],
  },
  {
    id: "ch19", chapterNum: 19, ar: "القروض", en: "Loans", category: "رواتب ومزايا",
    objectives: ["توضيح سياسات وإجراءات منح القروض للموظفين."],
    policies: ["القروض تُمنح وفق الأهلية والضوابط المحددة.", "يُخصم القرض من راتب الموظف على أقساط شهرية.", "يجب توفير ضامن للقروض التي تتجاوز حداً معيناً."],
    procedures: ["القرض الشخصي", "قرض شراء سيارة", "قرض الراتب", "المبلغ المحدد للقرض", "سداد القرض"],
  },
  {
    id: "ch20", chapterNum: 20, ar: "مواصلة التعليم", en: "Continue Education", category: "تدريب",
    objectives: ["دعم الموظفين في مواصلة تعليمهم وتطوير مهاراتهم."],
    policies: ["تدعم الشركة الموظفين الراغبين في مواصلة تعليمهم وفق الضوابط المحددة.", "يجب أن يكون التخصص مرتبطاً بطبيعة عمل الموظف.", "يُمنح الموظف مكافأة عند التخرج."],
    procedures: ["دعم الأنشطة التعليمية", "مسؤولية الموظف", "مسؤولية الرئيس المباشر", "مسؤولية إدارة الموارد البشرية", "مكافأة التخرج"],
  },
  {
    id: "ch21", chapterNum: 21, ar: "تخصيص هاتف الجوال", en: "Providing Mobile Phone", category: "إدارية",
    objectives: ["توضيح سياسات وإجراءات تخصيص هاتف الجوال للموظفين."],
    policies: ["يُخصص هاتف الجوال للموظفين الذين تستدعي طبيعة عملهم ذلك.", "تُحدد صلاحية تخصيص الهاتف من قبل الإدارة العليا."],
    procedures: ["الاستحقاق", "صلاحية تخصيص الهاتف الجوال", "قيمة الهاتف الجوال"],
  },
];

const polCatData = ["الكل", "توظيف", "رواتب ومزايا", "حضور وإجازات", "أداء", "تأديب", "تدريب", "إدارية", "إنهاء خدمة"];

const polCatColors: Record<string, string> = {
  "توظيف": "oklch(0.55 0.22 220)",
  "رواتب ومزايا": "oklch(0.55 0.18 145)",
  "حضور وإجازات": "oklch(0.55 0.20 55)",
  "أداء": "oklch(0.55 0.22 290)",
  "تأديب": "oklch(0.55 0.20 15)",
  "تدريب": "oklch(0.55 0.18 200)",
  "إدارية": "oklch(0.55 0.18 170)",
  "إنهاء خدمة": "oklch(0.55 0.18 30)",
};

// ─── Declarations ────────────────────────────────────────────────────────────

const declData = [
  { id: 1, title: "إقرار بعدم حجز أي ممتلكات للعامل", intro: "نقر نحن شركة ...................... سجل تجاري رقم (....................) بإخلاء مسؤليتنا تجاه أي ممتلكات تخص العامل حسب ما نص عليه نظام العمل.", items: [] as string[] },
  { id: 2, title: "إقرار بتحمل الرسوم المالية الملزمة على المنشأة تجاه العامل", intro: "نقر نحن شركة ............................. سجل تجاري رقم (.....................) بالتزامنا أداء الرسوم المالية المقررة علينا تجاه العامل وذلك حسب ما نص عليه نظام العمل.", items: [] },
  { id: 3, title: "إقرار بعدم تشغيل العامل سخرة", intro: "نقر نحن شركة ..................... سجل تجاري رقم (.............................) بعدم تشغيل العامل سخرة في أي حال من الأحوال ونقر بالالتزام بما أقره نظام العمل وما نص عليه البند.", items: [] },
  { id: 4, title: "إقرار بعدم ممارسة التمييز بين العاملين", intro: "نقر نحن شركة ........................... سجل تجاري رقم (..........................) بعدم القيام بأي ممارسات تؤدي إلى التمييز بين العاملين.", items: [] },
  { id: 5, title: "إقرار بالالتزام بقواعد الحماية والسلامة والصحة المهنية", intro: "نقر نحن شركة ............................. سجل تجاري رقم (...............................) بأنه تم اتخاذ الاحتياطات اللازمة لحماية العمّال من الأخطار والأمراض الناجمة عن العمل والآلات المستعملة ووقاية العمل وسلامته.", items: [] },
  { id: 6, title: "إقرار بتوفير خزانة أو أكثر للإسعافات الطبية", intro: "نقر نحن شركة .......................... سجل تجاري رقم (...........................) بتوفير خزانة أو أكثر للإسعافات الطبية مزوّدة بالأدوية وغيرها مما يلزم للإسعافات الطبية الأوّلية.", items: [] },
  { id: 7, title: "إقرار المنشأة بدفع أجور العاملين في مواعيد استحقاقها بالعملة الرسمية للبلاد", intro: "نقر نحن شركة.......................... سجل تجاري رقم (.............................) بدفع أجر العامل وكلّ مبلغ مستحق له بالعملة الرسميّة للبلاد عن طريق البنوك المعتمدة في مواعيد استحقاقها.", items: ["بدفع أجر العامل في ساعات العمل ومكانه طبقاً للأحكام المنصوصة في نظام العمل", "يتم صرف أجور العمّال باليومية مرّة كلّ أسبوع على الأقل", "يتم صرف أجور العمّال ذوي الأجور الشهرية مرّة في الشهر", "بدفع أجور العمال مرة كل أسبوع على الأقل في غير ما ذكر", "برفع ملف حماية الأجور بشكل شهري والالتزام بنسبة الامتثال المحددة من الوزارة"] },
  { id: 8, title: "إقرار المنشأة بإخبار العاملين بطرق الوقاية من مخاطر العمل", intro: "تقر نحن شركة ................................ سجل تجاري رقم (...................) بما يلي:", items: ["بأنه تم إخبار العامل بالأخطار المحيطة بعمله المباشر", "بأنه تم إلزام العامل باستعمال وسائل الوقاية المقررة له", "بأنه تم توفير معدات الوقاية الشخصية المناسبة للعاملين لديها", "بأنه تم تدريب العامل أو العمال على استخدام معدات الوقاية الشخصية"] },
  { id: 9, title: "إقرار بضمان عدم إساءة العامل استعمال الوسائل المعدة لحماية مقر العمل", intro: "نقر نحن شركة ....................... سجل تجاري رقم (.......................) بضمان عدم إساءة العامل استعمال الوسائل المعدة لحماية مقر العمل ولحماية سلامة وصحة العمال من تعطيل أو عدم اتباع التعليمات بما قد يؤثر على صحة العمال والمشتغلين معه وسلامتهم.", items: [] },
  { id: 10, title: "إقرار باتخاذ الاحتياطات اللازمة للوقاية من الحريق وتهيئة الوسائل الفنية لمكافحته", intro: "نقر نحن شركة ............................ سجل تجاري رقم (....................) باتخاذ الاحتياطات اللازمة للوقاية من الحريق وتهيئة الوسائل الفنيّة لمكافحته، بما في ذلك تأمين منافذ للنجاة وجعلها صالحة للاستعمال في أي وقت، وتعليق تعليمات مفصّلة بشأن وسائل منع الحريق في مكان ظاهر.", items: [] },
  { id: 11, title: "إقرار المنشأة بإخبار العاملين بطرق الوقاية من مخاطر العمل (نسخة موسعة)", intro: "تقر نحن شركة ........................ سجل تجاري رقم (..............................) بما يلي:", items: ["بأنه تم إخبار العامل بالأخطار المحيطة بعمله المباشر", "بأنه تم إلزام العامل باستعمال وسائل الوقاية المقررة له", "بأنه تم توفير معدات الوقاية الشخصية المناسبة للعاملين لديها", "بأنه تم تدريب العامل أو العمال على استخدام معدات الوقاية الشخصية"] },
  { id: 12, title: "إقرار بفتح ملف رئيسي لكل نشاط", intro: "تقر نحن شركة ........................... سجل تجاري رقم (........................) بما يلي:", items: ["بفتح ملف رئيسي لكل نشاط وملف مستقل لكل منطقة وتحديث الفروع عن طريق موقع الوزارة", "تحديد بيانات المسؤول عن كل فرع وعدد وأسماء العاملين الفعليين في كل فرع", "بعدم ممارسة نشاط يخالف النشاط المسجل في أنظمة الوزارة"] },
  { id: 13, title: "إقرار بمنح العاملين وأسرهم التأمين الطبي", intro: "تقر نحن شركة .............................سجل تجاري رقم (....................) بمنح العاملين وأسرهم (حسب نظام التأمين الصحي التعاوني الصحي) التأمين الطبي.", items: [] },
  { id: 14, title: "إقرار بتوفير مكان مخصص لجميع العاملين لأداء الصلاة والاستراحة ودورات المياه", intro: "نقر نحن شركة ...................... سجل تجاري رقم (....................) بتوفير مكان مخصص لجميع العاملين من الرجال والنساء لأداء الصلاة والاستراحة ودورات المياه وفق التنظيم الموحد لبيئة العمل.", items: [] },
];

const declarationsFileUrl = "/uploads/declarations-self-assessment_34fddc34.docx";

const TEMPLATE_CAT_EN: Record<string, string> = {
  "الكل": "All",
  "توظيف": "Recruitment",
  "أداء": "Performance",
  "رواتب": "Salaries",
  "حضور وإجازات": "Attendance & Leave",
  "تأديب": "Discipline",
  "نقل وانتداب": "Transfer & Delegation",
  "مزايا": "Benefits",
  "تدريب": "Training",
  "خدمات حكومية": "Government Services",
  "إدارية": "Administrative",
  "إنهاء خدمة": "End of Service",
};

const POLICY_CAT_EN: Record<string, string> = {
  "الكل": "All",
  "توظيف": "Recruitment",
  "رواتب ومزايا": "Salaries & Benefits",
  "حضور وإجازات": "Attendance & Leave",
  "أداء": "Performance",
  "تأديب": "Discipline",
  "تدريب": "Training",
  "إدارية": "Administrative",
  "إنهاء خدمة": "End of Service",
};

async function tr(db: MySql2Database<any>, entityType: string, entityId: number, lang: string, field: string, value: string) {
  await db.insert(translations).values({ entityType, entityId, lang, field, value });
}

export async function seedContent(db: MySql2Database<any>) {
  console.log("📄 Seeding content...");

  // idempotent: clear owned rows (children, translations, then parents) before re-inserting
  await db.delete(translations).where(
    inArray(translations.entityType, [
      "hr_category", "hr_source", "hr_image", "update_source",
      "template_category", "hr_form", "policy_category", "policy", "declaration",
    ]),
  );
  await db.delete(hrSources);
  await db.delete(hrImages);
  await db.delete(updateSources);
  await db.delete(hrForms);
  await db.delete(policies);
  await db.delete(declarations);
  await db.delete(hrCategories);
  await db.delete(templateCategories);
  await db.delete(policyCategories);

  // ── HR Categories ──
  const catIdMap: Record<string, number> = {};
  for (let i = 0; i < hrCatData.length; i++) {
    const cat = hrCatData[i];
    if (cat.id === "all") continue;
    const [result] = await db.insert(hrCategories).values({
      code: cat.id, color: cat.color, icon: cat.icon, sortOrder: i,
    });
    const id = Number(result.insertId);
    catIdMap[cat.id] = id;
    await tr(db, "hr_category", id, "ar", "name", cat.labelAr);
    await tr(db, "hr_category", id, "en", "name", cat.labelEn);
  }

  // ── HR Sources ──
  for (let i = 0; i < hrSrcData.length; i++) {
    const src = hrSrcData[i];
    const [result] = await db.insert(hrSources).values({
      code: src.id,
      categoryId: catIdMap[src.category] ?? 0,
      url: src.url,
      color: src.color,
      sortOrder: i,
    });
    const id = Number(result.insertId);
    await tr(db, "hr_source", id, "ar", "title", src.titleAr);
  }

  // ── HR Images ──
  for (let i = 0; i < hrImgData.length; i++) {
    const img = hrImgData[i];
    const [result] = await db.insert(hrImages).values({
      code: img.id, url: img.url, sortOrder: i,
    });
    const id = Number(result.insertId);
    await tr(db, "hr_image", id, "ar", "title", img.titleAr);
  }

  // ── Update Sources ──
  for (let i = 0; i < updateSrcData.length; i++) {
    const src = updateSrcData[i];
    const [result] = await db.insert(updateSources).values({
      code: src.id, url: src.url, type: src.type, color: src.color, sortOrder: i,
    });
    const id = Number(result.insertId);
    await tr(db, "update_source", id, "ar", "title", src.titleAr);
    await tr(db, "update_source", id, "en", "title", src.titleEn);
    await tr(db, "update_source", id, "ar", "description", src.descAr);
    await tr(db, "update_source", id, "en", "description", src.descEn);
  }

  // ── Template Categories ──
  const tmplCatIdMap: Record<string, number> = {};
  for (let i = 0; i < tmplCatData.length; i++) {
    const catName = tmplCatData[i];
    const [result] = await db.insert(templateCategories).values({
      code: catName, icon: tmplCatIcons[catName] ?? "📄", sortOrder: i,
    });
    const id = Number(result.insertId);
    tmplCatIdMap[catName] = id;
    await tr(db, "template_category", id, "ar", "name", catName);
    await tr(db, "template_category", id, "en", "name", TEMPLATE_CAT_EN[catName] ?? catName);
  }

  // ── HR Forms ──
  for (let i = 0; i < hrFormData.length; i++) {
    const form = hrFormData[i];
    const [result] = await db.insert(hrForms).values({
      code: form.code,
      categoryId: tmplCatIdMap[form.category] ?? 0,
      fileUrl: form.file,
      ext: form.ext,
      sortOrder: i,
    });
    const id = Number(result.insertId);
    await tr(db, "hr_form", id, "ar", "name", form.ar);
    await tr(db, "hr_form", id, "en", "name", form.en);
  }

  // ── Policy Categories ──
  const polCatIdMap: Record<string, number> = {};
  for (let i = 0; i < polCatData.length; i++) {
    const catName = polCatData[i];
    if (catName === "الكل") continue;
    const color = polCatColors[catName] ?? "oklch(0.55 0.18 180)";
    const [result] = await db.insert(policyCategories).values({
      code: catName, color, sortOrder: i,
    });
    const id = Number(result.insertId);
    polCatIdMap[catName] = id;
    await tr(db, "policy_category", id, "ar", "name", catName);
    await tr(db, "policy_category", id, "en", "name", POLICY_CAT_EN[catName] ?? catName);
  }

  // ── Policies ──
  for (let i = 0; i < policyData.length; i++) {
    const pol = policyData[i];
    const [result] = await db.insert(policies).values({
      code: pol.id,
      chapterNum: pol.chapterNum,
      categoryId: polCatIdMap[pol.category] ?? 0,
      objectives: JSON.stringify(pol.objectives),
      policiesData: JSON.stringify(pol.policies),
      proceduresData: JSON.stringify(pol.procedures),
      sortOrder: i,
    });
    const id = Number(result.insertId);
    await tr(db, "policy", id, "ar", "name", pol.ar);
    await tr(db, "policy", id, "en", "name", pol.en);
  }

  // ── Declarations ──
  for (let i = 0; i < declData.length; i++) {
    const decl = declData[i];
    const [result] = await db.insert(declarations).values({
      sortOrder: i,
      items: JSON.stringify(decl.items),
      fileUrl: declarationsFileUrl,
    });
    const id = Number(result.insertId);
    await tr(db, "declaration", id, "ar", "title", decl.title);
    await tr(db, "declaration", id, "ar", "intro", decl.intro);
  }

  console.log("   ✓ Content seeded (categories, sources, images, updates, templates, policies, declarations)");
}
