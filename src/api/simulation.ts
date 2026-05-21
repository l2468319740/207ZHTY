import { get, post } from "./request";
import type {
  SimulationStatusResponse,
  SimulationTimeResponse,
  SimulationCommandResponse,
} from "./types";

/** 获取仿真状态 */
export function getSimulationStatus() {
  return get<SimulationStatusResponse>("/simulation/status");
}

/** 获取当前仿真时间 */
export function getSimulationTime() {
  return get<SimulationTimeResponse>("/simulation/time");
}

/** 开始仿真（回放） */
export function startSimulation() {
  return post<SimulationCommandResponse>("/simulation/start");
}

/** 暂停仿真 */
export function pauseSimulation() {
  return post<SimulationCommandResponse>("/simulation/pause");
}

/** 恢复仿真 */
export function resumeSimulation() {
  return post<SimulationCommandResponse>("/simulation/resume");
}

/** 停止仿真 */
export function stopSimulation() {
  return post<SimulationCommandResponse>("/simulation/stop");
}

/** 设置倍速 */
export function setSimulationSpeed(speed: number) {
  return post<SimulationCommandResponse>("/simulation/speed", { speed });
}

/** 跳转到指定仿真时间 */
export function seekSimulation(simTime: string) {
  return post<void>(`/simulation/seek/${encodeURIComponent(simTime)}`);
}
