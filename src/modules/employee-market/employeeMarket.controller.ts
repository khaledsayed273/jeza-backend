import type { FastifyReply, FastifyRequest } from "fastify";
import * as employeeMarketService from "./employeeMarket.service";

export async function getEmployeeMarket(_req: FastifyRequest, _reply: FastifyReply) {
  return employeeMarketService.getEmployeeMarket();
}
