import { getLeaveContent } from "./leave.repository";

export function getLeave(): Promise<unknown> {
  return getLeaveContent();
}
