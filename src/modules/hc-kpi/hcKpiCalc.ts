/**
 * HR KPI calculation helpers (pure logic, no static data).
 */

export function calcTrafficLight(
  currentValue: number,
  targetValue: number,
  higherIsBetter: boolean
): "green" | "yellow" | "red" | "grey" {
  if (!currentValue || !targetValue) return "grey";
  const ratio = higherIsBetter
    ? currentValue / targetValue
    : targetValue / currentValue;
  if (ratio >= 1) return "green";
  if (ratio >= 0.75) return "yellow";
  return "red";
}

export function calcPerformanceScore(
  currentValue: number,
  targetValue: number,
  higherIsBetter: boolean
): number {
  if (!currentValue || !targetValue) return 0;
  const ratio = higherIsBetter
    ? currentValue / targetValue
    : targetValue / currentValue;
  return Math.min(100, Math.round(ratio * 100));
}
