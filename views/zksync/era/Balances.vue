<template>
  <div>
    <CommonCardWithLineButtons v-if="loading">
      <TokenBalanceLoader v-for="index in 2" :key="index" send-route-name />
    </CommonCardWithLineButtons>
    <CommonCardWithLineButtons v-else-if="balanceError">
      <CommonErrorBlock @try-again="fetch">
        {{ balanceError.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <div v-else>
      <div v-for="(group, index) in balanceGroups" :key="index">
        <TypographyCategoryLabel v-if="group.title">
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TokenBalance
            v-for="item in group.balances"
            as="div"
            :key="item.address"
            :send-route-name="eraNetwork.l1Network ? 'transaction-zksync-era' : 'transaction-zksync-era-send'"
            v-bind="item"
          />
        </CommonCardWithLineButtons>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import { storeToRefs } from "pinia";

import useInterval from "@/composables/useInterval";
import useSingleLoading from "@/composables/useSingleLoading";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { groupBalancesByAmount } from "@/utils/mappers";

const onboardStore = useOnboardStore();
const walletEraStore = useEraWalletStore();
const { balance, balanceInProgress, balanceError } = storeToRefs(walletEraStore);
const { eraNetwork } = storeToRefs(useEraProviderStore());

const { loading, reset: resetSingleLoading } = useSingleLoading(computed(() => balanceInProgress.value));

const balanceGroups = groupBalancesByAmount(balance);

const fetch = () => {
  walletEraStore.requestBalance();
};
fetch();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetch();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetSingleLoading();
  resetAutoUpdate();
  fetch();
});

onBeforeUnmount(() => {
  stopAutoUpdate();
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
