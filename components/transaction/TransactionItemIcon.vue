<template>
  <div class="relative z-[1] mx-auto -my-4 aspect-square w-max bg-white p-1.5 dark:bg-neutral-900">
    <div class="rounded-lg bg-gray p-2 dark:bg-neutral-800">
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
