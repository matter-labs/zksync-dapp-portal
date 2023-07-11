<template>
  <CommonModal v-bind="$attrs" title="View on explorer">
    <TypographyCategoryLabel>Selected network</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="selectedNetwork?.destination"
        as="a"
        :icon="ArrowUpRightIcon"
        :href="selectedNetwork?.link"
        target="_blank"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Other networks</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-for="item in otherNetworks"
        v-bind="item.destination"
        :key="item.destination.key"
        as="a"
        :icon="ArrowUpRightIcon"
        :href="item.link"
        target="_blank"
      />
    </CommonCardWithLineButtons>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";

const { l1BlockExplorerUrl, version } = storeToRefs(useNetworkStore());
const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl: eraBlockExplorerUrl } = storeToRefs(useEraProviderStore());
const { blockExplorerUrl: liteBlockExplorerUrl } = storeToRefs(useLiteProviderStore());

const networks = computed(() => {
  return [
    {
      destination: destinations.value.era,
      link: `${eraBlockExplorerUrl.value}/address/${account.value.address}`,
      version: "era",
    },
    {
      destination: destinations.value.ethereum,
      link: `${l1BlockExplorerUrl.value}/address/${account.value.address}`,
    },
    {
      destination: destinations.value.zkSyncLite,
      link: `${liteBlockExplorerUrl.value}/address/${account.value.address}`,
      version: "lite",
    },
  ];
});
const selectedNetwork = computed(() => {
  if (version.value === "era") {
    return networks.value.find((network) => network.destination.key === "era");
  } else if (version.value === "lite") {
    return networks.value.find((network) => network.destination.key === "zkSyncLite");
  }
  return undefined;
});
const otherNetworks = computed(() => {
  return networks.value.filter(
    (network) =>
      network.destination.key !== selectedNetwork.value?.destination.key &&
      (!network.version || network.version === version.value)
  );
});
</script>
