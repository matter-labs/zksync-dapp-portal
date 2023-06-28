<template>
  <div>
    <component :is="as" class="input-container" :class="{ focused, 'has-value': !!inputted, 'has-error': !!error }">
      <div class="input-left-side">
        <div v-if="placeholder" class="input-placeholder">{{ placeholder }}</div>
        <input
          ref="inputElement"
          v-model="inputted"
          class="input-field"
          :placeholder="placeholder"
          :type="type"
          spellcheck="false"
        />
      </div>
      <div v-if="$slots.icon" class="input-icon-container">
        <slot name="icon" />
      </div>
    </component>
    <CommonHeightTransition :opened="!!error">
      <div class="mt-1 text-xs text-red-500">{{ lastError }}</div>
    </CommonHeightTransition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useFocus } from "@vueuse/core";

import type { Component, PropType } from "vue";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "label",
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string): void;
}>();

const inputElement = ref<HTMLInputElement | null>(null);
const { focused } = useFocus(inputElement, { initialValue: !!props.autofocus });

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const lastError = ref(props.error);
watch(
  () => props.error,
  (value) => {
    lastError.value = value;
  }
);
</script>

<style lang="scss">
.input-container {
  @apply flex h-14 w-full items-center justify-between rounded-2xl bg-gray-input px-4 py-2 transition-colors dark:bg-neutral-900;
  &.focused,
  &:hover {
    @apply bg-gray-input-focus dark:bg-neutral-800;
  }
  &:not(.focused):not(.has-value) {
    .input-left-side .input-placeholder {
      @apply translate-y-2.5 transform text-sm;
    }
  }
  &.has-error {
    @apply ring-1 ring-inset ring-red-500;
  }

  .input-icon-container {
    @apply ml-2 flex h-6 w-6 items-center justify-center text-gray-secondary dark:text-neutral-400;

    svg {
      @apply block aspect-square h-full w-full;
    }
  }
  .input-left-side {
    @apply flex w-full flex-col justify-center whitespace-nowrap;

    .input-placeholder {
      @apply text-xs text-gray-secondary transition-all dark:text-neutral-400;
    }
    .input-field {
      @apply w-full border-none bg-transparent outline-none placeholder:text-transparent;
    }
  }
}
</style>
