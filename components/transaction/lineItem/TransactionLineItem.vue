<template>
  <CommonButtonLineWithImg
    class="transaction-line-item"
    :as="transactionUrl ? 'a' : 'button'"
    :href="transactionUrl"
    :icon="transactionUrl ? ArrowUpRightIcon : DocumentDuplicateIcon"
    target="_blank"
    @click="!transactionUrl && copy()"
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
      <CommonButtonLineBodyInfo ref="el" class="text-right">
        <template #secondary v-if="$slots['top-right']">
          <slot name="top-right" />
        </template>
        <template #underline v-if="$slots['bottom-right']">
          <slot name="bottom-right" />
        </template>
      </CommonButtonLineBodyInfo>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useTippy } from "vue-tippy";

import { ArrowUpRightIcon, DocumentDuplicateIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import useCopy from "@/composables/useCopy";

import type { Component, PropType } from "vue";

const props = defineProps({
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  explorerUrl: {
    type: String,
  },
  failed: {
    type: Boolean,
    default: false,
  },
});

const el = ref<{ $el?: HTMLButtonElement } | undefined>();
const { copy, copied } = useCopy(computed(() => props.transactionHash));
const a = useTippy(
  computed(() => el.value?.$el?.parentElement?.parentElement || undefined),
  {
    content: "Transaction hash copied!",
    trigger: "manual",
    hideOnClick: false,
  }
);
watch(
  copied,
  (copied) => {
    if (copied) {
      a.show();
    } else {
      a.hide();
    }
  },
  { immediate: true }
);

const transactionUrl = computed(() => {
  if (!props.explorerUrl) {
    return undefined;
  }
  return `${props.explorerUrl}/tx/${props.transactionHash}`;
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
