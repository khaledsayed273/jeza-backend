import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { employeeMarketData } from "../../db/schema";

export async function getEmployeeMarketContent(): Promise<unknown> {
  const rows = await getDb().select().from(employeeMarketData).orderBy(asc(employeeMarketData.sortOrder));
  return rows.map(({ id, sortOrder, ...r }) => r);
}
