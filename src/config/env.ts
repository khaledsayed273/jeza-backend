function required(name: string): string {
  const value = process.env[name] ?? "";
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT || 8080),
  cookieSecret: process.env.JWT_SECRET ?? "",
  adminEmail: process.env.ADMIN_EMAIL ?? "",

  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME ?? "jeza-saudization",
    user: process.env.DB_USER ?? "root",
    pass: process.env.DB_PASS ?? "",
  },

  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function assertEnv(): void {
  if (!ENV.cookieSecret) {
    throw new Error("JWT_SECRET is required");
  }
}
