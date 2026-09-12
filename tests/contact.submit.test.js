import { describe, expect, it, vi } from "vitest";
vi.mock("../src/lib/notification", () => ({
    notifyOwner: vi.fn().mockResolvedValue(true),
}));
import { buildApp } from "../src/app";
describe("contact.submit", () => {
    it("returns success for an individual request", async () => {
        const app = buildApp();
        const res = await app.inject({
            method: "POST",
            url: "/api/contact/submit",
            payload: {
                requestType: "individual",
                name: "Test User",
                phone: "0500000000",
                email: "test@example.com",
            },
        });
        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({ success: true });
    });
});
