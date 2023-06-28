<template>
  <div>
    <CommonContentBlock>
      <CommonButtonGroup class="mb-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era-swap' }">
          <template #icon>
            <ArrowsRightLeftIcon aria-hidden="true" />
          </template>
          <template #default>Swap</template>
        </CommonButton>
      </CommonButtonGroup>
      <div>
        <div class="flex items-center justify-between py-4">
          <TypographyCategoryLabel as="h2" :padded="false">Transactions</TypographyCategoryLabel>
          <CommonLabelButton as="RouterLink" :to="{ name: 'payments-all' }">View all</CommonLabelButton>
        </div>
        <div class="-mx-2 -mt-1 -mb-2">
          <template v-if="recentTransactionsRequestInProgress">
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </template>
          <div v-else-if="recentTransactionsRequestError" class="m-3 mb-2.5 -mt-1">
            <CommonErrorBlock @try-again="fetch">
              {{ recentTransactionsRequestError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="transactions.length">
            <EraTransactionLineItem
              v-for="(item, index) in transactions.slice(0, 5)"
              :key="index"
              :transaction="item"
              display-date
            />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1">
              You currently don't have any transactions on
              <span class="font-medium">{{ destinations.era.label }}</span>
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";

import { ArrowsRightLeftIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import EraTransactionLineItem from "@/components/transaction/zksync/era/EraTransactionLineItem.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraTransactionsHistoryStore } from "@/store/zksync/era/transactionsHistory";

const onboardStore = useOnboardStore();
const eraTransactionsHistoryStore = useEraTransactionsHistoryStore();
const { transactions, recentTransactionsRequestInProgress, recentTransactionsRequestError } =
  storeToRefs(eraTransactionsHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const fetch = () => {
  eraTransactionsHistoryStore.requestRecentTransactions();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>

<style lang="scss" scoped></style>
