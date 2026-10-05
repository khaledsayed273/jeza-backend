import "dotenv/config";

import { defineConfig } from "drizzle-kit";

declare const process: { env: { DATABASE_URL: string } };

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
