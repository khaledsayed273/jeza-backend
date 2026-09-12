import { getTurnoverContent, type TurnoverContent } from "./turnover.repository";

export function getTurnover(): Promise<TurnoverContent> {
  return getTurnoverContent();
}
