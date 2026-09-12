import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  UNAUTHED_ERR_MSG,
} from "../../shared/const";
import { UnauthorizedError, NotFoundError } from "../../shared/errors";
import { ENV } from "../../config/env";
import type { User } from "../../db";
import * as repo from "./auth.repository";

const SALT_ROUNDS = 12;

export type SessionPayload = {
  userId: number;
  email: string;
};

export type PublicUser = {
  id: number;
  email: string;
  name: string | null;
  role: "user" | "admin";
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getSessionSecret() {
  return new TextEncoder().encode(ENV.cookieSecret);
}

function parseCookies(cookieHeader: string | undefined) {
  if (!cookieHeader) return new Map<string, string>();
  return new Map(Object.entries(parseCookieHeader(cookieHeader)));
}

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

// ── Password ───────────────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Tokens ─────────────────────────────────────────────────────────────────────
export async function createAccessToken(userId: number, email: string): Promise<string> {
  const issuedAt = Date.now();
  const expirationSeconds = Math.floor((issuedAt + 1000 * 60 * 15) / 1000);

  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSessionSecret());
}

export async function createRefreshToken(userId: number, email: string): Promise<string> {
  const issuedAt = Date.now();
  const expirationSeconds = Math.floor((issuedAt + 1000 * 60 * 60 * 24 * 30) / 1000);

  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSessionSecret());

  await repo.setRefreshToken(userId, hashToken(token));
  return token;
}

export async function verifyAccessToken(cookieValue?: string | null): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtVerify(cookieValue, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    const { userId, email } = payload as Record<string, unknown>;
    if (typeof userId !== "number" || typeof email !== "string" || !email) {
      return null;
    }
    return { userId, email };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(cookieValue?: string | null): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtVerify(cookieValue, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    const { userId, email } = payload as Record<string, unknown>;
    if (typeof userId !== "number" || typeof email !== "string" || !email) {
      return null;
    }

    const tokenHash = hashToken(cookieValue);
    const storedHash = await repo.getRefreshTokenHash(userId);
    if (!storedHash || storedHash !== tokenHash) {
      return null;
    }

    return { userId, email };
  } catch {
    return null;
  }
}

export async function authenticate(cookieHeader?: string): Promise<User | null> {
  const cookies = parseCookies(cookieHeader);
  const session = await verifyAccessToken(cookies.get(ACCESS_TOKEN_NAME));
  if (!session) return null;

  const user = await repo.getUserById(session.userId);
  return user ?? null;
}

// ── Business logic ─────────────────────────────────────────────────────────────
export async function register(input: { email: string; password: string; name: string }) {
  const existing = await repo.getUserByEmail(input.email);
  if (existing) {
    throw UnauthorizedError("Email already registered");
  }

  const hashed = await hashPassword(input.password);
  const role: "admin" | "user" =
    ENV.adminEmail && input.email.toLowerCase() === ENV.adminEmail.toLowerCase()
      ? "admin"
      : "user";

  const user = await repo.createUser({
    email: input.email,
    password: hashed,
    name: input.name,
    role,
  });

  const accessToken = await createAccessToken(user.id, user.email);
  const refreshToken = await createRefreshToken(user.id, user.email);

  return { user: toPublicUser(user), accessToken, refreshToken };
}

export async function login(input: { email: string; password: string }) {
  const user = await repo.getUserByEmail(input.email);
  if (!user || !(await verifyPassword(input.password, user.password))) {
    throw UnauthorizedError("Invalid email or password");
  }

  await repo.updateLastSignedIn(user.id);

  const accessToken = await createAccessToken(user.id, user.email);
  const refreshToken = await createRefreshToken(user.id, user.email);

  return { user: toPublicUser(user), accessToken, refreshToken };
}

