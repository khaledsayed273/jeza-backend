import { z } from "zod";
import {
  getAboutContent,
  getFaqContent,
  getHomeContent,
  getResourcesContent,
  replaceSiteSection,
  type AboutContent,
  type ResourcesContent,
} from "./site.repository";

const bilingualText = z.object({ ar: z.string(), en: z.string() });

export const homeSchema = z.array(
  z.object({
    id: z.string().min(1),
    path: z.string().min(1),
    titleAr: z.string().min(1),
    titleEn: z.string().min(1),
    subAr: z.string().min(1),
    subEn: z.string().min(1),
    descAr: z.string().min(1),
    descEn: z.string().min(1),
    badgeAr: z.string().nullable().optional(),
    badgeEn: z.string().nullable().optional(),
    externalUrl: z.string().url().optional().or(z.literal("")).nullable(),
  }),
);

export const aboutSchema = z.object({
  certifications: z.array(z.string().min(1)),
  stats: z.array(z.object({ value: z.string().min(1), labelAr: z.string().min(1), labelEn: z.string().min(1) })),
  courses: z.array(bilingualText),
  contacts: z.array(
    z.object({
      labelAr: z.string().min(1),
      labelEn: z.string().min(1),
      valueAr: z.string().nullable().optional(),
      valueEn: z.string().nullable().optional(),
      value: z.string().nullable().optional(),
      hrefType: z.string().nullable().optional(),
      href: z.string().nullable().optional(),
      color: z.string().min(1),
    }),
  ),
});

export const resourcesSchema = z.object({
  decisions: z.record(
    z.string(),
    z.array(
      z.object({
        title: z.string().min(1),
        badge: z.string().min(1),
        desc: z.string().min(1),
        date: z.string().min(1),
        href: z.string().min(1),
      }),
    ),
  ),
  complianceQuestions: z.array(
    z.object({
      question: z.string().min(1),
      yes: z.string().min(1),
      no: z.string().min(1),
      risk: z.enum(["low", "medium", "high", "critical"]),
    }),
  ),
  officialLinks: z.array(
    z.object({
      label: z.string().min(1),
      desc: z.string().min(1),
      href: z.string().min(1),
      color: z.string().min(1),
    }),
  ),
});

export const faqSchema = z.array(
  z.object({
    category: z.string().min(1),
    icon: z.string().min(1),
    questions: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })),
  }),
);

export function getHome(): Promise<unknown> {
  return getHomeContent();
}

export function getAbout(): Promise<AboutContent> {
  return getAboutContent();
}

export function getResources(): Promise<ResourcesContent> {
  return getResourcesContent();
}

export function getFaq(): Promise<unknown> {
  return getFaqContent();
}

export function replaceHome(data: z.infer<typeof homeSchema>) {
  return replaceSiteSection("home", data);
}

export function replaceAbout(data: z.infer<typeof aboutSchema>) {
  return replaceSiteSection("about", data);
}

export function replaceResources(data: z.infer<typeof resourcesSchema>) {
  return replaceSiteSection("resources", data);
}

export function replaceFaq(data: z.infer<typeof faqSchema>) {
  return replaceSiteSection("faq", data);
}
