import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../src/shared/const";
describe("auth.logout", () => {
    it("clears both access and refresh cookies and reports success", async () => {
        const app = buildApp();
        const res = await app.inject({
            method: "POST",
            url: "/api/auth/logout",
        });
        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({ success: true });
        const setCookie = (Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [res.headers["set-cookie"] ?? ""]);
        expect(setCookie.some((c) => c.startsWith(`${ACCESS_TOKEN_NAME}=`))).toBe(true);
        expect(setCookie.some((c) => c.startsWith(`${REFRESH_TOKEN_NAME}=`))).toBe(true);
    });
});
