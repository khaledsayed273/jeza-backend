import { getCalculatorContent, type CalculatorContent } from "./calculator.repository";

export function getCalculator(): Promise<CalculatorContent> {
  return getCalculatorContent();
}
