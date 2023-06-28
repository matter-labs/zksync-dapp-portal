<template>
  <component :is="as" class="back-button-container">
    <ArrowLeftIcon class="arrow-icon" aria-hidden="true" />
  </component>
</template>

<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";

import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
});
</script>

<style lang="scss" scoped>
.back-button-container {
  @apply block w-full pt-5 text-black transition-colors hover:text-gray-600 dark:text-white md:pt-8;

  .arrow-icon {
    @apply h-6 w-6;
  }
}
</style>
