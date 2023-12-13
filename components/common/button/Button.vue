<template>
  <component :is="as" type="button" class="default-button" :class="`variant-${variant}`">
    <span v-if="$slots.icon" class="icon-container">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  variant: {
    type: String as PropType<"default" | "primary" | "primary-bigger" | "primary-solid" | "error">,
    default: "default",
  },
});
</script>

<style lang="scss">
.default-button {
  @apply flex h-14 w-max items-center justify-center rounded-3xl p-4 text-center backdrop-blur-sm transition-colors wrap-balance;
  &:is(label) {
    @apply cursor-pointer;
  }
  &.variant- {
    &default {
      @apply bg-neutral-900;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-neutral-800;
        }
      }
    }
    &default {
      @apply whitespace-nowrap bg-neutral-900 text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-neutral-800;
        }
      }
    }
    &primary,
    &primary-solid {
      @apply whitespace-nowrap bg-primary-100/50 px-6 text-primary-400;
      @apply dark:bg-primary-300 dark:text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-100/75 dark:hover:bg-primary-200;
        }
      }
      &:disabled,
      &[aria-disabled="true"] {
        @apply bg-opacity-50 dark:bg-neutral-800 dark:bg-opacity-50;
      }
    }
    &primary-solid {
      @apply w-full;
    }
    &error {
      @apply bg-red-100/50 text-red-400 dark:bg-red-700 dark:text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-red-100/75 dark:hover:bg-red-600;
        }
      }
    }
  }
  .icon-container {
    @apply -ml-0.5 mr-2 inline-flex items-center;

    svg {
      @apply block h-4 w-4;
    }
  }
}
</style>
