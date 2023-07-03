<template>
  <div>
    <div v-if="recentTransfersRequestInProgress">
      <TypographyCategoryLabel>
        <CommonContentLoader :length="22" />
      </TypographyCategoryLabel>
      <CommonCardWithLineButtons>
        <TokenBalanceLoader v-for="index in 5" :key="index" />
      </CommonCardWithLineButtons>
    </div>
    <CommonCardWithLineButtons v-else-if="recentTransfersRequestError">
      <CommonErrorBlock @try-again="fetch">
        Loading transactions error: {{ recentTransfersRequestError.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <div v-else-if="transfers.length">
      <div v-for="(group, index) in transactionsGroups" :key="index">
        <TypographyCategoryLabel>
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <EraTransferLineItem v-for="(item, index) in group.transactions" :key="index" :transfer="item" />
        </CommonCardWithLineButtons>
      </div>

      <!-- Load more -->
      <template v-if="canLoadMore">
        <div v-if="previousTransfersRequestInProgress">
          <TypographyCategoryLabel>
            <CommonContentLoader :length="22" />
          </TypographyCategoryLabel>
          <CommonCardWithLineButtons>
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </CommonCardWithLineButtons>
        </div>
        <CommonCardWithLineButtons v-else-if="previousTransfersRequestError">
          <CommonErrorBlock @try-again="fetchMore">
            Loading transactions error: {{ previousTransfersRequestError.message }}
          </CommonErrorBlock>
        </CommonCardWithLineButtons>
        <CommonButton v-else ref="loadMoreEl" class="mx-auto mt-4">Load more</CommonButton>
      </template>
    </div>
    <CommonCardWithLineButtons v-else>
      <CommonEmptyBlock>
        At the moment you don't have any transactions on
        <span class="font-medium">{{ destinations.era.label }}</span>
      </CommonEmptyBlock>
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";

import { useIntersectionObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";

import EraTransferLineItem from "@/components/transaction/zksync/era/EraTransferLineItem.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { groupTransactionsByDate } from "@/utils/mappers";

const onboardStore = useOnboardStore();
const eraTransfersHistoryStore = useEraTransfersHistoryStore();
const {
  transfers,
  recentTransfersRequestInProgress,
  recentTransfersRequestError,
  canLoadMore,
  previousTransfersRequestInProgress,
  previousTransfersRequestError,
} = storeToRefs(eraTransfersHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const transactionsGroups = groupTransactionsByDate(transfers, (transaction) => new Date(transaction.timestamp));

const fetch = () => {
  eraTransfersHistoryStore.requestRecentTransfers();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
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
  stopLoadMoreObserver();
});
</script>

<style lang="scss" scoped></style>
