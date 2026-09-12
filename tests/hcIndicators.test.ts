import { describe, expect, it } from "vitest";
import { calcPerformanceScore, calcTrafficLight } from "../src/modules/hc-kpi/hcKpiCalc";

describe("hcIndicators", () => {
  it("calcTrafficLight returns green when target met (higher is better)", () => {
    expect(calcTrafficLight(100, 100, true)).toBe("green");
    expect(calcTrafficLight(120, 100, true)).toBe("green");
  });

  it("calcTrafficLight returns yellow between 75% and 100%", () => {
    expect(calcTrafficLight(80, 100, true)).toBe("yellow");
  });

  it("calcTrafficLight returns red below 75%", () => {
    expect(calcTrafficLight(50, 100, true)).toBe("red");
  });

  it("calcTrafficLight returns grey when missing values", () => {
    expect(calcTrafficLight(0, 100, true)).toBe("grey");
    expect(calcTrafficLight(100, 0, true)).toBe("grey");
  });

  it("calcPerformanceScore caps at 100", () => {
    expect(calcPerformanceScore(150, 100, true)).toBe(100);
    expect(calcPerformanceScore(80, 100, true)).toBe(80);
  });
});
