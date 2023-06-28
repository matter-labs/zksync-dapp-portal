<template>
  <component :is="as" type="button" class="label-button">
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
});
</script>

<style lang="scss" scoped>
.lite.dark {
  .label-button {
    @apply text-primary-300;
    &:enabled,
    &:is(a) {
      &:not([aria-disabled="true"]) {
        @apply hover:text-primary-200;
      }
    }
  }
}
.label-button {
  @apply block text-sm font-medium text-primary-400 transition-colors dark:text-primary-500;
  &:enabled,
  &:is(a) {
    &:not([aria-disabled="true"]) {
      @apply hover:text-primary-300 dark:hover:text-primary-400;
    }
  }
}
</style>
