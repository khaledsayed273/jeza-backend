import type { FastifyInstance } from "fastify";
import { requireUser, requireAdmin } from "../../plugins/guard";
import * as authController from "./auth.controller";

const AUTH_RATE_LIMIT =
  process.env.E2E_DISABLE_RATE_LIMIT === "1"
    ? (false as const)
    : { max: 10, timeWindow: "15 minutes" };

export function registerAuthRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", { config: { rateLimit: AUTH_RATE_LIMIT } }, authController.register);
  app.post("/api/auth/login", { config: { rateLimit: AUTH_RATE_LIMIT } }, authController.login);
  app.post("/api/auth/refresh", { config: { rateLimit: AUTH_RATE_LIMIT } }, authController.refresh);
  app.post("/api/auth/logout", { config: { rateLimit: AUTH_RATE_LIMIT } }, authController.logout);
  app.post("/api/auth/forgot-password", { config: { rateLimit: AUTH_RATE_LIMIT } }, authController.forgotPassword);
  app.post("/api/auth/reset-password", { config: { rateLimit: AUTH_RATE_LIMIT } }, authController.resetPassword);
  app.get("/api/auth/me", authController.me);
  app.patch("/api/auth/profile", { preHandler: requireUser }, authController.updateProfile);
  app.post("/api/auth/change-password", { preHandler: requireUser }, authController.changePassword);
  app.get("/api/auth/sessions", { preHandler: requireUser }, authController.listSessions);
  app.post("/api/auth/revoke-other-sessions", { preHandler: requireUser }, authController.revokeOtherSessions);

  // ── Admin user management ──────────────────────────────────────────────────
  app.get("/api/admin/users", { preHandler: requireAdmin }, authController.listUsersAdmin);
  app.get("/api/admin/users/:id", { preHandler: requireAdmin }, authController.getUserAdmin);
  app.patch("/api/admin/users/:id", { preHandler: requireAdmin }, authController.updateUserAdmin);
  app.delete("/api/admin/users/:id", { preHandler: requireAdmin }, authController.deleteUserAdmin);
}
