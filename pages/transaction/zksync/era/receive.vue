<template>
  <div>
    <BackButton :fallback="{ name: 'index' }" />
    <h1 class="h1">Receive</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-if="eraNetwork.l1Network"
        label="Official bridge"
        :icon-url="destinations.ethereum.iconUrl"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-deposit', query: $route.query }"
        :description="`Add funds from ${destinations.ethereum.label}`"
      />
      <DestinationItem
        label="View address"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-receive-address', query: $route.query }"
        description="Receive from another account"
      >
        <template #image>
          <QrCodeIcon class="p-0.5" />
        </template>
      </DestinationItem>
      <DestinationItem
        v-if="eraNetwork.faucetUrl"
        label="Receive test tokens"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-faucet' }"
        description="Use official faucet to get test tokens"
      >
        <template #image>
          <IconsFaucet class="aspect-square h-auto w-full" />
        </template>
      </DestinationItem>
    </CommonCardWithLineButtons>

    <template v-if="eraNetwork.displaySettings?.showPartnerLinks">
      <TypographyCategoryLabel>Top-up with cash</TypographyCategoryLabel>
      <CommonCardWithLineButtons>
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
          href="https://www.layerswap.io/?destNetwork=ZKSYNCERA_MAINNET"
        />
        <DestinationItem
          v-bind="destinations.orbiter"
          :icon="ArrowUpRightIcon"
          as="a"
          target="_blank"
          href="https://www.orbiter.finance/?dest=zkSync%20Era"
        />
        <DestinationItem
          v-bind="destinations.rhino"
          :icon="ArrowUpRightIcon"
          as="a"
          target="_blank"
          href="https://app.rhino.fi/bridge?chainOut=ZKSYNC&chain=ETHEREUM&token=ETH"
        />
      </CommonCardWithLineButtons>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, QrCodeIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useEraProviderStore } from "@/store/zksync/era/provider";

const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());
</script>

<style lang="scss" scoped></style>
