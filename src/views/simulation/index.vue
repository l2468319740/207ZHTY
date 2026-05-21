<script setup lang="ts">
import { reactive } from "vue";
import SimulationHeader from "./components/SimulationHeader.vue";
import UnitPanel from "./components/UnitPanel.vue";
import LossChart from "./components/LossChart.vue";
import SimulationProgress from "./components/SimulationProgress.vue";
import CommandArea from "./components/CommandArea.vue";
import type { CommandSet } from "./components/CommandArea.vue";
import { redCommanders, blueCommanders, lossChartData } from "@/mock/simulation";

/** 损耗对比数据（Mock，后续接入 Pinia store） */
const lossState = reactive({
  data: lossChartData,
});

/** 推演进度状态（Mock，后续接入 Pinia store） */
const progressState = reactive({
  currentStep: 3,
  totalSteps: 9,
  progress: 33,
  elapseTime: "00:02:15",
  duration: "00:08:00",
});

const redCommands: CommandSet[] = [
  {
    title: "【指令】火力排向敌方D区进行火力覆盖",
    content: ["2026/05/20 16:00"],
  },
  {
    title: "【指令】突击单元向B区前沿集结",
    content: ["2026/05/20 16:02"],
  },
  {
    title: "【指令】对B区蓝方防御阵地实施火力打击",
    content: ["2026/05/20 16:05"],
  },
  {
    title: "【指令】向B区发起正面进攻，突击单元前出",
    content: ["2026/05/20 16:08"],
  },
  {
    title: "【指令】侦察单元报告蓝方电子战动向",
    content: ["2026/05/20 16:11"],
  },
  {
    title: "【指令】营属火力对蓝方纵深实施延伸射击",
    content: ["2026/05/20 16:14"],
  },
  {
    title: "【指令】预备队前移至A-B交界处待命",
    content: ["2026/05/20 16:17"],
  },
  {
    title: "【指令】各连按营决心组织协同进攻",
    content: ["2026/05/20 16:20"],
  },
];

/** 蓝方指令时间线（Mock 数据） */
const blueCommands: CommandSet[] = [
  {
    title: "【指令】梯次配置B区防御阵地",
    content: ["2026/05/20 16:00"],
  },
  {
    title: "【指令】电子战单元进入战备状态",
    content: ["2026/05/20 16:01"],
  },
  {
    title: "【指令】对红方指挥链路实施电子干扰",
    content: ["2026/05/20 16:04"],
  },
  {
    title: "【指令】部署区域拦截盾，加强B区防御",
    content: ["2026/05/20 16:07"],
  },
  {
    title: "【指令】D区佯动兵力释放电磁信号",
    content: ["2026/05/20 16:10"],
  },
  {
    title: "【指令】预备队前移至B区纵深待机",
    content: ["2026/05/20 16:13"],
  },
  {
    title: "【指令】各排启用跳频通信规避红方侦察",
    content: ["2026/05/20 16:16"],
  },
];
</script>

<template>
  <div class="simulation-shell">
    <SimulationHeader />

    <div class="simulation-body">
      <aside class="simulation-panel">
        <UnitPanel side="red" :commanders="redCommanders" />
      </aside>

      <main class="simulation-center">
        <LossChart :data="lossState.data" />

        <CommandArea
          :red-commands="redCommands"
          :blue-commands="blueCommands"
        />

        <SimulationProgress
          :current-step="progressState.currentStep"
          :total-steps="progressState.totalSteps"
          :progress="progressState.progress"
          :elapse-time="progressState.elapseTime"
          :duration="progressState.duration"
        />
      </main>

      <aside class="simulation-panel simulation-panel--blue">
        <UnitPanel side="blue" :commanders="blueCommanders" />
      </aside>
    </div>
  </div>
</template>
