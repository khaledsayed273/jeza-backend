import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../../plugins/guard";
import * as siteController from "./site.controller";

export function registerSiteRoutes(app: FastifyInstance) {
  app.get("/api/site/home", siteController.getHome);
  app.get("/api/site/about", siteController.getAbout);
  app.get("/api/site/resources", siteController.getResources);
  app.get("/api/site/faq", siteController.getFaq);

  app.put("/api/admin/site/home", { preHandler: requireAdmin }, siteController.replaceHome);
  app.put("/api/admin/site/about", { preHandler: requireAdmin }, siteController.replaceAbout);
  app.put("/api/admin/site/resources", { preHandler: requireAdmin }, siteController.replaceResources);
  app.put("/api/admin/site/faq", { preHandler: requireAdmin }, siteController.replaceFaq);
}
