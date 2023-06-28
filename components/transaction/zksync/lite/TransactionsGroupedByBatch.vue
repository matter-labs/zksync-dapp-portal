<template>
  <div>
    <CommonCardWithLineButtons
      class="my-1.5 first:mt-0 last:mb-0"
      v-for="(batch, batchIndex) in batches"
      :key="batchIndex"
    >
      <ZkSyncLiteTransactionLineItem v-for="item in batch" :key="item.txHash" as="div" :transaction="item" />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ZkSyncLiteTransactionLineItem from "@/components/transaction/zksync/lite/ZkSyncLiteTransactionLineItem.vue";

import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { PropType } from "vue";

const props = defineProps({
  transactions: {
    type: Array as PropType<ZkSyncLiteTransaction[]>,
    required: true,
  },
});

const batches = computed(() => {
  const batches: ZkSyncLiteTransaction[][] = [];
  let currentBatch: ZkSyncLiteTransaction[] = [];
  const addLastBatchAndClear = () => {
    if (currentBatch.length > 0) {
      batches.push(currentBatch.reverse());
      currentBatch = [];
    }
  };

  for (const transaction of props.transactions) {
    if (transaction.batch.id === undefined) {
      addLastBatchAndClear();
      batches.push([transaction]);
    } else {
      if (currentBatch.length === 0) {
        currentBatch.push(transaction);
      } else {
        const lastBatchTransaction = currentBatch[currentBatch.length - 1];
        if (lastBatchTransaction.batch.id === transaction.batch.id) {
          currentBatch.push(transaction);
        } else {
          addLastBatchAndClear();
          currentBatch.push(transaction);
        }
      }
    }
  }
  addLastBatchAndClear();
  return batches;
});
</script>
