import { get } from "./request";
import type {
  GlobalSituation,
  FullSituation,
  FactionSituation,
  SituationEntity,
} from "./types";

/** 获取全局态势 */
export function getGlobalSituation() {
  return get<GlobalSituation>("/situation/global");
}

/** 获取全量态势（红蓝双方完整信息） */
export function getFullSituation() {
  return get<FullSituation>("/situation/full");
}

/** 获取单方态势（Red/Blue） */
export function getFactionSituation(faction: "Red" | "Blue") {
  return get<FactionSituation>(`/situation/faction/${faction}`);
}

/** 获取单方实体列表 */
export function getFactionEntities(faction: "Red" | "Blue") {
  return get<SituationEntity[]>(`/situation/entities/${faction}`);
}
