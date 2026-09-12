# AGENTS.md

Fastify 5 + Drizzle ORM (MySQL) + Zod v4 backend for a bilingual Arabic/English Saudization platform. pnpm, TypeScript ESM, Node >= 22.

## Scope & Investigation

* **Do not scan the entire repository by default.**
* Start with the exact endpoint, module, file, function, or issue mentioned by the user.
* For an API issue, trace only: `route → service → repository/DB` as needed.
* For a database issue, start with the relevant repository/query and `drizzle/schema.ts`; inspect migrations only when schema state matters.
* Expand the scope only when the evidence requires it.
* Do not read unrelated files or rediscover architecture already documented here.
* Repository-wide searches are only appropriate for explicit audits, migrations, "find all", removal, or reference-check tasks.
* Keep changes limited to the requested scope; avoid unrelated refactoring.
* Prefer the smallest correct change.

## Architecture

* Entry: `src/index.ts` → `buildApp()` in `src/app.ts`.
* Routes live in `src/modules/<name>/*.routes.ts`; services/repositories are optional.
* Route prefixes are defined inside their route modules.
* DB schema: `drizzle/schema.ts`, re-exported through `src/db`.
* Use Drizzle for database access.
* Bilingual content belongs in `translations` using `entityType/entityId/lang/field`; do not duplicate translation columns in entities.
* Auth uses JWTs (`jose`) in httpOnly cookies.
* Guards: `src/plugins/guard.ts` (`attachUser`, `requireUser`, `requireAdmin`).
* Throw `HttpError` / `ZodError` and let the central error handler map them to responses; avoid manual `reply.status()` error handling unless required.
* Rate limiting is `global: false`; enable it per route when needed.
* Environment is loaded through `src/config/env.ts`; `JWT_SECRET` is required.
* `/uploads/` is served from `process.cwd()`.

## Data

* **Runtime application/business/content data must come from MySQL.**
* Do not introduce hardcoded production datasets into runtime code.
* Static seed data is allowed inside seed files because seeds populate the database.
* Keep business logic, algorithms, validation rules, enums, and technical configuration in code.
* The database must remain the runtime source of truth.
* Avoid N+1 queries; prefer bulk queries when processing multiple records.

## Database / Migrations

* Do not assume the database schema matches the repository.
* `drizzle/meta/_journal.json` is currently incomplete relative to `drizzle/0001–0003*.sql`.
* Before schema-related changes, inspect the actual schema/migration state.
* Do not modify migration history casually.
* Use the existing Drizzle schema and migration conventions.

## Commands

```bash
pnpm dev
pnpm check
pnpm test
pnpm vitest run tests/<file>.test.ts
pnpm seed
pnpm db:generate
pnpm db:push
```

`pnpm check` is the static typecheck.

`pnpm build` does not produce a usable `dist/` because `tsconfig.json` has `noEmit: true`; do not rely on `build/start`.

Tests use Fastify `app.inject()` and do not require MySQL/external services unless a specific test requires them.

Keep `@/*` and `@shared/*` aliases synchronized in both `tsconfig.json` and `vitest.config.ts`.

## Verification

* Run only the checks relevant to the change.
* For backend code changes, normally run `pnpm check`.
* Run targeted tests when behavior is covered.
* Do not run expensive or unrelated commands without a reason.

## Core Rule

**Understand only the execution path required to solve the user's request. Do not inspect the backend file-by-file unless the task explicitly requires a repository-wide investigation.**