export async function refresh(refreshToken?: string) {
  const session = await verifyRefreshToken(refreshToken);
  if (!session) {
    throw UnauthorizedError(UNAUTHED_ERR_MSG);
  }

  const user = await repo.getUserById(session.userId);
  if (!user) {
    throw UnauthorizedError(UNAUTHED_ERR_MSG);
  }

  const newAccessToken = await createAccessToken(user.id, user.email);
  const newRefreshToken = await createRefreshToken(user.id, user.email);

  return { user: toPublicUser(user), accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken?: string) {
  if (refreshToken) {
    const session = await verifyRefreshToken(refreshToken);
    if (session) {
      await repo.clearRefreshToken(session.userId);
    }
  }
  return { success: true } as const;
}

export async function forgotPassword(email: string) {
  const user = await repo.getUserByEmail(email);
  if (!user) return; // avoid email enumeration

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await repo.setResetToken(email, token, expiresAt);

  console.log(`[Auth] Reset link for ${email}: ${ENV.isProduction ? "" : `/reset-password?token=${token}`}`);
}

export async function resetPassword(token: string, password: string) {
  const user = await repo.getUserByResetToken(token);
  if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
    throw UnauthorizedError("Invalid or expired reset token");
  }

  const hashed = await hashPassword(password);
  await repo.updatePassword(user.id, hashed);
  await repo.clearResetToken(user.id);
}

export async function updateProfile(userId: number, input: { name?: string; email?: string }) {
  const current = await repo.getUserById(userId);
  if (!current) throw UnauthorizedError(UNAUTHED_ERR_MSG);

  if (input.email && input.email !== current.email) {
    const existing = await repo.getUserByEmail(input.email);
    if (existing) throw UnauthorizedError("Email already in use");
  }

  const data: { name?: string | null; email?: string } = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (Object.keys(data).length > 0) await repo.updateUser(userId, data);

  return { success: true };
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await repo.getUserById(userId);
  if (!user) throw UnauthorizedError(UNAUTHED_ERR_MSG);

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) throw UnauthorizedError("Current password is incorrect");

  const hashed = await hashPassword(newPassword);
  await repo.updatePassword(user.id, hashed);

  return { success: true };
}

export async function listSessions() {
  return [];
}

export async function revokeOtherSessions() {
  return { success: true };
}

// ── Admin user management ──────────────────────────────────────────────────────
export type AdminUser = {
  id: number;
  email: string;
  name: string | null;
  role: "user" | "admin";
  disabled: boolean;
  createdAt: Date;
  lastSignedIn: Date;
};

function toAdminUser(user: User): AdminUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    disabled: user.disabled,
    createdAt: user.createdAt,
    lastSignedIn: user.lastSignedIn,
  };
}

export async function listUsersAdmin(input: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ users: AdminUser[]; total: number; page: number; limit: number }> {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(100, Math.max(1, input.limit ?? 20));
  const { users, total } = await repo.listUsers({ page, limit, search: input.search });
  return { users: users.map(toAdminUser), total, page, limit };
}

export async function getUserAdmin(id: number): Promise<AdminUser | undefined> {
  const user = await repo.getUserById(id);
  return user ? toAdminUser(user) : undefined;
}

export async function updateUserAdmin(
  id: number,
  input: { name?: string | null; email?: string; role?: "user" | "admin"; disabled?: boolean },
): Promise<AdminUser> {
  const current = await repo.getUserById(id);
  if (!current) throw NotFoundError("User not found");

  if (input.email && input.email !== current.email) {
    const existing = await repo.getUserByEmail(input.email);
    if (existing) throw UnauthorizedError("Email already in use");
  }

  await repo.adminUpdateUser(id, input);
  const updated = await repo.getUserById(id);
  return toAdminUser(updated!);
}

export async function deleteUserAdmin(id: number): Promise<{ success: boolean }> {
  const current = await repo.getUserById(id);
  if (!current) throw NotFoundError("User not found");
  await repo.deleteUser(id);
  return { success: true };
}
