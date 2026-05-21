/** 仿真运行状态 */
export type SimulationState = "idle" | "running" | "paused" | "stopped";

/** GET /api/simulation/status 响应 */
export interface SimulationStatus {
  state: SimulationState;
  /** 当前倍速 */
  speed: number;
  /** 当前仿真时间 */
  currentTime: string;
  /** 推演进度 0-100 */
  progress: number;
}

/** GET /api/simulation/time 响应 */
export interface SimulationTime {
  /** 当前仿真时间 */
  simTime: string;
  /** 已耗时 */
  elapsed: string;
}

/** POST /api/simulation/speed 请求体 */
export interface SpeedRequest {
  speed: number;
}

/** 损耗类别 */
export interface LossCategory {
  name: string;
  redValue: number;
  blueValue: number;
}

/** 阵营摘要 */
export interface FactionSummary {
  faction: "Red" | "Blue";
  totalUnits: number;
  losses: LossCategory[];
}

/** GET /api/situation/global 响应 */
export interface GlobalSituation {
  redSummary: FactionSummary;
  blueSummary: FactionSummary;
}

/** 实体对象 */
export interface SituationEntity {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  status: string;
}

/** 指挥官消息体 */
export interface CommanderMessage {
  id: string;
  name: string;
  role: string;
  icon: string;
  paragraphs: string[];
}

/** 单方态势 */
export interface FactionSituation {
  faction: "Red" | "Blue";
  commanders: CommanderMessage[];
  entities: SituationEntity[];
  lossData: LossCategory[];
}

/** GET /api/situation/full 响应 */
export interface FullSituation {
  red: FactionSituation;
  blue: FactionSituation;
}
