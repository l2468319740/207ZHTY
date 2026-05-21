// ============================================================
// 通用结构
// ============================================================

/** 仿真时间范围 */
export interface TimeRange {
  start: number;
  end: number;
}

/** 仿真状态数据（几乎所有仿真控制接口的 data 或顶层字段共用此结构） */
export interface SimulationStateData {
  state: "idle" | "running" | "paused" | "stopped";
  sim_speed: number;
  simtime: number;
  is_running: boolean;
  is_paused: boolean;
  start_time: string;
  time_range: TimeRange;
  total_points: number;
}

// ============================================================
// 仿真控制接口
// ============================================================

/** GET /api/simulation/status */
export type SimulationStatusResponse = SimulationStateData;

/** GET /api/simulation/time */
export interface SimulationTimeResponse {
  simtime: number;
  state: string;
  sim_speed: number;
}

/** POST /api/simulation/start /pause /resume /stop /speed 的通用包装 */
export interface SimulationCommandResponse {
  success: boolean;
  message: string;
  data: SimulationStateData;
}

/** POST /api/simulation/speed 请求体 */
export interface SpeedRequest {
  speed: number;
}

// ============================================================
// 态势查询接口
// ============================================================

/** 阵营态势摘要 */
export interface FactionSituationSummary {
  faction: "Red" | "Blue";
  simtime: number;
  timestamp: string;
  total_units: number;
  alive_units: number;
  active_units: number;
  /** 实体列表（元素结构待后端确定） */
  entities: Record<string, unknown>[];
  total_detected_targets: number;
  detected_target_ids: string[];
}

/** 全局态势中的单方数据 */
export interface GlobalFactionData {
  situation: FactionSituationSummary;
  /** 实体列表（元素结构待后端确定） */
  entities: Record<string, unknown>[];
  entity_count: number;
}

/** GET /api/situation/global */
export interface GlobalSituationResponse {
  success: boolean;
  sim_status: SimulationStateData;
  red_faction: GlobalFactionData;
  blue_faction: GlobalFactionData;
}
