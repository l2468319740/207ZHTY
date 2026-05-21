<script setup lang="ts">
import type { LossCategory } from "@/mock/simulation";

defineProps<{
  /** 损耗对比分类数据，每行以红蓝较大值为 100% 计算柱宽 */
  data: LossCategory[];
}>();
</script>

<template>
  <div class="loss-chart">
    <h3 class="loss-chart__title">红蓝双方损耗对比</h3>

    <div class="loss-chart__legend">
      <span class="loss-chart__legend-item">
        <i class="loss-chart__dot loss-chart__dot--red" /> 红方
      </span>
      <span class="loss-chart__legend-item">
        <i class="loss-chart__dot loss-chart__dot--blue" /> 蓝方
      </span>
    </div>

    <div class="loss-chart__rows">
      <div
        v-for="item in data"
        :key="item.name"
        class="loss-chart__row"
      >
        <!-- 红方柱子：从右向左 -->
        <div class="loss-chart__side loss-chart__side--red">
          <span class="loss-chart__val loss-chart__val--red">{{ item.redValue }}</span>
          <div class="loss-chart__track">
            <div
              class="loss-chart__bar loss-chart__bar--red"
              :style="{ width: (item.redValue / Math.max(item.redValue, item.blueValue)) * 100 + '%' }"
            />
          </div>
        </div>

        <!-- 中间标签 -->
        <span class="loss-chart__label">{{ item.name }}</span>

        <!-- 蓝方柱子：从左向右 -->
        <div class="loss-chart__side loss-chart__side--blue">
          <div class="loss-chart__track">
            <div
              class="loss-chart__bar loss-chart__bar--blue"
              :style="{ width: (item.blueValue / Math.max(item.redValue, item.blueValue)) * 100 + '%' }"
            />
          </div>
          <span class="loss-chart__val loss-chart__val--blue">{{ item.blueValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loss-chart {
  padding: 16px;
  border: 1px solid var(--app-border);
  background: var(--app-panel);
}

.loss-chart__title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}

.loss-chart__legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 14px;
}

.loss-chart__legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.loss-chart__dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.loss-chart__dot--red {
  background: linear-gradient(135deg, #dc2626, #fca5a5);
}

.loss-chart__dot--blue {
  background: linear-gradient(135deg, #3b82f6, #93c5fd);
}

.loss-chart__rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loss-chart__row {
  display: flex;
  align-items: center;
}

.loss-chart__label {
  width: 80px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-primary);
  text-align: center;
  line-height: 1.3;
}

.loss-chart__side {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 6px;
}

.loss-chart__side--red {
  justify-content: flex-end;
}

.loss-chart__side--blue {
  justify-content: flex-start;
}

.loss-chart__track {
  flex: 1;
  height: 22px;
  border-radius: 4px;
  background: var(--app-el-fill);
  overflow: hidden;
}

.loss-chart__bar {
  height: 100%;
  transition: width 0.5s ease;
  min-width: 4px;
}

.loss-chart__bar--red {
  background: linear-gradient(90deg, #fca5a5, #dc2626);
  border-radius: 4px 0 0 4px;
  float: right;
}

.loss-chart__bar--blue {
  background: linear-gradient(90deg, #3b82f6, #93c5fd);
  border-radius: 0 4px 4px 0;
}

.loss-chart__val {
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  width: 36px;
}

.loss-chart__val--red {
  color: #dc2626;
  text-align: right;
  margin-right: 6px;
}

.loss-chart__val--blue {
  color: #3b82f6;
  text-align: left;
  margin-left: 6px;
}
</style>
