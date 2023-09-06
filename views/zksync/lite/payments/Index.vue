<template>
  <div>
    <CommonContentBlock>
      <CommonButtonGroup class="mb-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite-swap' }">
          <template #icon>
            <ArrowsRightLeftIcon aria-hidden="true" />
          </template>
          <template #default>Swap</template>
        </CommonButton>
        <CommonButton
          as="a"
          target="_blank"
          :href="`https://zkexport.netlify.app/export/account/transactions?address=${account.address}&network=${zkSyncLiteNetwork.network}`"
        >
          <template #icon>
            <DocumentArrowDownIcon aria-hidden="true" />
          </template>
          <template #default>Export history</template>
        </CommonButton>
      </CommonButtonGroup>
      <div>
        <div class="flex items-center justify-between py-4">
          <TypographyCategoryLabel as="h2" :padded="false">Transactions</TypographyCategoryLabel>
          <CommonLabelButton as="RouterLink" :to="{ name: 'payments-all' }">View all</CommonLabelButton>
        </div>
        <div class="-mx-2 -mb-2 -mt-1">
          <template v-if="recentTransactionsRequestInProgress">
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </template>
          <div v-else-if="recentTransactionsRequestError" class="m-3 -mt-1 mb-2.5">
            <CommonErrorBlock @try-again="fetch">
              {{ recentTransactionsRequestError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="transactions.length">
            <ZkSyncLiteTransactionLineItem
              v-for="(item, index) in transactions.slice(0, 5)"
              :key="index"
              :transaction="item"
              display-date
            />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1">
              You currently don't have any transactions on
              <span class="font-medium">{{ destinations.zkSyncLite.label }}</span>
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";

import { ArrowsRightLeftIcon, DocumentArrowDownIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import ZkSyncLiteTransactionLineItem from "@/components/transaction/zksync/lite/ZkSyncLiteTransactionLineItem.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";

const onboardStore = useOnboardStore();
const liteTransactionsHistoryStore = useLiteTransactionsHistoryStore();
const { account } = storeToRefs(onboardStore);
const { zkSyncLiteNetwork } = storeToRefs(useLiteProviderStore());
const { transactions, recentTransactionsRequestInProgress, recentTransactionsRequestError } =
  storeToRefs(liteTransactionsHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const fetch = () => {
  liteTransactionsHistoryStore.requestRecentTransactions();
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
