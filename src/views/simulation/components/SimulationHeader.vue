<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTheme } from "@/composables/useTheme";
import { Moon, Sunny } from "@element-plus/icons-vue";

const { themeMode, applyTheme } = useTheme();

/** 页面顶部实时时钟，每秒刷新 */
const currentTime = ref("");
let timer: ReturnType<typeof setInterval> | null = null;

function updateTime() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function toggleTheme() {
  applyTheme(themeMode.value === "dark" ? "light" : "dark");
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <header class="sim-header">
    <div class="sim-header__left">
      <div class="sim-header__logo">推</div>
      <h1 class="sim-header__title">红蓝博弈推演系统</h1>
    </div>

    <div class="sim-header__right">
      <div class="sim-header__status">
        <el-tag type="success" size="small" effect="dark">推演中</el-tag>
      </div>
      <span class="sim-header__time">{{ currentTime }}</span>
      <el-button
        :icon="themeMode === 'dark' ? Sunny : Moon"
        circle
        size="small"
        @click="toggleTheme"
      />
      <div class="sim-header__user">
        <el-avatar :size="28" icon="UserFilled" />
      </div>
    </div>
  </header>
</template>
