import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import path from "node:path";
import { z } from "zod";
import { HttpError } from "./shared/errors";
import { registerSystemRoutes } from "./modules/system/system.routes";
import { registerHrExplainersRoutes } from "./modules/hr-explainers/hrExplainers.routes";
import { registerUpdatesRoutes } from "./modules/updates/updates.routes";
import { registerTemplatesRoutes } from "./modules/templates/templates.routes";
import { registerPoliciesRoutes } from "./modules/policies/policies.routes";
import { registerDeclarationsRoutes } from "./modules/declarations/declarations.routes";
import { registerJobDescriptionsRoutes } from "./modules/job-descriptions/jobDescriptions.routes";
import { registerQuizRoutes } from "./modules/quiz/quiz.routes";
import { registerHcIndicatorsRoutes } from "./modules/hc-indicators/hcIndicators.routes";
import { registerConfigRoutes } from "./modules/config/config.routes";
import { registerCalculatorRoutes } from "./modules/calculator/calculator.routes";
import { registerSiteRoutes } from "./modules/site/site.routes";
import { registerHrCostRoutes } from "./modules/hr-cost/hrCost.routes";
import { registerLeaveRoutes } from "./modules/leave/leave.routes";
import { registerTurnoverRoutes } from "./modules/turnover/turnover.routes";
import { registerEmployeeMarketRoutes } from "./modules/employee-market/employeeMarket.routes";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { registerContactRoutes } from "./modules/contact/contact.routes";
import { registerLettersRoutes } from "./modules/letters/letters.routes";
import { registerHcKpiRoutes } from "./modules/hc-kpi/hcKpi.routes";
import { registerHcKpiPdfRoute } from "./modules/hc-kpi/hcKpi.pdf";
import { registerSubscriptionRoutes } from "./modules/subscriptions/subscriptions.routes";
import { registerTicketRoutes } from "./modules/tickets/tickets.routes";
import { registerTrainingRoutes } from "./modules/training/training.routes";
import { registerContentAdminRoutes } from "./modules/content-admin/contentAdmin.routes";
import { registerUploadRoutes } from "./modules/uploads/uploads.routes";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    bodyLimit: 50 * 1024 * 1024,
  });

  app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });

  app.register(cors, {
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
  });

  app.register(cookie);

  app.register(rateLimit, { global: false });

  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });

  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  });

  // ── Modules ────────────────────────────────────────────────────────────────
  app.register(registerSystemRoutes);
  app.register(registerAuthRoutes);
  app.register(registerContactRoutes);
  app.register(registerLettersRoutes);
  app.register(registerHcKpiRoutes);
  app.register(registerHcKpiPdfRoute);
  app.register(registerSubscriptionRoutes);
  app.register(registerTicketRoutes);
  app.register(registerTrainingRoutes);
  app.register(registerHrExplainersRoutes);
  app.register(registerUpdatesRoutes);
  app.register(registerTemplatesRoutes);
  app.register(registerPoliciesRoutes);
  app.register(registerDeclarationsRoutes);
  app.register(registerJobDescriptionsRoutes);
  app.register(registerQuizRoutes);
  app.register(registerHcIndicatorsRoutes);
  app.register(registerConfigRoutes);
  app.register(registerCalculatorRoutes);
  app.register(registerSiteRoutes);
  app.register(registerHrCostRoutes);
  app.register(registerLeaveRoutes);
  app.register(registerTurnoverRoutes);
  app.register(registerEmployeeMarketRoutes);
  app.register(registerContentAdminRoutes);
  app.register(registerUploadRoutes);

  // ── Error handling ─────────────────────────────────────────────────────────
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: "Invalid request", details: error.issues });
    }
    console.error("[Server] Unhandled error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  });

  return app;
}
