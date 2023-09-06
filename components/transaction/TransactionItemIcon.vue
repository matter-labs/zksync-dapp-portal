<template>
  <div class="transaction-item-icon-container">
    <div class="transaction-item-icon-bg"></div>
    <div class="transaction-item-icon">
      <component :is="icon" class="h-5 w-5" aria-hidden="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
  },
});
</script>

<style lang="scss" scoped>
.transaction-item-icon-container {
  @apply pointer-events-none relative z-10 -my-2.5 h-max w-full;

  .transaction-item-icon-bg {
    @apply absolute inset-0 -z-[1] mx-auto my-auto h-4 w-12 bg-white dark:bg-neutral-900;
  }
  .transaction-item-icon {
    @apply mx-auto h-9 w-9 rounded-lg bg-gray p-2 dark:bg-neutral-800 dark:shadow-[0_0_8px_1px_rgba(0,0,0,0.2)];
  }
}
</style>
