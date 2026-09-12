import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app";

describe("system + content routes", () => {
  it("GET /api/system/health returns ok", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "GET",
      url: "/api/system/health?timestamp=123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it("GET /api/content/hr-explainers returns data", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/api/content/hr-explainers" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("sources");
    expect(body).toHaveProperty("categories");
    expect(body).toHaveProperty("images");
  });
});
