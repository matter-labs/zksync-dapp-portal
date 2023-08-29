<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <template #animation>
      <AnimationsProgressPlane v-if="inProgress" class="w-72" />
      <Vue3Lottie v-else class="w-72" :animation-data="SuccessConfetti" :loop="false" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">
        {{ inProgress ? "Transaction submitted" : "Transaction completed" }}
      </div>
      <CommonCardWithLineButtons v-if="transactionsRequestInProgress">
        <TokenBalanceLoader v-for="index in transactionHashes.length" :key="index" />
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons v-else-if="transactionsRequestError">
        <CommonErrorBlock class="m-2" @try-again="fetch">
          {{ transactionsRequestError.message }}
        </CommonErrorBlock>
      </CommonCardWithLineButtons>
      <template v-else>
        <CommonCardWithLineButtons>
          <ZkSyncLiteTransactionLineItem v-for="(item, index) in transactions" :key="index" :transaction="item" />
        </CommonCardWithLineButtons>
      </template>

      <CommonAlert v-if="inProgress" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available at the
          <a
            v-if="blockExplorerUrl"
            :href="`${blockExplorerUrl}/address/${mainTransaction?.to}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >
          <span v-else>destination address</span>
          after the transaction is committed on the <span class="font-medium">{{ destinations.zkSyncLite.label }}</span
          >. You are free to close this page.
        </p>
        <a
          v-if="blockExplorerUrl"
          :href="`${blockExplorerUrl}/tx/${mainTransaction?.txHash}`"
          target="_blank"
          class="alert-link"
        >
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
      <CommonAlert v-else class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Your funds should now be available at the
          <a
            v-if="blockExplorerUrl"
            :href="`${blockExplorerUrl}/address/${mainTransaction?.to}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >
          <span v-else>destination address</span>.
        </p>
      </CommonAlert>

      <TransactionConfirmModalFooter>
        <CommonButtonTopLink as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          Make another transaction
        </CommonButtonTopLink>
        <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto" variant="primary-solid">
          Go to Assets page
        </CommonButton>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";

import { ArrowUpRightIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import ZkSyncLiteTransactionLineItem from "@/components/transaction/zksync/lite/ZkSyncLiteTransactionLineItem.vue";

import useTransactionsReceipt from "@/composables/zksync/lite/useTransactionsReceipts";

import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";

const props = defineProps({
  transactionHashes: {
    type: Array as PropType<string[]>,
    required: true,
  },
  inProgress: {
    type: Boolean,
    default: true,
  },
});

const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl } = storeToRefs(useLiteProviderStore());
const liteProviderStore = useLiteProviderStore();
const liteTokensStore = useLiteTokensStore();
const { tokens } = storeToRefs(liteTokensStore);
const { transactions, transactionsRequestInProgress, transactionsRequestError, requestTransactions } =
  useTransactionsReceipt(liteProviderStore.requestProvider, () =>
    liteTokensStore.requestTokens().then(() => (tokens.value ? Object.values(tokens.value) : []))
  );
const mainTransaction = computed(() => transactions.value?.find((e) => e.type === "Transfer"));

const fetch = () => {
  requestTransactions(props.transactionHashes);
};

watch(
  () => props.transactionHashes,
  () => {
    fetch();
  },
  { immediate: true }
);
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
