import type { FastifyInstance } from "fastify";
import { attachUser } from "../../plugins/guard";
import * as hcKpiController from "./hcKpi.controller";

export function registerHcKpiRoutes(app: FastifyInstance) {
  app.get("/api/v1/hc-kpi/organizations", { preHandler: attachUser }, hcKpiController.listOrganizations);
  app.post("/api/v1/hc-kpi/organizations", { preHandler: attachUser }, hcKpiController.createOrganization);
  app.patch("/api/v1/hc-kpi/organizations/:id", { preHandler: attachUser }, hcKpiController.updateOrganization);
  app.delete("/api/v1/hc-kpi/organizations/:id", { preHandler: attachUser }, hcKpiController.deleteOrganization);
  app.get("/api/v1/hc-kpi/organizations/:organizationId/reports", { preHandler: attachUser }, hcKpiController.listReports);
  app.get("/api/v1/hc-kpi/reports/:reportId", { preHandler: attachUser }, hcKpiController.getReport);
  app.post("/api/v1/hc-kpi/reports", { preHandler: attachUser }, hcKpiController.createReport);
  app.patch("/api/v1/hc-kpi/reports/:reportId/status", { preHandler: attachUser }, hcKpiController.updateReportStatus);
  app.delete("/api/v1/hc-kpi/reports/:reportId", { preHandler: attachUser }, hcKpiController.deleteReport);
  app.patch("/api/v1/hc-kpi/entries/:entryId", hcKpiController.updateKpiEntry);
  app.post("/api/v1/hc-kpi/reports/:reportId/indicators", hcKpiController.addCustomIndicator);
  app.delete("/api/v1/hc-kpi/entries/:entryId", hcKpiController.deleteKpiEntry);
}
