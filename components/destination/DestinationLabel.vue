<template>
  <div class="destination-label">
    <component :is="icon" class="destination-label-img" />
    <div class="destination-label-text">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: [String, Object] as PropType<string | Component>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.destination-label {
  @apply flex items-center space-x-1;
  .destination-label-img {
    @apply h-6 w-6;
  }
  .destination-label-text {
    @apply whitespace-nowrap text-left dark:text-white;
  }
}
</style>
