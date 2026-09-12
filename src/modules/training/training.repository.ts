import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { trainingDecisions, trainingSectors, disclosurePoints } from "../../../drizzle/schema";

export type TrainingDecision = { num: string; ar: string; en: string };
export type TrainingSector = { ar: string; en: string };
export type DisclosurePoint = {
  num: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
};
export type TrainingContent = {
  decisions: TrainingDecision[];
  sectors: TrainingSector[];
  disclosurePoints: DisclosurePoint[];
};

export async function getTrainingContent(): Promise<TrainingContent> {
  const decisions = await getDb().select().from(trainingDecisions).orderBy(asc(trainingDecisions.sortOrder));
  const sectors = await getDb().select().from(trainingSectors).orderBy(asc(trainingSectors.sortOrder));
  const points = await getDb().select().from(disclosurePoints).orderBy(asc(disclosurePoints.sortOrder));

  return {
    decisions: decisions.map(({ id, sortOrder, ...r }) => r),
    sectors: sectors.map(({ id, sortOrder, ...r }) => r),
    disclosurePoints: points.map(({ id, sortOrder, ...r }) => r),
  };
}
