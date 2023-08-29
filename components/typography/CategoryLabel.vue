<template>
  <component :is="as" class="category-label" :class="{ 'has-padding': padded }">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  padded: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.category-label {
  @apply text-sm font-medium text-gray-secondary dark:text-neutral-200;
  &.has-padding {
    @apply py-4;
  }
}
</style>
