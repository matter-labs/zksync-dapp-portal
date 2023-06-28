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
        <CommonCardWithLineButtons>
          <EraTransactionLineItem v-for="(item, index) in group.transactions" :key="index" :transaction="item" />
        </CommonCardWithLineButtons>
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
        <span class="font-medium">{{ destinations.era.label }}</span>
      </CommonEmptyBlock>
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";

import { useIntersectionObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";

import EraTransactionLineItem from "@/components/transaction/zksync/era/EraTransactionLineItem.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraTransactionsHistoryStore } from "@/store/zksync/era/transactionsHistory";
import { groupTransactionsByDate } from "@/utils/mappers";

const onboardStore = useOnboardStore();
const eraTransactionsHistoryStore = useEraTransactionsHistoryStore();
const {
  transactions,
  recentTransactionsRequestInProgress,
  recentTransactionsRequestError,
  canLoadMore,
  previousTransactionsRequestInProgress,
  previousTransactionsRequestError,
} = storeToRefs(eraTransactionsHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const transactionsGroups = groupTransactionsByDate(transactions, (transaction) => new Date(transaction.receivedAt));

const fetch = () => {
  eraTransactionsHistoryStore.requestRecentTransactions();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
});

const loadMoreEl = ref(null);
const fetchMore = () => {
  eraTransactionsHistoryStore.requestPreviousTransactions();
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
