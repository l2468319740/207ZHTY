<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { CommanderMessage } from "@/mock/simulation";

const props = defineProps<{
  /** 指挥官数据 */
  commander: CommanderMessage;
  /** 红蓝方标识 */
  side: "red" | "blue";
  /** 挂载后是否自动开始打字 */
  autoStart?: boolean;
}>();

const emit = defineEmits<{
  done: [];
}>();

const visibleParagraphs = ref<number>(0);
const currentText = ref("");
const isTyping = ref(false);
const isDone = ref(false);

let typingTimer: ReturnType<typeof setTimeout> | null = null;
let paragraphDelayTimer: ReturnType<typeof setTimeout> | null = null;

/** 逐字打字效果：递归 setTimeout，每字符间隔 30~50ms，段间延迟 400ms */
function typeParagraph(paragraphIndex: number, charIndex: number) {
  const paragraph = props.commander.paragraphs[paragraphIndex];
  if (!paragraph) {
    isTyping.value = false;
    isDone.value = true;
    emit("done");
    return;
  }

  if (charIndex === 0) {
    currentText.value = "";
    isTyping.value = true;
    visibleParagraphs.value = paragraphIndex + 1;
  }

  if (charIndex < paragraph.length) {
    currentText.value += paragraph[charIndex];
    typingTimer = setTimeout(() => {
      typeParagraph(paragraphIndex, charIndex + 1);
    }, 30 + Math.random() * 20);
  } else {
    currentText.value += "\n\n";
    paragraphDelayTimer = setTimeout(() => {
      typeParagraph(paragraphIndex + 1, 0);
    }, 400);
  }
}

/** 由父组件通过 expose 调用，启动打字动画 */
function start() {
  typeParagraph(0, 0);
}

/** 清理所有进行中的定时器 */
function stop() {
  if (typingTimer) clearTimeout(typingTimer);
  if (paragraphDelayTimer) clearTimeout(paragraphDelayTimer);
}

onMounted(() => {
  if (props.autoStart) {
    start();
  }
});

onUnmounted(() => {
  stop();
});

defineExpose({ start });
</script>

<template>
  <div class="commander-card">
    <div class="commander-card__header">
      <div
        class="commander-card__avatar"
        :class="side === 'red' ? 'commander-card__avatar--red' : 'commander-card__avatar--blue'"
      >{{ commander.icon }}</div>
      <div class="commander-card__info">
        <span class="commander-card__name">{{ commander.name }}</span>
        <span class="commander-card__role">{{ commander.role }}</span>
      </div>
      <span
        v-if="isDone"
        class="commander-card__badge commander-card__badge--done"
      >完成</span>
      <span
        v-else-if="isTyping"
        class="commander-card__badge commander-card__badge--typing"
      >输出中...</span>
    </div>

    <div class="commander-card__body">
      <div class="commander-card__text">
        <template v-for="(para, idx) in commander.paragraphs" :key="idx">
          <p
            v-if="idx < visibleParagraphs - 1"
            class="commander-card__paragraph"
          >{{ para }}</p>
        </template>
        <p v-if="isTyping || isDone" class="commander-card__paragraph commander-card__paragraph--live">
          {{ currentText }}
          <span v-if="isTyping" class="commander-card__cursor">|</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.commander-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background: var(--app-panel);
}

.commander-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--app-border);
  flex-shrink: 0;
}

.commander-card__avatar {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.commander-card__avatar--red {
  background: linear-gradient(135deg, #fca5a5, #dc2626);
}

.commander-card__avatar--blue {
  background: linear-gradient(135deg, #93c5fd, #3b82f6);
}

.commander-card__info {
  flex: 1;
  min-width: 0;
}

.commander-card__name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.commander-card__role {
  display: block;
  font-size: 12px;
  color: var(--app-text-secondary);
  margin-top: 2px;
}

.commander-card__badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  flex-shrink: 0;
}

.commander-card__badge--typing {
  background: var(--app-bg-accent-1);
  color: var(--app-primary);
}

.commander-card__badge--done {
  background: rgba(103, 194, 58, 0.12);
  color: var(--app-success);
}

.commander-card__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.commander-card__text {
  font-size: 13px;
  line-height: 1.8;
  color: var(--app-text-secondary);
}

.commander-card__paragraph {
  margin: 0;
  white-space: pre-wrap;
}

.commander-card__paragraph + .commander-card__paragraph {
  margin-top: 10px;
}

.commander-card__cursor {
  display: inline-block;
  color: var(--app-primary);
  font-weight: 400;
  animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
