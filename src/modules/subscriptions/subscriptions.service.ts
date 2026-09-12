import * as repo from "./subscriptions.repository";

export const listPlans = () => repo.listPlans();
export const listAllPlans = () => repo.listAllPlans();

export async function createPlan(input: {
  nameAr: string;
  nameEn?: string;
  priceMonthly: number;
  priceYearly: number;
  features?: string;
}) {
  await repo.createPlan(input);
  return { success: true };
}

export async function updatePlan(planId: number, input: {
  nameAr?: string;
  nameEn?: string;
  priceMonthly?: number;
  priceYearly?: number;
  features?: string;
  active?: number;
}) {
  const { ...data } = input;
  await repo.updatePlan(planId, data);
  return { success: true };
}

export const getMySubscription = (userId: number) => repo.getUserSubscription(userId);
export const listAllSubscriptions = () => repo.getAllSubscriptions();
export async function deletePlan(planId: number) {
  await repo.deletePlan(planId);
  return { success: true };
}

export async function createSubscription(input: {
  userId: number;
  planId: number;
  type: "monthly" | "yearly";
  endDate: string;
}) {
  await repo.createSubscription({
    userId: input.userId,
    planId: input.planId,
    type: input.type,
    endDate: new Date(input.endDate),
  });
  return { success: true };
}
