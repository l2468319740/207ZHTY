import { get } from "./request";
import type { GlobalSituationResponse } from "./types";

/** 获取全局态势 */
export function getGlobalSituation() {
  return get<GlobalSituationResponse>("/situation/global");
}
