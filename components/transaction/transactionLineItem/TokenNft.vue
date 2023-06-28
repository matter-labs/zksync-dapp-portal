<template>
  <div>
    <div class="flex items-center justify-end">
      <span v-if="direction" class="relative -top-px mr-[2px] text-xs">{{ direction === "in" ? "+" : "-" }}</span>
      <span class="text-sm font-medium"> {{ symbol }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  symbol: {
    type: String,
    required: true,
  },
  direction: {
    type: String as PropType<"in" | "out" | undefined>,
  },
});
</script>
