import { asc } from "drizzle-orm";
import { getDb } from "../../db";
import { leaveTypes } from "../../../drizzle/schema";

export async function getLeaveContent(): Promise<unknown> {
  const rows = await getDb().select().from(leaveTypes).orderBy(asc(leaveTypes.sortOrder));
  return rows.map(({ id, sortOrder, ...r }) => r);
}
