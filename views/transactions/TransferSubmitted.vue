<template>
  <div>
    <h1 class="h1 mt-block-gap-1/2 text-center">
      {{ transaction.info.completed ? "Transaction completed" : "Transaction submitted" }}
    </h1>
    <CommonHeightTransition :opened="!transaction.info.completed">
      <p class="mb-4 text-center">
        <template v-if="transaction.type !== 'withdrawal'">
          Your funds will be available at the
          <a
            v-if="blockExplorerUrl"
            :href="`${blockExplorerUrl}/address/${transaction!.to.address}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >
          <span v-else>destination address</span>
          after the transaction is committed on the
          <span class="font-medium">{{ transaction.from.destination.label }}</span
          >. You are free to close this page.
        </template>
        <template v-else>
          Your funds will be available on <span class="font-medium">{{ transaction.to.destination.label }}</span> after
          the <a class="underline underline-offset-2" :href="ZKSYNC_WITHDRAWAL_DELAY" target="_blank">24-hour delay</a>.
          During this time, the transaction will be processed and finalized. You are free to close this page.
        </template>
      </p>
    </CommonHeightTransition>
    <TransactionProgress
      :from-address="transaction.from.address"
      :from-destination="transaction.from.destination"
      :to-address="transaction.to.address"
      :to-destination="transaction.to.destination"
      :explorer-link="blockExplorerUrl"
      :transaction-hash="transaction.transactionHash"
      :token="transaction.token"
      :completed="transaction.info.completed"
      :expected-complete-timestamp="transaction.info.expectedCompleteTimestamp"
    />

    <CommonButton as="RouterLink" :to="{ name: 'assets' }" class="mt-block-gap" variant="primary">
      Go to Assets page
    </CommonButton>
    <CommonButton
      size="sm"
      :as="makeAnotherTransaction ? undefined : 'RouterLink'"
      :to="{ name: transaction.type === 'withdrawal' ? 'withdraw' : 'send' }"
      class="mx-auto mt-block-gap w-max"
      @click="makeAnotherTransaction && makeAnotherTransaction()"
    >
      Make another transaction
    </CommonButton>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { TransactionInfo } from "@/store/zksync/transactionStatus";
import type { PropType } from "vue";

import { useZkSyncProviderStore } from "@/store/zksync/provider";

defineProps({
  transaction: {
    type: Object as PropType<TransactionInfo>,
    required: true,
  },
  makeAnotherTransaction: {
    type: Function as PropType<() => void>,
    required: false,
  },
});

const { blockExplorerUrl } = storeToRefs(useZkSyncProviderStore());
</script>
