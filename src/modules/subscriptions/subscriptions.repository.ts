import { and, desc, eq, sql } from "drizzle-orm";
import { getDb, subscriptionPlans, subscriptions, translations } from "../../db";

export async function listPlans() {
  const plans = await getDb().select().from(subscriptionPlans).where(eq(subscriptionPlans.active, 1)).orderBy(subscriptionPlans.priceMonthly);
  return Promise.all(
    plans.map(async (plan) => {
      const tr = await getPlanTranslations(plan.id);
      return {
        ...plan,
        nameAr: tr.ar?.name ?? "",
        nameEn: tr.en?.name ?? "",
      };
    })
  );
}

export async function listAllPlans() {
  const plans = await getDb().select().from(subscriptionPlans).orderBy(subscriptionPlans.id);
  return Promise.all(
    plans.map(async (plan) => {
      const tr = await getPlanTranslations(plan.id);
      return {
        ...plan,
        nameAr: tr.ar?.name ?? "",
        nameEn: tr.en?.name ?? "",
      };
    })
  );
}

export async function createPlan(plan: {
  nameAr: string;
  nameEn?: string;
  priceMonthly: number;
  priceYearly: number;
  features?: string;
}) {
  const [result] = await getDb().insert(subscriptionPlans).values({
    priceMonthly: String(plan.priceMonthly),
    priceYearly: String(plan.priceYearly),
    features: plan.features,
  });
  const id = Number(result.insertId);
  // Insert translations
  await getDb().insert(translations).values({
    entityType: "subscription_plan",
    entityId: id,
    lang: "ar",
    field: "name",
    value: plan.nameAr,
  });
  if (plan.nameEn) {
    await getDb().insert(translations).values({
      entityType: "subscription_plan",
      entityId: id,
      lang: "en",
      field: "name",
      value: plan.nameEn,
    });
  }
}

export async function updatePlan(planId: number, data: Partial<{
  nameAr: string;
  nameEn: string;
  priceMonthly: number;
  priceYearly: number;
  features: string;
  active: number;
}>) {
  const { nameAr, nameEn, priceMonthly, priceYearly, ...rest } = data;
  if (Object.keys(rest).length > 0 || priceMonthly !== undefined || priceYearly !== undefined) {
    await getDb().update(subscriptionPlans).set({
      ...rest,
      ...(priceMonthly !== undefined ? { priceMonthly: String(priceMonthly) } : {}),
      ...(priceYearly !== undefined ? { priceYearly: String(priceYearly) } : {}),
    }).where(eq(subscriptionPlans.id, planId));
  }
  // Update translations
  if (nameAr !== undefined) {
    await getDb().insert(translations).values({
      entityType: "subscription_plan", entityId: planId, lang: "ar", field: "name", value: nameAr,
    }).onDuplicateKeyUpdate({ set: { value: nameAr } });
  }
  if (nameEn !== undefined) {
    await getDb().insert(translations).values({
      entityType: "subscription_plan", entityId: planId, lang: "en", field: "name", value: nameEn,
    }).onDuplicateKeyUpdate({ set: { value: nameEn } });
  }
}

export async function deletePlan(planId: number) {
  await getDb().delete(translations).where(and(eq(translations.entityType, "subscription_plan"), eq(translations.entityId, planId)));
  await getDb().delete(subscriptionPlans).where(eq(subscriptionPlans.id, planId));
}

export async function getPlanTranslations(planId: number) {
  const rows = await getDb()
    .select()
    .from(translations)
    .where(and(eq(translations.entityType, "subscription_plan"), eq(translations.entityId, planId)));
  const result: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!result[row.lang]) result[row.lang] = {};
    result[row.lang][row.field] = row.value;
  }
  return result;
}

export async function getUserSubscription(userId: number) {
  const result = await getDb()
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"), sql`${subscriptions.endDate} > NOW()`))
    .limit(1);
  return result[0];
}

export async function getAllSubscriptions() {
  return getDb().select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
}

export async function createSubscription(sub: {
  userId: number;
  planId: number;
  status?: "active" | "expired" | "cancelled";
  type: "monthly" | "yearly";
  startDate?: Date;
  endDate: Date;
}) {
  await getDb().insert(subscriptions).values({
    userId: sub.userId,
    planId: sub.planId,
    status: sub.status ?? "active",
    type: sub.type,
    startDate: sub.startDate ?? new Date(),
    endDate: sub.endDate,
  });
}
