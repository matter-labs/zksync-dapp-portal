<template>
  <div>
    <PageTitle>Transfers</PageTitle>

    <template v-if="!isConnected">
      <ConnectWalletBlock>Connect wallet to view your latest transfers on {{ eraNetwork.name }}</ConnectWalletBlock>
    </template>
    <template v-else>
      <template v-if="!loading && recentBridgeOperations.length">
        <TypographyCategoryLabel>Recent bridge operations</TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TransactionTransferLineItem
            v-for="(item, index) in recentBridgeOperations"
            :key="index"
            :transfer="item"
            :to="{
              name: 'transaction-hash',
              params: { hash: item.identifierTransactionHash },
              query: { network: eraNetwork.key },
            }"
          />
        </CommonCardWithLineButtons>

        <TypographyCategoryLabel v-if="!hasOnlyRecentBridgeOperations">Completed transfers</TypographyCategoryLabel>
      </template>

      <div v-if="loading">
        <CommonCardWithLineButtons>
          <TokenBalanceLoader v-for="index in 5" :key="index" />
        </CommonCardWithLineButtons>
      </div>
      <CommonCardWithLineButtons v-else-if="recentTransfersRequestError">
        <CommonErrorBlock @try-again="fetch">
          Loading transfers error: {{ recentTransfersRequestError.message }}
        </CommonErrorBlock>
      </CommonCardWithLineButtons>
      <div v-else-if="displayedTransfers.length">
        <CommonCardWithLineButtons>
          <TransactionTransferLineItem v-for="(item, index) in displayedTransfers" :key="index" :transfer="item" />
        </CommonCardWithLineButtons>

        <!-- Load more -->
        <template v-if="canLoadMore">
          <div v-if="previousTransfersRequestInProgress" class="mt-block-gap">
            <CommonCardWithLineButtons>
              <TokenBalanceLoader v-for="index in 5" :key="index" />
            </CommonCardWithLineButtons>
          </div>
          <CommonCardWithLineButtons v-else-if="previousTransfersRequestError">
            <CommonErrorBlock @try-again="fetchMore">
              Loading transfers error: {{ previousTransfersRequestError.message }}
            </CommonErrorBlock>
          </CommonCardWithLineButtons>
          <CommonButton v-else ref="loadMoreEl" variant="primary" class="mx-auto mt-4">Load more</CommonButton>
        </template>
      </div>
      <CommonCardWithLineButtons v-else-if="!hasOnlyRecentBridgeOperations">
        <CommonEmptyBlock>
          At the moment you don't have any transfers on
          <span class="font-medium">{{ destinations.era.label }}</span>
        </CommonEmptyBlock>
      </CommonCardWithLineButtons>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from "vue";

import { useIntersectionObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";

import useSingleLoading from "@/composables/useSingleLoading";

import type { Transfer } from "@/utils/mappers";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { ESTIMATED_DEPOSIT_DELAY, WITHDRAWAL_DELAY } from "@/store/zksync/transactionStatus";
import { useZkSyncTransactionStatusStore } from "@/store/zksync/transactionStatus";
import { useZkSyncTransfersHistoryStore } from "@/store/zksync/transfersHistory";

const onboardStore = useOnboardStore();
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const transfersHistoryStore = useZkSyncTransfersHistoryStore();
const { account, isConnected } = storeToRefs(onboardStore);
const {
  transfers,
  recentTransfersRequestInProgress,
  recentTransfersRequestError,
  canLoadMore,
  previousTransfersRequestInProgress,
  previousTransfersRequestError,
} = storeToRefs(transfersHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { savedTransactions } = storeToRefs(useZkSyncTransactionStatusStore());

type RecentBridgeOperation = Transfer & { identifierTransactionHash: string };
const recentBridgeOperations = computed<RecentBridgeOperation[]>(() => {
  const recent = savedTransactions.value
    .filter((tx) => tx.from.address === account.value.address)
    .filter(
      (tx) =>
        (tx.type === "withdrawal" && new Date(tx.timestamp).getTime() + WITHDRAWAL_DELAY * 2 > new Date().getTime()) ||
        (tx.type === "deposit" && new Date(tx.timestamp).getTime() + ESTIMATED_DEPOSIT_DELAY * 2 > new Date().getTime())
    );

  return [
    ...recent.map((tx) => {
      return {
        transactionHash: tx.type === "deposit" ? tx.info.toTransactionHash || null : tx.transactionHash,
        identifierTransactionHash: tx.transactionHash,
        type: tx.type,
        from: tx.from.address,
        to: tx.to.address,
        fromNetwork: tx.type === "deposit" ? "L1" : "L2",
        toNetwork: tx.type === "deposit" ? "L2" : "L1",
        amount: tx.token.amount,
        token: tx.token,
        timestamp: tx.timestamp,
      } as RecentBridgeOperation;
    }),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

const displayedTransfers = computed(() => {
  return transfers.value.filter(
    (transfer) => !recentBridgeOperations.value.find((tx) => tx.transactionHash === transfer.transactionHash)
  );
});
const hasOnlyRecentBridgeOperations = computed(() => {
  return !displayedTransfers.value.length && recentBridgeOperations.value.length;
});
const { loading, reset: resetSingleLoading } = useSingleLoading(recentTransfersRequestInProgress);

const fetch = () => {
  if (!isConnected.value) return;
  transfersHistoryStore.requestRecentTransfers();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetSingleLoading();
  fetch();
});

const loadMoreEl = ref(null);
const fetchMore = () => {
  transfersHistoryStore.requestPreviousTransfers();
};
const { stop: stopLoadMoreObserver } = useIntersectionObserver(loadMoreEl, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    fetchMore();
  }
});

onBeforeUnmount(() => {
  unsubscribe();
  stopLoadMoreObserver();
});
</script>

<style lang="scss" scoped></style>
