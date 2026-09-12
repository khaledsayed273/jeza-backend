import "dotenv/config";
import { assertEnv, ENV } from "./config/env";
import { buildApp } from "./app";

async function start() {
  assertEnv();

  const app = buildApp();

  try {
    await app.listen({ port: ENV.port, host: "0.0.0.0" });
    console.log(`[Server] Running on http://localhost:${ENV.port}/`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
