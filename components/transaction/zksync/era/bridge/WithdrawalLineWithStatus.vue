<template>
  <EraTransferLineItem :transfer="transfer" display-date>
    <template #bottom-left>
      <div class="flex flex-wrap items-center gap-x-1">
        <template v-if="!transfer.isCompleted">
          <span>Status: <CommonSpinner class="inline h-4 w-4" /> In Progress.</span>
          <span>
            <CommonTimer :future-date="transfer.expectedCompletionTimestamp">
              <template #default="{ timer, isTimerFinished }">
                <template v-if="isTimerFinished">Will be done soon.</template>
                <template v-else>Est. time: {{ timer }}</template>
              </template>
            </CommonTimer>
          </span>
        </template>
        <template v-else>
          <span class="align-middle">Status: <CheckIcon class="-mt-0.5 inline h-4 w-4 dark:text-white" /> Done</span>
        </template>
      </div>
    </template>
  </EraTransferLineItem>
</template>

<script lang="ts" setup>
import { CheckIcon } from "@heroicons/vue/24/outline";

import EraTransferLineItem from "@/components/transaction/zksync/era/EraTransferLineItem.vue";

import type { TransferWithStatus } from "@/store/zksync/era/transfersStatuses";
import type { PropType } from "vue";

defineProps({
  transfer: {
    type: Object as PropType<TransferWithStatus>,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
