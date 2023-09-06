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
        <CommonButton v-if="eraNetwork.l1Network" as="RouterLink" :to="{ name: 'transaction-zksync-era-swap' }">
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
        <div class="-mx-2 -mb-2 -mt-1">
          <template v-if="recentTransfersRequestInProgress">
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </template>
          <div v-else-if="recentTransfersRequestError" class="m-3 -mt-1 mb-2.5">
            <CommonErrorBlock @try-again="fetch">
              {{ recentTransfersRequestError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="transfers.length">
            <EraTransferLineItem
              v-for="(item, index) in transfers.slice(0, 5)"
              :key="index"
              :transfer="item"
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

import EraTransferLineItem from "@/components/transaction/zksync/era/EraTransferLineItem.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";

const onboardStore = useOnboardStore();
const eraTransfersHistoryStore = useEraTransfersHistoryStore();
const { transfers, recentTransfersRequestInProgress, recentTransfersRequestError } =
  storeToRefs(eraTransfersHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());

const fetch = () => {
  eraTransfersHistoryStore.requestRecentTransfers();
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
