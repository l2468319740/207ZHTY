<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
  /** 进度百分比 0-100 */
  progress: number;
  elapseTime: string;
  duration: string;
}>();

const emit = defineEmits<{
  (e: "seek", timePercent: number): void;
  (e: "step-change", step: number): void;
}>();

// --- playback state ---
const playing = ref(false);
const speed = ref<1 | 2 | 4>(1);
const playMode = ref<"sequential" | "loop" | "single" | "random">("sequential");
const dragging = ref(false);
const modeMenuOpen = ref(false);

// --- refs ---
const trackRef = ref<HTMLElement | null>(null);

// --- time scale ticks (8 hours, hourly marks) ---
const timeMarks = Array.from({ length: 9 }, (_, i) => {
  const h = String(i + 1).padStart(2, "0");
  return `${h}:00:00`;
});

// --- computed ---
const speedLabel = computed(() => `${speed.value}x`);
const modeLabel = computed(() => modeMap[playMode.value]);

/** 播放模式名称映射 */
const modeMap: Record<string, string> = {
  sequential: "顺序播放",
  loop: "循环播放",
  single: "单步播放",
  random: "随机播放",
};

const modeOptions = Object.entries(modeMap) as [
  typeof playMode.value,
  string,
][];

const progressPercent = computed(() => {
  if (dragging.value) return dragPercent.value;
  return props.progress;
});

// --- drag state ---
const dragPercent = ref(props.progress);

/** 将鼠标位置转为 0-100 的百分比 */
function toPercent(clientX: number, el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const pct = ((clientX - rect.left) / rect.width) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function onTrackMouseDown(e: MouseEvent) {
  const el = trackRef.value;
  if (!el) return;
  dragging.value = true;
  dragPercent.value = toPercent(e.clientX, el);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onThumbMouseDown(e: MouseEvent) {
  e.stopPropagation();
  dragging.value = true;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  const el = trackRef.value;
  if (!el || !dragging.value) return;
  dragPercent.value = toPercent(e.clientX, el);
}

function onMouseUp() {
  if (!dragging.value) return;
  dragging.value = false;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  emit("seek", dragPercent.value);
  const step = Math.round((dragPercent.value / 100) * props.totalSteps) || 1;
  emit("step-change", step);
}

function onTickClick(pct: number) {
  dragPercent.value = pct;
  emit("seek", pct);
  const step = Math.round((pct / 100) * props.totalSteps) || 1;
  emit("step-change", step);
}

// --- controls ---
function togglePlay() {
  playing.value = !playing.value;
}

function replay() {
  dragPercent.value = 0;
  emit("seek", 0);
  emit("step-change", 1);
}

/** 倍速切换：1x → 2x → 4x 循环 */
function cycleSpeed() {
  const speeds: (1 | 2 | 4)[] = [1, 2, 4];
  const idx = speeds.indexOf(speed.value);
  speed.value = speeds[(idx + 1) % speeds.length];
}
</script>

<template>
  <div class="sim-progress">
    <!-- controls -->
    <div class="sim-progress__controls">
      <button
        class="sim-progress__btn sim-progress__btn--play"
        :class="{ 'is-active': playing }"
        @click="togglePlay"
      >
        <span class="sim-progress__icon">{{ playing ? "⏸" : "▶" }}</span>
        <span class="sim-progress__btn-label">{{
          playing ? "暂停" : "播放"
        }}</span>
      </button>

      <button
        class="sim-progress__btn sim-progress__btn--replay"
        @click="replay"
      >
        <span class="sim-progress__icon">↺</span>
        <span class="sim-progress__btn-label">重播</span>
      </button>

      <button
        class="sim-progress__btn sim-progress__btn--speed"
        @click="cycleSpeed"
      >
        <span class="sim-progress__icon">⏩</span>
        <span class="sim-progress__btn-label">{{ speedLabel }}</span>
      </button>
    </div>

    <!-- play mode dropdown -->
    <div
      class="sim-progress__mode-dropdown"
      @mouseenter="modeMenuOpen = true"
      @mouseleave="modeMenuOpen = false"
    >
      <span class="sim-progress__mode-trigger">
        {{ modeLabel }} <span class="sim-progress__mode-arrow">▾</span>
      </span>
      <div v-show="modeMenuOpen" class="sim-progress__mode-menu">
        <div
          v-for="[value, label] in modeOptions"
          :key="value"
          class="sim-progress__mode-item"
          :class="{ 'is-active': playMode === value }"
          @click="
            playMode = value;
            modeMenuOpen = false;
          "
        >
          {{ label }}
        </div>
      </div>
    </div>

    <!-- progress track -->
    <div
      ref="trackRef"
      class="sim-progress__track"
      @mousedown="onTrackMouseDown"
    >
      <div class="sim-progress__track-bg">
        <div
          class="sim-progress__filled"
          :style="{ width: progressPercent + '%' }"
        />
        <div
          class="sim-progress__thumb"
          :class="{ 'is-dragging': dragging }"
          :style="{ left: progressPercent + '%' }"
          @mousedown="onThumbMouseDown"
        />
      </div>

      <!-- time scale ticks -->
      <div class="sim-progress__ticks">
        <div
          v-for="(mark, idx) in timeMarks"
          :key="mark"
          class="sim-progress__tick"
          :style="{ left: (idx / (timeMarks.length - 1)) * 100 + '%' }"
          @click.stop="onTickClick((idx / (timeMarks.length - 1)) * 100)"
        >
          <div class="sim-progress__tick-line" />
          <span class="sim-progress__tick-label">{{ mark }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sim-progress {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 16px;
  padding: 14px 18px;
  border: 1px solid var(--app-border);
  background: var(--app-panel);
}

// --- controls ---
.sim-progress__controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.sim-progress__btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  background: var(--app-el-fill);
  color: var(--app-text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--app-primary);
    color: var(--app-primary);
  }
}

.sim-progress__btn--play.is-active {
  background: var(--app-primary);
  border-color: var(--app-primary);
  color: #fff;
}

.sim-progress__icon {
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

.sim-progress__btn-label {
  font-weight: 600;
  font-size: 12px;
}

// --- mode dropdown ---
.sim-progress__mode-dropdown {
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
}

.sim-progress__mode-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  background: var(--app-el-fill);
  color: var(--app-text-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--app-primary);
  }
}

