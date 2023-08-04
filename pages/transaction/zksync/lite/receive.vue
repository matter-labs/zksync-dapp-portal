<template>
  <div>
    <BackButton :fallback="{ name: 'index' }" />
    <h1 class="h1">Receive</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-if="zkSyncLiteNetwork.l1Network"
        label="Official bridge"
        :icon-url="destinations.ethereum.iconUrl"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-lite-deposit', query: $route.query }"
        description="Add funds using official bridge"
      />
      <DestinationItem
        label="View address"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-lite-receive-address', query: $route.query }"
        description="Receive from another account"
      >
        <template #image>
          <QrCodeIcon class="p-0.5" />
        </template>
      </DestinationItem>
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Top-up with cash</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.banxa"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        :href="
          buildUrl('https://zksync.banxa.com', {
            walletAddress: account.address!,
            accountReference: account.address!,
            returnUrlOnSuccess: 'https://portal.zksync.io',
            returnUrlOnFailure: 'https://portal.zksync.io',
          })
        "
      />
      <DestinationItem
        v-bind="destinations.moonpay"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://buy.moonpay.com"
      />
      <DestinationItem
        v-bind="destinations.ramp"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://ramp.network/buy/"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Top-up from another network</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.layerswap"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.layerswap.io/?destNetwork=ZKSYNC_MAINNET"
      />
      <DestinationItem
        v-bind="destinations.orbiter"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.orbiter.finance/?dest=zkSync%20Lite"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, QrCodeIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";

const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { zkSyncLiteNetwork } = storeToRefs(useLiteProviderStore());

function buildUrl(base: string, params: Record<string, string>) {
  let url = new URL("/", base);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  return url;
}
</script>

<style lang="scss" scoped></style>
