import { getTrainingContent, type TrainingContent } from "./training.repository";

export function getTraining(): Promise<TrainingContent> {
  return getTrainingContent();
}
