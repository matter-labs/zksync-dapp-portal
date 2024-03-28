<template>
  <div>
    <h1 class="h1 mt-block-gap-1/2 text-center">
      {{ transaction.info.completed ? "Transaction completed" : "Transaction submitted" }}
    </h1>
    <CommonHeightTransition :opened="!transaction.info.completed">
      <p class="mb-4 text-center">
        Your funds will be available after the transaction is committed on
        <span class="font-medium">{{ transaction.from.destination.label }}</span> and then processed on
        <span class="font-medium">{{ transaction.to.destination.label }}</span
        >. You are free to close this page.
      </p>
    </CommonHeightTransition>
    <TransactionProgress
      :from-address="transaction!.from.address"
      :from-destination="transaction!.from.destination"
      :from-explorer-link="l1BlockExplorerUrl"
      :from-transaction-hash="transaction.transactionHash"
      :to-address="transaction!.to.address"
      :to-destination="transaction!.to.destination"
      :to-explorer-link="blockExplorerUrl"
      :to-transaction-hash="transaction.info.toTransactionHash"
      :expected-complete-timestamp="transaction.info.expectedCompleteTimestamp"
      :token="transaction!.token"
      :completed="transaction.info.completed"
      :failed="transaction.info.failed"
    />

    <EcosystemBlock v-if="eraNetwork.displaySettings?.showPartnerLinks" class="mt-block-gap" />
    <CommonButton
      size="sm"
      :as="makeAnotherTransaction ? undefined : 'RouterLink'"
      :to="{ name: 'bridge' }"
      class="mx-auto mt-block-gap w-max"
      @click="makeAnotherTransaction && makeAnotherTransaction()"
    >
      Make another transaction
    </CommonButton>
  </div>
</template>

<script lang="ts" setup>
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

const { l1BlockExplorerUrl } = storeToRefs(useNetworkStore());
const { eraNetwork, blockExplorerUrl } = storeToRefs(useZkSyncProviderStore());
</script>
