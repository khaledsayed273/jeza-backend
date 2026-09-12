import { eq, and, desc, sql, like } from "drizzle-orm";
import { getDb, users, sessions, type User } from "../../db";

export async function getUserByEmail(email: string) {
  const result = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const result = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string | null;
  role?: "admin" | "user";
}): Promise<User> {
  await getDb().insert(users).values({
    email: input.email,
    password: input.password,
    name: input.name,
    role: input.role ?? "user",
    lastSignedIn: new Date(),
  });

  const created = await getUserByEmail(input.email);
  if (!created) throw new Error("[Database] Failed to retrieve created user");
  return created;
}

export async function updateLastSignedIn(userId: number) {
  await getDb().update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function updateUser(userId: number, data: { name?: string | null; email?: string }) {
  await getDb().update(users).set(data).where(eq(users.id, userId));
}

export async function adminUpdateUser(
  userId: number,
  data: { name?: string | null; email?: string; role?: "user" | "admin"; disabled?: boolean },
) {
  await getDb().update(users).set(data).where(eq(users.id, userId));
}

export async function listUsers(input: {
  page: number;
  limit: number;
  search?: string;
}): Promise<{ users: User[]; total: number }> {
  const where = input.search ? like(users.email, `%${input.search}%`) : undefined;
  const rows = await getDb()
    .select()
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(input.limit)
    .offset((input.page - 1) * input.limit);

  const [{ count }] = await getDb()
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(where);

  return { users: rows, total: Number(count) };
}

export async function deleteUser(userId: number) {
  await getDb().delete(sessions).where(eq(sessions.userId, userId));
  await getDb().delete(users).where(eq(users.id, userId));
}

export async function updatePassword(userId: number, newHash: string) {
  await getDb().update(users).set({ password: newHash }).where(eq(users.id, userId));
}

export async function setResetToken(email: string, token: string, expiresAt: Date) {
  await getDb().update(users).set({ resetToken: token, resetTokenExpires: expiresAt }).where(eq(users.email, email));
}

export async function getUserByResetToken(token: string) {
  const result = await getDb()
    .select()
    .from(users)
    .where(eq(users.resetToken, token))
    .limit(1);
  return result[0];
}

export async function clearResetToken(userId: number) {
  await getDb().update(users).set({ resetToken: null, resetTokenExpires: null }).where(eq(users.id, userId));
}

export async function setRefreshToken(userId: number, tokenHash: string) {
  await getDb().update(users).set({ refreshToken: tokenHash }).where(eq(users.id, userId));
}

export async function getRefreshTokenHash(userId: number) {
  const result = await getDb()
    .select({ refreshToken: users.refreshToken })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return result[0]?.refreshToken ?? undefined;
}

export async function clearRefreshToken(userId: number) {
  await getDb().update(users).set({ refreshToken: null }).where(eq(users.id, userId));
}

// ── Sessions ────────────────────────────────────────────────────────────────────
export async function createSession(userId: number, tokenHash: string, deviceName?: string) {
  await getDb().insert(sessions).values({ userId, tokenHash, deviceName: deviceName || "Unknown" });
}

export async function getSessionsByUserId(userId: number) {
  return getDb().select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.lastActiveAt));
}

export async function deleteUserSessions(userId: number) {
  await getDb().delete(sessions).where(eq(sessions.userId, userId));
}

export async function deleteOtherSessions(userId: number, keepSessionId: number) {
  await getDb().delete(sessions).where(and(eq(sessions.userId, userId), sql`${sessions.id} != ${keepSessionId}`));
}
