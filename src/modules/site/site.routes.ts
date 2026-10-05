import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as siteController from "./site.controller";

export function registerSiteRoutes(app: FastifyInstance) {
  app.get("/api/v1/site/home", siteController.getHome);
  app.get("/api/v1/site/about", siteController.getAbout);
  app.get("/api/v1/site/resources", siteController.getResources);
  app.get("/api/v1/site/faq", siteController.getFaq);

  app.put("/api/v1/admin/site/home", { preHandler: requireAdmin }, siteController.replaceHome);
  app.put("/api/v1/admin/site/about", { preHandler: requireAdmin }, siteController.replaceAbout);
  app.put("/api/v1/admin/site/resources", { preHandler: requireAdmin }, siteController.replaceResources);
  app.put("/api/v1/admin/site/faq", { preHandler: requireAdmin }, siteController.replaceFaq);
}
