import { get, post } from "./request";
import type { SimulationStatus, SimulationTime } from "./types";

/** 获取仿真状态 */
export function getSimulationStatus() {
  return get<SimulationStatus>("/simulation/status");
}

/** 获取当前仿真时间 */
export function getSimulationTime() {
  return get<SimulationTime>("/simulation/time");
}

/** 开始仿真（回放） */
export function startSimulation() {
  return post<void>("/simulation/start");
}

/** 暂停仿真 */
export function pauseSimulation() {
  return post<void>("/simulation/pause");
}

/** 恢复仿真 */
export function resumeSimulation() {
  return post<void>("/simulation/resume");
}

/** 停止仿真 */
export function stopSimulation() {
  return post<void>("/simulation/stop");
}

/** 设置倍速 */
export function setSimulationSpeed(speed: number) {
  return post<void>("/simulation/speed", { speed });
}

/** 跳转到指定仿真时间 */
export function seekSimulation(simTime: string) {
  return post<void>(`/simulation/seek/${encodeURIComponent(simTime)}`);
}
