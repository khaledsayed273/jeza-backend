import { getEmployeeMarketContent } from "./employeeMarket.repository";

export function getEmployeeMarket(): Promise<unknown> {
  return getEmployeeMarketContent();
}
