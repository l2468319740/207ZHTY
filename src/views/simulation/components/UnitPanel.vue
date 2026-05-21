<script setup lang="ts">
import { ref, onMounted } from "vue";
import CommanderCard from "./CommanderCard.vue";
import type { CommanderMessage } from "@/mock/simulation";

defineProps<{
  /** 红方或蓝方 */
  side: "red" | "blue";
  /** 该方指挥官列表 */
  commanders: CommanderMessage[];
}>();

const cardRefs = ref<InstanceType<typeof CommanderCard>[]>([]);
const activeIndex = ref(0);

/** 当前卡片打字完成后，启动下一张卡片 */
function onCardDone() {
  activeIndex.value++;
  const next = cardRefs.value[activeIndex.value];
  if (next) {
    next.start();
  }
}

onMounted(() => {
  const first = cardRefs.value[0];
  if (first) {
    first.start();
  }
});
</script>

<template>
  <div class="unit-panel">
    <div class="unit-panel__header">
      <h2
        class="unit-panel__title"
        :class="side === 'red' ? 'unit-panel__title--red' : 'unit-panel__title--blue'"
      >
        {{ side === "red" ? "红方" : "蓝方" }}智能单元
      </h2>
      <span
        class="unit-panel__badge"
        :class="side === 'red' ? 'unit-panel__badge--red' : 'unit-panel__badge--blue'"
      >{{ commanders.length }}</span>
    </div>

    <div class="unit-panel__list">
      <CommanderCard
        v-for="(cmd, idx) in commanders"
        :key="cmd.id"
        :ref="(el: any) => { if (el) cardRefs[idx] = el; }"
        :commander="cmd"
        :side="side"
        @done="idx === activeIndex && onCardDone()"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.unit-panel__list {
  height: calc(98vh - 150px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.unit-panel__list > :deep(*:first-child) {
  flex: 0 0 60%;
  min-height: 0;
}

.unit-panel__list > :deep(*:last-child) {
  flex: 0 0 40%;
  min-height: 0;
}
</style>
