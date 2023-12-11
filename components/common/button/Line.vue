<template>
  <component :is="as" class="line-button-container" :class="`variant-${variant}`">
    <slot />
  </component>
</template>

<script lang="ts">
export type LineVariant = "default" | "primary";
export const LineDefaultVariant = "default";
</script>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  variant: {
    type: String as PropType<LineVariant>,
    default: LineDefaultVariant,
  },
});
</script>

<style lang="scss" scoped>
.line-button-container {
  @apply w-full rounded-[1.24rem] px-block-padding-1/4 py-block-padding-1/2 transition-colors sm:px-block-padding-1/2;
  &:enabled,
  &:is(a) {
    &:not([aria-disabled="true"]) {
      @apply cursor-pointer;
    }
  }
  &:disabled,
  &[aria-disabled="true"] {
    @apply cursor-not-allowed opacity-75;
  }

  &.variant- {
    &default {
      @apply bg-white dark:bg-neutral-900;

      &:enabled,
      &:is(a) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-gray-50 dark:hover:bg-neutral-800;
        }
      }
    }
    &primary {
      @apply bg-primary-400;

      &:enabled,
      &:is(a) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-300;
        }
      }
    }
  }
}
</style>
