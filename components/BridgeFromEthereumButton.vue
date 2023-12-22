<template>
  <CommonCardWithLineButtons
    class="bridge-from-ethereum-button"
    :class="{ 'animated-button': displayTotalTokens }"
    variant="primary"
  >
    <DestinationItem
      :icon-url="destinations.ethereum.iconUrl"
      as="RouterLink"
      :to="{ name: 'index' }"
      variant="primary"
    >
      <template #label>
        <span class="text-white">Bridge from {{ eraNetwork.l1Network?.name }}</span>
      </template>
      <template #underline>
        <span class="text-white" v-if="!displayTotalTokens || !balance">
          Receive tokens from your {{ eraNetwork.l1Network?.name }} account
        </span>
        <span class="text-white" v-else>
          You have {{ balance.length }} token{{ balance.length > 1 ? "s" : "" }} worth
          {{ formatPricePretty(totalTokenBalance) }} that you can receive from {{ eraNetwork.l1Network?.name }}
        </span>
      </template>
    </DestinationItem>
  </CommonCardWithLineButtons>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";

import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useZkSyncEthereumBalanceStore } from "@/store/zksync/ethereumBalance";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { formatPricePretty } from "@/utils/formatters";
import { calculateTotalTokensPrice } from "@/utils/helpers";

const zkSyncEthereumBalanceStore = useZkSyncEthereumBalanceStore();
const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const { balance } = storeToRefs(zkSyncEthereumBalanceStore);

const totalTokenBalance = computed(() => {
  if (!balance.value) {
    return 0;
  }
  return calculateTotalTokensPrice(balance.value);
});

const displayTotalTokens = computed(() => {
  if (totalTokenBalance.value < 5) {
    return false;
  }
  return true;
});

onMounted(() => {
  if (eraNetwork.value.blockExplorerApi) {
    zkSyncEthereumBalanceStore.requestBalance();
  }
});
</script>

<style lang="scss" scoped>
.bridge-from-ethereum-button {
  @apply relative isolate;
  &.animated-button::before {
    animation: button-blink-animation 1s ease forwards;
    @keyframes button-blink-animation {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(1.1, 1.4);
      }
    }
  }
  &::before {
    content: "";
    @apply absolute inset-0 z-[-1] h-full w-full rounded-3xl bg-primary-400;
  }
}
</style>
