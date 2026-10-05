import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

// ── Normalized public site content ───────────────────────────────────────────

export const siteHomeServices = mysqlTable("site_home_services", {
  id: int("id").autoincrement().primaryKey(), serviceId: varchar("serviceId", { length: 100 }).notNull().unique(), path: varchar("path", { length: 255 }).notNull(),
  titleAr: text("titleAr").notNull(), titleEn: text("titleEn").notNull(), subAr: text("subAr").notNull(), subEn: text("subEn").notNull(), descAr: text("descAr").notNull(), descEn: text("descEn").notNull(), badgeAr: text("badgeAr"), badgeEn: text("badgeEn"), externalUrl: text("externalUrl"), sortOrder: int("sortOrder").default(0).notNull(),
});
export type SiteHomeService = typeof siteHomeServices.$inferSelect;
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

export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = typeof siteConfig.$inferInsert;
