<template>
  <CommonButtonLineWithImg
    class="transaction-line-item"
    as="a"
    :href="transactionUrl"
    :icon="ArrowUpRightIcon"
    target="_blank"
  >
    <template #image>
      <div class="transaction-line-item-icon-container">
        <XMarkIcon v-if="failed" class="transaction-line-item-icon failed-badge-icon" aria-hidden="true" />
        <component v-else-if="icon" :is="icon" class="transaction-line-item-icon" aria-hidden="true" />
      </div>
    </template>
    <template #default>
      <CommonButtonLineBodyInfo class="text-left">
        <template #label v-if="$slots['top-left']">
          <slot name="top-left" />
        </template>
        <template #underline v-if="failed || $slots['bottom-left']">
          <div v-if="failed" class="failed-underline">Failed</div>
          <slot v-else name="bottom-left" />
        </template>
      </CommonButtonLineBodyInfo>
    </template>
    <template #right>
      <CommonButtonLineBodyInfo class="text-right">
        <template #secondary v-if="$slots['top-right']">
          <slot name="top-right" />
        </template>
        <template #underline v-if="$slots['bottom-left']">
          <slot name="bottom-right" />
        </template>
      </CommonButtonLineBodyInfo>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import type { Component, PropType } from "vue";

defineProps({
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
  },
  transactionUrl: {
    type: String,
    required: true,
  },
  failed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.transaction-line-item {
  .transaction-line-item-icon-container {
    @apply relative flex aspect-square h-auto w-full items-center justify-center rounded-full border border-primary-100 bg-primary-100/10 dark:border-none;

    .transaction-line-item-icon {
      @apply h-4 w-4 text-primary-500 dark:text-white;
      &.failed-badge-icon {
        @apply h-5 w-5 text-red-500;
      }
    }
  }
  .failed-underline {
    @apply text-red-500;
  }
}
</style>
