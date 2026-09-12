import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";
// ── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    name: text("name"),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    resetToken: varchar("resetToken", { length: 128 }),
    resetTokenExpires: timestamp("resetTokenExpires"),
    refreshToken: varchar("refreshToken", { length: 128 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
    disabled: boolean("disabled").default(false).notNull(),
});
// ── Sessions (Anti-sharing) ──────────────────────────────────────────────────
export const sessions = mysqlTable("sessions", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    tokenHash: varchar("tokenHash", { length: 128 }).notNull(),
    deviceName: varchar("deviceName", { length: 200 }).default("Unknown"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lastActiveAt: timestamp("lastActiveAt").defaultNow().notNull(),
});
// ── Translations (central bilingual store) ───────────────────────────────────
export const translations = mysqlTable("translations", {
    id: int("id").autoincrement().primaryKey(),
    entityType: varchar("entityType", { length: 100 }).notNull(),
    entityId: int("entityId").notNull(),
    lang: varchar("lang", { length: 5 }).notNull(),
    field: varchar("field", { length: 100 }).notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
    unique("unique_translation").on(t.entityType, t.entityId, t.lang, t.field),
]);
// ── HR Categories ────────────────────────────────────────────────────────────
export const hrCategories = mysqlTable("hr_categories", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 100 }).notNull(),
    icon: varchar("icon", { length: 10 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── HR Sources (explainer PDFs) ──────────────────────────────────────────────
export const hrSources = mysqlTable("hr_sources", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    categoryId: int("categoryId").notNull(),
    url: text("url").notNull(),
    color: varchar("color", { length: 100 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── HR Images ────────────────────────────────────────────────────────────────
export const hrImages = mysqlTable("hr_images", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    url: text("url").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Update Sources (laws & regulations) ──────────────────────────────────────
export const updateSources = mysqlTable("update_sources", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    url: text("url").notNull(),
    type: varchar("type", { length: 10 }).notNull().default("pdf"),
    color: varchar("color", { length: 100 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Template Categories ──────────────────────────────────────────────────────
export const templateCategories = mysqlTable("template_categories", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    icon: varchar("icon", { length: 10 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── HR Forms (templates) ────────────────────────────────────────────────────
export const hrForms = mysqlTable("hr_forms", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    categoryId: int("categoryId").notNull(),
    fileUrl: text("fileUrl").notNull(),
    ext: varchar("ext", { length: 10 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Policy Categories ────────────────────────────────────────────────────────
export const policyCategories = mysqlTable("policy_categories", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 100 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Policies ─────────────────────────────────────────────────────────────────
export const policies = mysqlTable("policies", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    chapterNum: int("chapterNum").notNull(),
    categoryId: int("categoryId").notNull(),
    objectives: text("objectives"),
    policiesData: text("policiesData"),
    proceduresData: text("proceduresData"),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Declarations ─────────────────────────────────────────────────────────────
export const declarations = mysqlTable("declarations", {
    id: int("id").autoincrement().primaryKey(),
    sortOrder: int("sortOrder").default(0).notNull(),
    items: text("items"),
    fileUrl: text("fileUrl"),
});
// ── HC KPI Categories ───────────────────────────────────────────────────────
export const hcKpiCategories = mysqlTable("hc_kpi_categories", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 100 }).notNull(),
    icon: varchar("icon", { length: 10 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── HC Built-in Indicators ──────────────────────────────────────────────────
export const hcBuiltinIndicators = mysqlTable("hc_builtin_indicators", {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    categoryId: int("categoryId").notNull(),
    unit: varchar("unit", { length: 30 }),
    higherIsBetter: int("higherIsBetter").default(1),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Departments ──────────────────────────────────────────────────────────────
export const departments = mysqlTable("departments", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Job Descriptions ────────────────────────────────────────────────────────
export const jobDescriptions = mysqlTable("job_descriptions", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    departmentId: int("departmentId").notNull(),
    level: varchar("level", { length: 30 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Ministerial Sectors ─────────────────────────────────────────────────────
export const ministerialSectors = mysqlTable("ministerial_sectors", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    decisionNumber: varchar("decisionNumber", { length: 100 }),
    decisionDate: varchar("decisionDate", { length: 20 }),
    saudizationPercentage: varchar("saudizationPercentage", { length: 20 }),
    minWage: varchar("minWage", { length: 50 }),
    minEmployees: int("minEmployees"),
    excludedProfessions: text("excludedProfessions"),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Ministerial Professions ─────────────────────────────────────────────────
export const ministerialProfessions = mysqlTable("ministerial_professions", {
    id: int("id").autoincrement().primaryKey(),
    sectorId: int("sectorId").notNull(),
    code: varchar("code", { length: 50 }),
    minWage: varchar("minWage", { length: 50 }),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Ministerial Phases ──────────────────────────────────────────────────────
export const ministerialPhases = mysqlTable("ministerial_phases", {
    id: int("id").autoincrement().primaryKey(),
    sectorId: int("sectorId").notNull(),
    percentage: varchar("percentage", { length: 20 }),
    date: varchar("date", { length: 20 }),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Quiz Categories ─────────────────────────────────────────────────────────
export const quizCategories = mysqlTable("quiz_categories", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 100 }),
    bgColor: varchar("bgColor", { length: 100 }),
    borderColor: varchar("borderColor", { length: 100 }),
    icon: varchar("icon", { length: 10 }),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Quiz Questions ──────────────────────────────────────────────────────────
export const quizQuestions = mysqlTable("quiz_questions", {
    id: int("id").autoincrement().primaryKey(),
    categoryId: int("categoryId").notNull(),
    correctAnswer: int("correctAnswer").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── HC Organizations ────────────────────────────────────────────────────────
export const hcOrganizations = mysqlTable("hc_organizations", {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 100 }).notNull(),
    industry: varchar("industry", { length: 100 }),
    size: mysqlEnum("size", ["small", "medium", "large"]).default("medium"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ── HC Reports ──────────────────────────────────────────────────────────────
export const hcReports = mysqlTable("hc_reports", {
    id: int("id").autoincrement().primaryKey(),
    organizationId: int("organizationId").notNull(),
    userId: varchar("userId", { length: 100 }).notNull(),
    periodType: mysqlEnum("periodType", ["monthly", "quarterly"]).default("quarterly").notNull(),
    periodLabel: varchar("periodLabel", { length: 50 }).notNull(),
    periodStart: varchar("periodStart", { length: 20 }).notNull(),
    periodEnd: varchar("periodEnd", { length: 20 }).notNull(),
    status: mysqlEnum("status", ["draft", "completed"]).default("draft").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ── HC KPI Entries ──────────────────────────────────────────────────────────
export const hcKpiEntries = mysqlTable("hc_kpi_entries", {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("reportId").notNull(),
    indicatorKey: varchar("indicatorKey", { length: 100 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    currentValue: decimal("currentValue", { precision: 12, scale: 2 }),
    currentValueText: text("currentValueText"),
    unit: varchar("unit", { length: 30 }),
    benchmark: text("benchmark"),
    targetValue: decimal("targetValue", { precision: 12, scale: 2 }),
    targetDate: varchar("targetDate", { length: 20 }),
    initiative: text("initiative"),
    initiativeDate: varchar("initiativeDate", { length: 20 }),
    performanceScore: decimal("performanceScore", { precision: 5, scale: 2 }),
    trafficLight: mysqlEnum("trafficLight", ["green", "yellow", "red", "grey"]).default("grey"),
    isCustom: int("isCustom").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ── Subscription Plans ──────────────────────────────────────────────────────
export const subscriptionPlans = mysqlTable("subscription_plans", {
    id: int("id").autoincrement().primaryKey(),
    priceMonthly: decimal("priceMonthly", { precision: 10, scale: 2 }).notNull(),
    priceYearly: decimal("priceYearly", { precision: 10, scale: 2 }).notNull(),
    features: text("features"),
    active: int("active").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ── User Subscriptions ──────────────────────────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    planId: int("planId").notNull(),
    status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
    type: mysqlEnum("type", ["monthly", "yearly"]).default("monthly").notNull(),
    startDate: timestamp("startDate").defaultNow().notNull(),
    endDate: timestamp("endDate").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ── Support Tickets ─────────────────────────────────────────────────────────
export const supportTickets = mysqlTable("support_tickets", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    subject: varchar("subject", { length: 300 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
    status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ── Ticket Messages ─────────────────────────────────────────────────────────
export const ticketMessages = mysqlTable("ticket_messages", {
    id: int("id").autoincrement().primaryKey(),
    ticketId: int("ticketId").notNull(),
    userId: int("userId").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
// ── Saudization Rules (CalculatorPage) ───────────────────────────────────────
export const saudizationRules = mysqlTable("saudization_rules", {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    requiredPercentage: int("requiredPercentage"),
    minEmployees: int("minEmployees").default(1),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// ── Normalized public site content ───────────────────────────────────────────
export const siteHomeServices = mysqlTable("site_home_services", {
    id: int("id").autoincrement().primaryKey(), serviceId: varchar("serviceId", { length: 100 }).notNull().unique(), path: varchar("path", { length: 255 }).notNull(),
    titleAr: text("titleAr").notNull(), titleEn: text("titleEn").notNull(), subAr: text("subAr").notNull(), subEn: text("subEn").notNull(), descAr: text("descAr").notNull(), descEn: text("descEn").notNull(), badgeAr: text("badgeAr"), badgeEn: text("badgeEn"), externalUrl: text("externalUrl"), sortOrder: int("sortOrder").default(0).notNull(),
});
export const siteAboutCertifications = mysqlTable("site_about_certifications", { id: int("id").autoincrement().primaryKey(), value: text("value").notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteAboutStats = mysqlTable("site_about_stats", { id: int("id").autoincrement().primaryKey(), value: text("value").notNull(), labelAr: text("labelAr").notNull(), labelEn: text("labelEn").notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteAboutCourses = mysqlTable("site_about_courses", { id: int("id").autoincrement().primaryKey(), labelAr: text("labelAr").notNull(), labelEn: text("labelEn").notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteAboutContacts = mysqlTable("site_about_contacts", { id: int("id").autoincrement().primaryKey(), labelAr: text("labelAr").notNull(), labelEn: text("labelEn").notNull(), valueAr: text("valueAr"), valueEn: text("valueEn"), value: text("value"), hrefType: varchar("hrefType", { length: 30 }), href: text("href"), color: varchar("color", { length: 100 }).notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteResourceDecisions = mysqlTable("site_resource_decisions", { id: int("id").autoincrement().primaryKey(), year: varchar("year", { length: 10 }).notNull(), title: text("title").notNull(), badge: text("badge").notNull(), description: text("description").notNull(), date: text("date").notNull(), href: text("href").notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteResourceLinks = mysqlTable("site_resource_links", { id: int("id").autoincrement().primaryKey(), label: text("label").notNull(), description: text("description").notNull(), href: text("href").notNull(), color: varchar("color", { length: 100 }).notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteResourceQuestions = mysqlTable("site_resource_questions", { id: int("id").autoincrement().primaryKey(), question: text("question").notNull(), yes: text("yes").notNull(), no: text("no").notNull(), risk: varchar("risk", { length: 20 }).notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteFaqCategories = mysqlTable("site_faq_categories", { id: int("id").autoincrement().primaryKey(), category: text("category").notNull(), icon: varchar("icon", { length: 20 }).notNull(), sortOrder: int("sortOrder").default(0).notNull() });
export const siteFaqQuestions = mysqlTable("site_faq_questions", { id: int("id").autoincrement().primaryKey(), categoryId: int("categoryId").notNull(), question: text("question").notNull(), answer: text("answer").notNull(), sortOrder: int("sortOrder").default(0).notNull() });
// ── Site Config (key-value pairs for centralized site settings) ───────────────
export const siteConfig = mysqlTable("site_config", {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value").notNull(),
});
// ── Normalized module content (migrated out of site_content JSON) ──────────────
export const employeeMarketData = mysqlTable("employee_market_data", {
    id: int("id").autoincrement().primaryKey(),
    title: text("title").notNull(),
    sector: text("sector").notNull(),
    min: int("min").notNull(),
    avg: int("avg").notNull(),
    max: int("max").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const hrCostSections = mysqlTable("hr_cost_sections", {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 30 }).notNull().unique(),
    title: text("title").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const hrCostItems = mysqlTable("hr_cost_items", {
    id: int("id").autoincrement().primaryKey(),
    sectionId: int("sectionId").notNull(),
    itemId: varchar("itemId", { length: 50 }).notNull(),
    label: text("label").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const leaveTypes = mysqlTable("leave_types", {
    id: int("id").autoincrement().primaryKey(),
    value: varchar("value", { length: 50 }).notNull().unique(),
    labelAr: text("labelAr").notNull(),
    labelEn: text("labelEn").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const sectorBenchmarks = mysqlTable("sector_benchmarks", {
    id: int("id").autoincrement().primaryKey(),
    sectorId: varchar("sectorId", { length: 50 }).notNull().unique(),
    ar: text("ar").notNull(),
    en: text("en").notNull(),
    annual: varchar("annual", { length: 20 }).notNull(),
    desc: text("desc").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const jobBenchmarks = mysqlTable("job_benchmarks", {
    id: int("id").autoincrement().primaryKey(),
    jobId: varchar("jobId", { length: 50 }).notNull().unique(),
    ar: text("ar").notNull(),
    en: text("en").notNull(),
    annual: varchar("annual", { length: 20 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const trainingDecisions = mysqlTable("training_decisions", {
    id: int("id").autoincrement().primaryKey(),
    num: varchar("num", { length: 10 }).notNull(),
    ar: text("ar").notNull(),
    en: text("en").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const trainingSectors = mysqlTable("training_sectors", {
    id: int("id").autoincrement().primaryKey(),
    ar: text("ar").notNull(),
    en: text("en").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const disclosurePoints = mysqlTable("disclosure_points", {
    id: int("id").autoincrement().primaryKey(),
    num: varchar("num", { length: 10 }).notNull(),
    titleAr: text("titleAr").notNull(),
    titleEn: text("titleEn").notNull(),
    textAr: text("textAr").notNull(),
    textEn: text("textEn").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
// Calculator
export const professionCategories = mysqlTable("profession_categories", {
    id: varchar("id", { length: 50 }).notNull().primaryKey(),
    label: text("label").notNull(),
    required: int("required"),
    note: text("note").notNull(),
    examples: text("examples").notNull(),
    minWage: varchar("minWage", { length: 50 }),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const professionCategoryJobs = mysqlTable("profession_category_jobs", {
    id: int("id").autoincrement().primaryKey(),
    categoryId: varchar("categoryId", { length: 50 }).notNull(),
    name: text("name").notNull(),
    minWage: int("minWage").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const professionCategoryPhases = mysqlTable("profession_category_phases", {
    id: int("id").autoincrement().primaryKey(),
    categoryId: varchar("categoryId", { length: 50 }).notNull(),
    date: varchar("date", { length: 50 }).notNull(),
    rate: int("rate").notNull(),
    label: text("label").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const activities2026 = mysqlTable("activities_2026", {
    id: int("id").autoincrement().primaryKey(),
    name: text("name").notNull(),
    mLow: decimal("m_low", { precision: 8, scale: 3 }).notNull(),
    mMid: decimal("m_mid", { precision: 8, scale: 3 }).notNull(),
    mHigh: decimal("m_high", { precision: 8, scale: 3 }).notNull(),
    mPlat: decimal("m_plat", { precision: 8, scale: 3 }).notNull(),
    thLow: decimal("th_low", { precision: 8, scale: 3 }).notNull(),
    thMid: decimal("th_mid", { precision: 8, scale: 3 }).notNull(),
    thHigh: decimal("th_high", { precision: 8, scale: 3 }).notNull(),
    thPlat: decimal("th_plat", { precision: 8, scale: 3 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const gosiRateYears = mysqlTable("gosi_rate_years", {
    id: int("id").autoincrement().primaryKey(),
    year: varchar("year", { length: 4 }).notNull().unique(),
    employee: decimal("employee", { precision: 5, scale: 2 }).notNull(),
    employer: decimal("employer", { precision: 5, scale: 2 }).notNull(),
    saned: decimal("saned", { precision: 5, scale: 2 }).notNull(),
});
export const gosiRateMeta = mysqlTable("gosi_rate_meta", {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 50 }).notNull().unique(),
    value: decimal("value", { precision: 6, scale: 2 }).notNull(),
});
export const terminationOptions = mysqlTable("termination_options", {
    id: int("id").autoincrement().primaryKey(),
    value: varchar("value", { length: 50 }).notNull(),
    labelAr: text("labelAr").notNull(),
    labelEn: text("labelEn").notNull(),
    group: varchar("group", { length: 30 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const terminationGroupLabels = mysqlTable("termination_group_labels", {
    id: int("id").autoincrement().primaryKey(),
    group: varchar("group", { length: 30 }).notNull().unique(),
    ar: text("ar").notNull(),
    en: text("en").notNull(),
});
export const terminationNoEntitlement = mysqlTable("termination_no_entitlement", {
    id: int("id").autoincrement().primaryKey(),
    reason: varchar("reason", { length: 60 }).notNull(),
});
export const nationalityRulesNationalities = mysqlTable("nationality_rules_nationalities", {
    id: varchar("id", { length: 50 }).notNull().primaryKey(),
    labelAr: text("labelAr").notNull(),
    labelEn: text("labelEn").notNull(),
    maxRatio: int("maxRatio"),
    isRestricted: boolean("isRestricted").default(false).notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    flag: varchar("flag", { length: 10 }).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
});
export const nationalityRulesSizeThresholds = mysqlTable("nationality_rules_size_thresholds", {
    id: int("id").autoincrement().primaryKey(),
    tier: varchar("tier", { length: 20 }).notNull().unique(),
    maxWorkers: int("maxWorkers"),
    nonRestrictedMax: int("nonRestrictedMax"),
});
