import { getHrCostContent } from "./hrCost.repository";

export function getHrCost(): Promise<unknown> {
  return getHrCostContent();
}
