import type { FastifyInstance } from "fastify";
import { attachUser } from "../../plugins/guard";
import * as hcKpiController from "./hcKpi.controller";

export function registerHcKpiRoutes(app: FastifyInstance) {
  app.get("/api/hc-kpi/organizations", { preHandler: attachUser }, hcKpiController.listOrganizations);
  app.post("/api/hc-kpi/organizations", { preHandler: attachUser }, hcKpiController.createOrganization);
  app.patch("/api/hc-kpi/organizations/:id", { preHandler: attachUser }, hcKpiController.updateOrganization);
  app.delete("/api/hc-kpi/organizations/:id", { preHandler: attachUser }, hcKpiController.deleteOrganization);
  app.get("/api/hc-kpi/organizations/:organizationId/reports", { preHandler: attachUser }, hcKpiController.listReports);
  app.get("/api/hc-kpi/reports/:reportId", { preHandler: attachUser }, hcKpiController.getReport);
  app.post("/api/hc-kpi/reports", { preHandler: attachUser }, hcKpiController.createReport);
  app.patch("/api/hc-kpi/reports/:reportId/status", { preHandler: attachUser }, hcKpiController.updateReportStatus);
  app.delete("/api/hc-kpi/reports/:reportId", { preHandler: attachUser }, hcKpiController.deleteReport);
  app.patch("/api/hc-kpi/entries/:entryId", hcKpiController.updateKpiEntry);
  app.post("/api/hc-kpi/reports/:reportId/indicators", hcKpiController.addCustomIndicator);
  app.delete("/api/hc-kpi/entries/:entryId", hcKpiController.deleteKpiEntry);
}
