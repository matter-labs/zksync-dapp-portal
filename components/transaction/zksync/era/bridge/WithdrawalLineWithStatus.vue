<template>
  <EraTransferLineItem :transfer="transfer" display-date>
    <template #bottom-left>
      <div class="items-center gap-x-1">
        <template v-if="transfer.status === 'loading'">
          <div class="align-middle">Status: <CommonContentLoader :length="25" /></div>
        </template>
        <template v-else-if="transfer.status === 'not-completed'">
          <div>Status: <CommonSpinner class="inline h-4 w-4" /> In Progress.</div>
          <div>
            <CommonTimer :future-date="transfer.expectedCompletionTimestamp" @finish="emit('timer-finished')">
              <template #default="{ timer, isTimerFinished }">
                <template v-if="isTimerFinished">Will be done soon.</template>
                <template v-else
                  >Est. time: <span class="font-mono">{{ timer }}</span></template
                >
              </template>
            </CommonTimer>
          </div>
        </template>
        <template v-else-if="transfer.status === 'completed'">
          <div class="align-middle">Status: <CheckIcon class="-mt-0.5 inline h-4 w-4 dark:text-white" /> Done</div>
        </template>
        <template v-else-if="transfer.status === 'request-failed'">
          <div class="align-middle">Status: <span class="text-red-500">Unknown</span></div>
        </template>
      </div>
    </template>
  </EraTransferLineItem>
</template>

<script lang="ts" setup>
import { CheckIcon } from "@heroicons/vue/24/outline";

import EraTransferLineItem from "@/components/transaction/zksync/era/EraTransferLineItem.vue";

import type { TransferWithStatus } from "@/composables/zksync/era/bridge/withdrawalStatuses";
import type { PropType } from "vue";

defineProps({
  transfer: {
    type: Object as PropType<TransferWithStatus>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "timer-finished"): void;
}>();
</script>

<style lang="scss" scoped></style>
