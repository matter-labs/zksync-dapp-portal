<template>
  <component class="content-block-container" :is="as">
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
});
</script>

<style lang="scss" scoped>
.content-block-container {
  @apply block h-max w-full rounded-3xl bg-neutral-100 px-block-padding-1/2 py-block-padding dark:bg-neutral-900 sm:px-block-padding;
}
</style>
