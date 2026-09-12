import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { siteHomeServices, siteAboutCertifications, siteAboutStats, siteAboutCourses, siteAboutContacts, siteResourceDecisions, siteResourceLinks, siteResourceQuestions, siteFaqCategories, siteFaqQuestions } from "../../../drizzle/schema";

export type HomeService = {
  id: string;
  path: string;
  titleAr: string;
  titleEn: string;
  subAr: string;
  subEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string | null;
  badgeEn: string | null;
  externalUrl?: string;
};

export type AboutStat = { value: string; labelAr: string; labelEn: string };
export type AboutContact = {
  labelAr: string;
  labelEn: string;
  valueAr?: string | null;
  valueEn?: string | null;
  value?: string | null;
  hrefType?: string | null;
  href?: string | null;
  color: string;
};

export type AboutContent = {
  certifications: string[];
  stats: AboutStat[];
  courses: Array<{ labelAr: string; labelEn: string }>;
  contacts: AboutContact[];
};

export type ResourceDecision = { title: string; badge: string; desc: string; date: string; href: string };
export type ResourcesContent = {
  decisions: Record<string, ResourceDecision[]>;
  complianceQuestions: Array<{ question: string; yes: string; no: string; risk: string }>;
  officialLinks: Array<{ label: string; desc: string; href: string; color: string }>;
};

export type FaqContent = Array<{ category: string; icon: string; questions: Array<{ q: string; a: string }> }>;

export async function getHomeContent(): Promise<HomeService[]> {
  const rows = await getDb().select().from(siteHomeServices).orderBy(asc(siteHomeServices.sortOrder));
  return rows.map(({ id, serviceId, sortOrder, ...row }) => ({
    ...row,
    id: serviceId,
    externalUrl: row.externalUrl ?? undefined,
  }));
}

export async function getAboutContent(): Promise<AboutContent> {
  const db = getDb();
  const [cert, stats, courses, contacts] = await Promise.all([
    db.select().from(siteAboutCertifications).orderBy(asc(siteAboutCertifications.sortOrder)),
    db.select().from(siteAboutStats).orderBy(asc(siteAboutStats.sortOrder)),
    db.select().from(siteAboutCourses).orderBy(asc(siteAboutCourses.sortOrder)),
    db.select().from(siteAboutContacts).orderBy(asc(siteAboutContacts.sortOrder)),
  ]);
  return {
    certifications: cert.map((x) => x.value),
    stats: stats.map(({ id, sortOrder, ...x }) => x),
    courses: courses.map(({ id, sortOrder, ...x }) => x),
    contacts: contacts.map(({ id, sortOrder, ...x }) => x),
  };
}

export async function getResourcesContent(): Promise<ResourcesContent> {
  const db = getDb();
  const [decisions, links, questions] = await Promise.all([
    db.select().from(siteResourceDecisions).orderBy(asc(siteResourceDecisions.sortOrder)),
    db.select().from(siteResourceLinks).orderBy(asc(siteResourceLinks.sortOrder)),
    db.select().from(siteResourceQuestions).orderBy(asc(siteResourceQuestions.sortOrder)),
  ]);
  const grouped: Record<string, ResourceDecision[]> = {};
  for (const row of decisions) {
    const { id, sortOrder, year, description, ...item } = row;
    (grouped[year] ??= []).push({ ...item, desc: description });
  }
  return {
    decisions: grouped,
    officialLinks: links.map(({ id, sortOrder, description, ...x }) => ({ ...x, desc: description })),
    complianceQuestions: questions.map(({ id, sortOrder, ...x }) => x),
  };
}

export async function getFaqContent(): Promise<FaqContent> {
  const db = getDb();
  const categories = await db.select().from(siteFaqCategories).orderBy(asc(siteFaqCategories.sortOrder));
  const questions = await db.select().from(siteFaqQuestions).orderBy(asc(siteFaqQuestions.sortOrder));
  return categories.map(({ id, sortOrder, category, icon }) => ({
    category,
    icon,
    questions: questions
      .filter((q) => q.categoryId === id)
      .map(({ id: qid, sortOrder: qsort, categoryId, question, answer }) => ({ q: question, a: answer })),
  }));
}

export async function replaceSiteSection(section: "home" | "about" | "resources" | "faq", input: unknown) {
  const db = getDb();
  await db.transaction(async (tx) => {
    if (section === "home") {
      const rows = input as HomeService[];
      await tx.delete(siteHomeServices);
      if (rows.length) {
        await tx.insert(siteHomeServices).values(
          rows.map((x, i) => ({
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
      }
    }
    if (section === "about") {
      const x = input as AboutContent;
      await tx.delete(siteAboutCertifications);
      await tx.delete(siteAboutStats);
      await tx.delete(siteAboutCourses);
      await tx.delete(siteAboutContacts);
      if (x.certifications.length) {
        await tx.insert(siteAboutCertifications).values(x.certifications.map((value, sortOrder) => ({ value, sortOrder })));
      }
      if (x.stats.length) {
        await tx.insert(siteAboutStats).values(x.stats.map((v, sortOrder) => ({ ...v, sortOrder })));
      }
      if (x.courses.length) {
        await tx.insert(siteAboutCourses).values(x.courses.map((v, sortOrder) => ({ ...v, sortOrder })));
      }
      if (x.contacts.length) {
        await tx.insert(siteAboutContacts).values(
          x.contacts.map((v, sortOrder) => ({
            labelAr: String(v.labelAr),
            labelEn: String(v.labelEn),
            valueAr: v.valueAr ?? null,
            valueEn: v.valueEn ?? null,
            value: v.value ?? null,
            hrefType: v.hrefType ?? null,
            href: v.href ?? null,
            color: String(v.color),
            sortOrder,
          })),
        );
      }
    }
    if (section === "resources") {
      const x = input as ResourcesContent;
      await tx.delete(siteResourceDecisions);
      await tx.delete(siteResourceLinks);
      await tx.delete(siteResourceQuestions);
      const decisions = Object.entries(x.decisions).flatMap(([year, values]) =>
        values.map((v, sortOrder) => ({
          year,
          title: v.title,
          badge: v.badge,
          description: v.desc,
          date: v.date,
          href: v.href,
          sortOrder,
        })),
      );
      if (decisions.length) await tx.insert(siteResourceDecisions).values(decisions);
      if (x.officialLinks.length) {
        await tx.insert(siteResourceLinks).values(
          x.officialLinks.map((v, sortOrder) => ({ label: v.label, description: v.desc, href: v.href, color: v.color, sortOrder })),
        );
      }
      if (x.complianceQuestions.length) {
        await tx.insert(siteResourceQuestions).values(
          x.complianceQuestions.map((v, sortOrder) => ({ question: v.question, yes: v.yes, no: v.no, risk: v.risk, sortOrder })),
        );
      }
    }
    if (section === "faq") {
      const x = input as FaqContent;
      await tx.delete(siteFaqQuestions);
      await tx.delete(siteFaqCategories);
      for (const [sortOrder, category] of x.entries()) {
        const result = await tx.insert(siteFaqCategories).values({ category: category.category, icon: category.icon, sortOrder });
        const categoryId = Number(result[0].insertId);
        if (category.questions.length) {
          await tx.insert(siteFaqQuestions).values(
            category.questions.map((q, i) => ({ categoryId, question: q.q, answer: q.a, sortOrder: i })),
          );
        }
      }
    }
  });
  return { success: true };
}
