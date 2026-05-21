import { ref } from "vue";

export type ThemeMode = "light" | "dark";

/** localStorage 存储键名 */
const THEME_STORAGE_KEY = "app-theme-mode";

/** 从 localStorage 读取保存的主题偏好，默认 light */
function getSavedTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "dark" ? "dark" : "light";
}

const themeMode = ref<ThemeMode>(getSavedTheme());

/** 将主题应用到 document：设置 data-theme 属性、dark class、colorScheme，并持久化到 localStorage */
export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  themeMode.value = mode;
}

/** 应用启动时调用，恢复用户上次保存的主题偏好 */
export function initializeTheme() {
  applyTheme(themeMode.value);
}

export function useTheme() {
  return {
    themeMode,
    applyTheme,
  };
}
