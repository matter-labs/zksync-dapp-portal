<template>
  <CommonModal v-bind="$attrs" title="View on explorer">
    <TypographyCategoryLabel>Selected network</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-if="selectedNetworkLink.link"
        v-bind="selectedNetworkLink.destination"
        as="a"
        :icon="ArrowUpRightIcon"
        :href="selectedNetworkLink.link"
        target="_blank"
      />
      <DestinationItem
        v-else
        disabled
        as="button"
        v-bind="selectedNetworkLink.destination"
        description="No explorer available"
        target="_blank"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Other networks</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <template v-for="item in otherNetworks" :key="item.destination.key">
        <DestinationItem
          v-if="item.link"
          v-bind="item.destination"
          as="a"
          :icon="ArrowUpRightIcon"
          :href="item.link"
          target="_blank"
        />
        <DestinationItem
          v-else
          disabled
          as="button"
          v-bind="item.destination"
          description="No explorer available"
          target="_blank"
        />
      </template>
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

const eraNetworkLink = computed(() => ({
  destination: destinations.value.era,
  link: eraBlockExplorerUrl.value ? `${eraBlockExplorerUrl.value}/address/${account.value.address}` : undefined,
}));
const zkSyncLiteNetworkLink = computed(() => ({
  destination: destinations.value.zkSyncLite,
  link: liteBlockExplorerUrl.value ? `${liteBlockExplorerUrl.value}/address/${account.value.address}` : undefined,
}));
const l1NetworkLink = computed(() => ({
  destination: destinations.value.ethereum,
  link: l1BlockExplorerUrl.value ? `${l1BlockExplorerUrl.value}/address/${account.value.address}` : undefined,
}));

const selectedNetworkLink = computed(() => {
  if (version.value === "lite") {
    return zkSyncLiteNetworkLink.value;
  }
  return eraNetworkLink.value;
});
const otherNetworks = computed(() => {
  const list = [l1NetworkLink.value];
  if (version.value === "lite") {
    list.push(eraNetworkLink.value);
  } else {
    list.push(zkSyncLiteNetworkLink.value);
  }
  return list;
});
</script>