.sim-progress__mode-arrow {
  font-size: 10px;
  color: var(--app-text-secondary);
}

.sim-progress__mode-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 120px;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  background: var(--app-panel);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 20;
  overflow: hidden;
}

.sim-progress__mode-item {
  padding: 8px 14px;
  font-size: 12px;
  color: var(--app-text-primary);
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: var(--app-el-fill);
  }

  &.is-active {
    color: var(--app-primary);
    font-weight: 700;
    background: rgba(64, 158, 255, 0.08);
  }
}

// --- track ---
.sim-progress__track {
  width: 100%;
  padding: 8px 0 0;
  cursor: pointer;
  user-select: none;
}

.sim-progress__track-bg {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: var(--app-el-fill);
  overflow: visible;
}

.sim-progress__filled {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--app-primary), #79bbff);
  transition: width 0.15s ease;
}

.sim-progress__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--app-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: left 0.15s ease;
  cursor: grab;
  z-index: 2;

  &.is-dragging {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 0 6px rgba(64, 158, 255, 0.2);
  }
}

// --- ticks ---
.sim-progress__ticks {
  position: relative;
  height: 28px;
  margin-top: 4px;
}

.sim-progress__tick {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.sim-progress__tick-line {
  width: 1px;
  height: 7px;
  background: var(--app-border);
  margin-bottom: 2px;
}

.sim-progress__tick-label {
  font-size: 10px;
  color: var(--app-text-secondary);
  white-space: nowrap;
  transition: color 0.15s ease;

  .sim-progress__tick:hover & {
    color: var(--app-primary);
  }
}
</style>
