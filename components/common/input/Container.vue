<template>
  <component class="input-container" :is="as">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "label",
  },
});
</script>

<style lang="scss" scoped>
.input-container {
  @apply block rounded-3xl bg-neutral-100 px-block-padding-1/2 py-block-padding transition-colors dark:bg-neutral-900 sm:px-block-padding;
}
</style>
