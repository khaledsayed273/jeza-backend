import type { MySql2Database } from "drizzle-orm/mysql2";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser, adminUpdateUser, updatePassword } from "../modules/auth/auth.repository";

const ADMIN = {
  name: "Khaled",
  email: "khaledsayed273@gmail.com",
  password: "123456",
};

export async function seedAdminUser(_db: MySql2Database<any>) {
  console.log("  👤 Seeding admin user (khaled)...");
  const hash = await bcrypt.hash(ADMIN.password, 12);
  const existing = await getUserByEmail(ADMIN.email);

  if (existing) {
    const passwordOk = existing.password
      ? await bcrypt.compare(ADMIN.password, existing.password)
      : false;
    const needsUpdate =
      existing.role !== "admin" || !passwordOk || (existing.name ?? null) !== ADMIN.name;

    if (needsUpdate) {
      await adminUpdateUser(existing.id, { role: "admin", name: ADMIN.name });
      if (!passwordOk) await updatePassword(existing.id, hash);
      console.log("  ✅ Existing user updated to admin (khaledsayed273@gmail.com)");
    } else {
      console.log("  ✅ Admin user already up to date (khaledsayed273@gmail.com)");
    }
    return;
  }

  await createUser({ email: ADMIN.email, password: hash, name: ADMIN.name, role: "admin" });
  console.log("  ✅ Created admin user (khaledsayed273@gmail.com)");
}
