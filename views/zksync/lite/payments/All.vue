<template>
  <div>
    <div v-if="recentTransactionsRequestInProgress">
      <TypographyCategoryLabel>
        <CommonContentLoader :length="22" />
      </TypographyCategoryLabel>
      <CommonCardWithLineButtons>
        <TokenBalanceLoader v-for="index in 5" :key="index" />
      </CommonCardWithLineButtons>
    </div>
    <CommonCardWithLineButtons v-else-if="recentTransactionsRequestError">
      <CommonErrorBlock @try-again="fetch">
        Loading transactions error: {{ recentTransactionsRequestError.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <div v-else-if="transactions.length">
      <div v-for="(group, index) in transactionsGroups" :key="index">
        <TypographyCategoryLabel>
          {{ group.title }}
        </TypographyCategoryLabel>
        <TransactionsGroupedByBatch :transactions="group.transactions" />
      </div>

      <!-- Load more -->
      <template v-if="canLoadMore">
        <div v-if="previousTransactionsRequestInProgress">
          <TypographyCategoryLabel>
            <CommonContentLoader :length="22" />
          </TypographyCategoryLabel>
          <CommonCardWithLineButtons>
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </CommonCardWithLineButtons>
        </div>
        <CommonCardWithLineButtons v-else-if="previousTransactionsRequestError">
          <CommonErrorBlock @try-again="fetchMore">
            Loading transactions error: {{ previousTransactionsRequestError.message }}
          </CommonErrorBlock>
        </CommonCardWithLineButtons>
        <CommonButton v-else ref="loadMoreEl" class="mx-auto mt-4">Load more</CommonButton>
      </template>
    </div>
    <CommonCardWithLineButtons v-else>
      <CommonEmptyBlock>
        At the moment you don't have any transactions on
        <span class="font-medium">{{ destinations.zkSyncLite.label }}</span>
      </CommonEmptyBlock>
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";

import { useIntersectionObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";

import TransactionsGroupedByBatch from "@/components/transaction/zksync/lite/TransactionsGroupedByBatch.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";
import { groupTransactionsByDate } from "@/utils/mappers";

const onboardStore = useOnboardStore();
const liteTransactionsHistoryStore = useLiteTransactionsHistoryStore();
const {
  transactions,
  recentTransactionsRequestInProgress,
  recentTransactionsRequestError,
  canLoadMore,
  previousTransactionsRequestInProgress,
  previousTransactionsRequestError,
} = storeToRefs(liteTransactionsHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const transactionsGroups = groupTransactionsByDate(transactions, (transaction) => new Date(transaction.createdAt!));

const fetch = () => {
  liteTransactionsHistoryStore.requestRecentTransactions();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
});

const loadMoreEl = ref(null);
const fetchMore = () => {
  liteTransactionsHistoryStore.requestPreviousTransactions();
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
