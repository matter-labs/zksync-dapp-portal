<template>
  <div>
    <PageTitle>Transactions</PageTitle>

    <template v-if="!isConnected">
      <ConnectWalletBlock />
    </template>
    <template v-else>
      <template v-if="recentWithdrawals.length">
        <TypographyCategoryLabel>Recent withdrawals</TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TransactionTransferWithdrawalLineItem
            v-for="(item, index) in recentWithdrawals"
            :key="index"
            :transfer="item"
            @timer-finished="() => updateSingleWithdrawal(item.transactionHash!)"
          />
        </CommonCardWithLineButtons>

        <TypographyCategoryLabel>Completed transactions</TypographyCategoryLabel>
      </template>

      <div v-if="loading">
        <CommonCardWithLineButtons>
          <TokenBalanceLoader v-for="index in 5" :key="index" />
        </CommonCardWithLineButtons>
      </div>
      <CommonCardWithLineButtons v-else-if="recentTransfersRequestError">
        <CommonErrorBlock @try-again="fetch">
          Loading transactions error: {{ recentTransfersRequestError.message }}
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
              Loading transactions error: {{ previousTransfersRequestError.message }}
            </CommonErrorBlock>
          </CommonCardWithLineButtons>
          <CommonButton v-else ref="loadMoreEl" variant="primary" class="mx-auto mt-4">Load more</CommonButton>
        </template>
      </div>
      <CommonCardWithLineButtons v-else>
        <CommonEmptyBlock>
          At the moment you don't have any transactions on
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

import useInterval from "@/composables/useInterval";
import useSingleLoading from "@/composables/useSingleLoading";
import useWithdrawalStatuses from "@/composables/zksync/useBridgeWithdrawalStatuses";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { useZkSyncTransfersHistoryStore } from "@/store/zksync/transfersHistory";

const onboardStore = useOnboardStore();
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const eraTransfersHistoryStore = useZkSyncTransfersHistoryStore();
const { isConnected } = storeToRefs(onboardStore);
const {
  transfers,
  recentTransfersRequestInProgress,
  recentTransfersRequestError,
  canLoadMore,
  previousTransfersRequestInProgress,
  previousTransfersRequestError,
} = storeToRefs(eraTransfersHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { recentWithdrawals, updateAllWithdrawalStatuses, updateWithdrawalStatus } = useWithdrawalStatuses();

const displayedTransfers = computed(() => {
  return transfers.value.filter(
    (transfer) => !recentWithdrawals.value.find((w) => w.transactionHash === transfer.transactionHash)
  );
});
const { loading, reset: resetSingleLoading } = useSingleLoading(recentTransfersRequestInProgress);

const updateSingleWithdrawal = (transactionHash: string) => {
  if (!eraNetwork.value.blockExplorerApi) return;
  updateWithdrawalStatus(transactionHash, true);
};

const fetch = () => {
  if (!isConnected.value) return;
  eraTransfersHistoryStore.requestRecentTransfers();
};
fetch();
const fetchWithdrawalStatuses = () => {
  if (eraNetwork.value.blockExplorerApi) {
    updateAllWithdrawalStatuses();
  }
};
fetchWithdrawalStatuses();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetchWithdrawalStatuses();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetSingleLoading();
  fetch();
  resetAutoUpdate();
  fetchWithdrawalStatuses();
});

const loadMoreEl = ref(null);
const fetchMore = () => {
  eraTransfersHistoryStore.requestPreviousTransfers();
};
const { stop: stopLoadMoreObserver } = useIntersectionObserver(loadMoreEl, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    fetchMore();
  }
});

onBeforeUnmount(() => {
  unsubscribe();
  stopAutoUpdate();
  stopLoadMoreObserver();
});
</script>

<style lang="scss" scoped></style>
