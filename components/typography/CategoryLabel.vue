<template>
  <component :is="as" class="category-label" :class="{ 'has-padding': padded, 'with-side-content': $slots.right }">
    <slot />
    <slot name="right" />
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
  &.has-padding {
    @apply my-block-gap;
  }
  &.with-side-content {
    @apply flex justify-between gap-block-gap-1/2;
  }
}
</style>
