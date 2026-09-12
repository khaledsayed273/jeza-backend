import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../../shared/const";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from "../../plugins/cookies";
import * as service from "./auth.service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({ email: z.string().email() });

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

function setAuthCookies(reply: FastifyReply, req: FastifyRequest, accessToken: string, refreshToken: string) {
  reply.setCookie(ACCESS_TOKEN_NAME, accessToken, getAccessTokenCookieOptions(req));
  reply.setCookie(REFRESH_TOKEN_NAME, refreshToken, getRefreshTokenCookieOptions(req));
}

function clearAuthCookies(reply: FastifyReply, req: FastifyRequest) {
  reply.clearCookie(ACCESS_TOKEN_NAME, getAccessTokenCookieOptions(req));
  reply.clearCookie(REFRESH_TOKEN_NAME, getRefreshTokenCookieOptions(req));
}

function getCookie(req: FastifyRequest, name: string): string | undefined {
  return req.cookies[name];
}

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const input = registerSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await service.register(input);
  setAuthCookies(reply, req, accessToken, refreshToken);
  return reply.code(201).send({ user });
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const input = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await service.login(input);
  setAuthCookies(reply, req, accessToken, refreshToken);
  return reply.send({ user });
}

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  const refreshToken = getCookie(req, REFRESH_TOKEN_NAME);
  const { user, accessToken, refreshToken: newRefreshToken } = await service.refresh(refreshToken);
  setAuthCookies(reply, req, accessToken, newRefreshToken);
  return reply.send({ user });
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  const refreshToken = getCookie(req, REFRESH_TOKEN_NAME);
  clearAuthCookies(reply, req);
  const result = await service.logout(refreshToken);
  return reply.send(result);
}

export async function forgotPassword(req: FastifyRequest, reply: FastifyReply) {
  const { email } = forgotPasswordSchema.parse(req.body);
  await service.forgotPassword(email);
  return reply.send({ message: "If the email exists, a reset link has been sent." });
}

export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
  const { token, password } = resetPasswordSchema.parse(req.body);
  await service.resetPassword(token, password);
  return reply.send({ message: "Password has been reset successfully." });
}

export async function me(req: FastifyRequest, _reply: FastifyReply) {
  const user = await service.authenticate(req.headers.cookie);
  if (!user) {
    throw UnauthorizedError("Authentication required");
  }
  return service.toPublicUser(user);
}

export async function updateProfile(req: FastifyRequest, _reply: FastifyReply) {
  const input = updateProfileSchema.parse(req.body);
  return service.updateProfile(req.user!.id, input);
}

export async function changePassword(req: FastifyRequest, _reply: FastifyReply) {
  const input = changePasswordSchema.parse(req.body);
  return service.changePassword(req.user!.id, input.currentPassword, input.newPassword);
}

export async function listSessions(_req: FastifyRequest, _reply: FastifyReply) {
  return service.listSessions();
}

export async function revokeOtherSessions(_req: FastifyRequest, _reply: FastifyReply) {
  return service.revokeOtherSessions();
}

// ── Admin user management ──────────────────────────────────────────────────────
const adminUserQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});

const updateUserAdminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin"]).optional(),
  disabled: z.boolean().optional(),
});

export async function listUsersAdmin(req: FastifyRequest, _reply: FastifyReply) {
  const { page, limit, search } = adminUserQuerySchema.parse(req.query);
  return service.listUsersAdmin({ page, limit, search });
}

export async function getUserAdmin(req: FastifyRequest, _reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const user = await service.getUserAdmin(Number(id));
  if (!user) throw NotFoundError("User not found");
  return user;
}

export async function updateUserAdmin(req: FastifyRequest, _reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const input = updateUserAdminSchema.parse(req.body);
  return service.updateUserAdmin(Number(id), input);
}

export async function deleteUserAdmin(req: FastifyRequest, _reply: FastifyReply) {
  const { id } = req.params as { id: string };
  return service.deleteUserAdmin(Number(id));
}
