<template>
  <div ref="containerElement" :class="{ 'active-tab-bg-inited': activeTabBgInited }" class="badge-tabs-container">
    <div class="active-tab-bg" :style="activeTabBgStyles"></div>
    <ul class="badge-tabs-list">
      <li
        v-for="item in options"
        ref="tabElements"
        class="badge-tab"
        :class="{ active: item.key === selected }"
        :key="item.key"
        @click.prevent="selected = item.key"
      >
        <slot name="tab" :item="item">
          <div>{{ item.label }}</div>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useElementBounding } from "@vueuse/core";

import type { PropType } from "vue";

export type TabsOption = {
  label: string;
  key: string;
};

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  options: {
    type: Array as PropType<TabsOption[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value?: string): void;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (value?: string) => emit("update:modelValue", value),
});

const indexOfActiveTab = computed(() => {
  if (!selected.value) return -1;
  return props.options.map((e) => e.key).indexOf(selected.value);
});
const containerElement = ref<null | HTMLElement>(null);
const { left: containerPositionLeft } = useElementBounding(containerElement);
const tabElements = ref<HTMLElement[]>([]);
const activeTabElement = computed(() => tabElements.value[indexOfActiveTab.value]);
const { width: activeTabWidth, left: activeTabPositionLeft } = useElementBounding(activeTabElement);
const activeTabBgStyles = computed(() => ({
  width: `${activeTabWidth.value}px`,
  left: `${activeTabPositionLeft.value - containerPositionLeft.value}px`,
}));
const activeTabBoundingFound = computed(() => activeTabWidth.value > 0);
const activeTabBgInited = ref(false);
watch(
  activeTabBoundingFound,
  (val) => {
    if (val) {
      setTimeout(() => {
        activeTabBgInited.value = true;
      }, 0);
    } else {
      activeTabBgInited.value = false;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.badge-tabs-container {
  @apply relative isolate w-full;

  &.active-tab-bg-inited {
    .badge-tab.active > * {
      @apply bg-transparent;
    }
    .active-tab-bg {
      @apply bg-white transition-all dark:bg-neutral-800;
    }
  }
  &:not(.active-tab-bg-inited) {
    .badge-tab.active > * {
      @apply bg-white dark:bg-neutral-800;
    }
  }

  .badge-tabs-list {
    @apply grid w-full grid-flow-col-dense grid-cols-[max-content] gap-2;
  }
  .badge-tab > *,
  .active-tab-bg {
    @apply rounded-2xl;
  }
  .badge-tab {
    @apply w-max;
    & > * {
      @apply block w-max cursor-pointer whitespace-nowrap px-4 py-1 font-medium leading-loose text-gray-secondary transition-colors dark:text-neutral-400;
    }
    & > * :hover,
    &.active > * {
      @apply text-black dark:text-white;
    }
  }
  .active-tab-bg {
    @apply absolute -z-[1] h-full;
  }
}
</style>
