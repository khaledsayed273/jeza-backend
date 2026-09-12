import type { MySql2Database } from "drizzle-orm/mysql2";
import {
  siteHomeServices,
  siteAboutCertifications,
  siteAboutStats,
  siteAboutCourses,
  siteAboutContacts,
  siteResourceDecisions,
  siteResourceLinks,
  siteResourceQuestions,
  siteFaqCategories,
  siteFaqQuestions,
} from "../../drizzle/schema";
import {
  HOME_SERVICES,
  ABOUT_CERTIFICATIONS,
  ABOUT_STATS,
  ABOUT_COURSES,
  ABOUT_CONTACTS,
} from "./hrEmployee.seed";
import {
  RESOURCES_DECISIONS,
  RESOURCES_OFFICIAL_LINKS,
  RESOURCES_COMPLIANCE_QUESTIONS,
  FAQ_CATEGORIES,
} from "./siteConstants.seed";

export async function seedSite(db: MySql2Database<any>) {
  console.log("  → Seeding normalized public site tables...");

  await db.delete(siteHomeServices);
  await db.insert(siteHomeServices).values(
    HOME_SERVICES.map((x, i) => ({
      serviceId: x.id,
      path: x.path,
      titleAr: x.titleAr,
      titleEn: x.titleEn,
      subAr: x.subAr,
      subEn: x.subEn,
      descAr: x.descAr,
      descEn: x.descEn,
      badgeAr: x.badgeAr ?? null,
      badgeEn: x.badgeEn ?? null,
      externalUrl: x.externalUrl ?? null,
      sortOrder: i,
    })),
  );

  await db.delete(siteAboutCertifications);
  await db.insert(siteAboutCertifications).values(ABOUT_CERTIFICATIONS.map((v, i) => ({ value: v, sortOrder: i })));

  await db.delete(siteAboutStats);
  await db.insert(siteAboutStats).values(
    ABOUT_STATS.map((x, i) => ({ value: x.value, labelAr: x.labelAr, labelEn: x.labelEn, sortOrder: i })),
  );

  await db.delete(siteAboutCourses);
  await db.insert(siteAboutCourses).values(
    ABOUT_COURSES.map((x, i) => ({ labelAr: x.labelAr, labelEn: x.labelEn, sortOrder: i })),
  );

  await db.delete(siteAboutContacts);
  await db.insert(siteAboutContacts).values(
    ABOUT_CONTACTS.map((x, i) => ({
      labelAr: String(x.labelAr),
      labelEn: String(x.labelEn),
      valueAr: x.valueAr ?? null,
      valueEn: x.valueEn ?? null,
      value: x.value ?? null,
      hrefType: x.hrefType ?? null,
      href: x.href ?? null,
      color: String(x.color),
      sortOrder: i,
    })),
  );

  const decisionRows: any[] = [];
  let gi = 0;
  for (const [year, items] of Object.entries<any>(RESOURCES_DECISIONS)) {
    for (const d of items) {
      decisionRows.push({ year, title: d.title, badge: d.badge, description: d.desc, date: d.date, href: d.href, sortOrder: gi++ });
    }
  }
  await db.delete(siteResourceDecisions);
  if (decisionRows.length) await db.insert(siteResourceDecisions).values(decisionRows);

  await db.delete(siteResourceLinks);
  await db.insert(siteResourceLinks).values(
    RESOURCES_OFFICIAL_LINKS.map((x, i) => ({ label: x.label, description: x.desc, href: x.href, color: String(x.color), sortOrder: i })),
  );

  await db.delete(siteResourceQuestions);
  await db.insert(siteResourceQuestions).values(
    RESOURCES_COMPLIANCE_QUESTIONS.map((x, i) => ({ question: x.question, yes: x.yes, no: x.no, risk: String(x.risk), sortOrder: i })),
  );

  await db.delete(siteFaqQuestions);
  await db.delete(siteFaqCategories);
  for (const [i, cat] of (FAQ_CATEGORIES as any[]).entries()) {
    const res: any = await db.insert(siteFaqCategories).values({ category: cat.category, icon: String(cat.icon), sortOrder: i });
    const categoryId = Number(res[0].insertId);
    if (cat.questions?.length) {
      await db.insert(siteFaqQuestions).values(
        cat.questions.map((q: any, qi: number) => ({ categoryId, question: q.q, answer: q.a, sortOrder: qi })),
      );
    }
  }

  console.log("    ✓ site_home_services / about_* / resources_* / faq_*");
}
