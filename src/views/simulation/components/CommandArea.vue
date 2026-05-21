<script setup lang="ts">
/** 指令条目：title 为指令内容，content[0] 为时间戳 */
export interface CommandSet {
  title: string;
  content: string[];
}

defineProps<{
  redCommands: CommandSet[];
  blueCommands: CommandSet[];
}>();
</script>

<template>
  <div class="command-area">
    <div class="command-card">
      <div class="command-card__header command-card__header--red">红方指令</div>
      <div class="command-card__body">
        <div class="command-steps command-steps--red">
          <div
            v-for="(cmd, idx) in redCommands"
            :key="idx"
            class="command-step"
            :class="{ 'command-step--last': idx === redCommands.length - 1 }"
          >
            <div class="command-step__dot">
              <span class="command-step__num">{{ idx + 1 }}</span>
            </div>
            <div class="command-step__content">
              <div class="command-step__title">{{ cmd.title }}</div>
              <p
                v-for="(line, i) in cmd.content"
                :key="i"
                class="command-step__desc"
              >{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="command-card">
      <div class="command-card__header command-card__header--blue">蓝方指令</div>
      <div class="command-card__body">
        <div class="command-steps command-steps--blue">
          <div
            v-for="(cmd, idx) in blueCommands"
            :key="idx"
            class="command-step"
            :class="{ 'command-step--last': idx === blueCommands.length - 1 }"
          >
            <div class="command-step__dot">
              <span class="command-step__num">{{ idx + 1 }}</span>
            </div>
            <div class="command-step__content">
              <div class="command-step__title">{{ cmd.title }}</div>
              <p
                v-for="(line, i) in cmd.content"
                :key="i"
                class="command-step__desc"
              >{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.command-steps {
  position: relative;
}

.command-step {
  display: flex;
  gap: 12px;
  position: relative;
  padding-bottom: 18px;

  &--last {
    padding-bottom: 0;
  }

  // vertical line between dots
  &:not(&--last)::after {
    content: "";
    position: absolute;
    left: 11px;
    top: 26px;
    bottom: 0;
    width: 2px;
    border-radius: 1px;
  }
}

.command-steps--red .command-step:not(.command-step--last)::after {
  background: rgba(220, 38, 38, 0.18);
}

.command-steps--blue .command-step:not(.command-step--last)::after {
  background: rgba(59, 130, 246, 0.18);
}

.command-step__dot {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 1px;
}

.command-steps--red .command-step__dot {
  background: rgba(220, 38, 38, 0.12);
  border: 2px solid #dc2626;
}

.command-steps--blue .command-step__dot {
  background: rgba(59, 130, 246, 0.12);
  border: 2px solid #3b82f6;
}

.command-step__num {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.command-steps--red .command-step__num {
  color: #dc2626;
}

.command-steps--blue .command-step__num {
  color: #3b82f6;
}

.command-step__content {
  flex: 1;
  min-width: 0;
}

.command-step__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary);
  line-height: 1.5;
}

.command-step__desc {
  margin: 2px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--app-text-secondary);
}
</style>
