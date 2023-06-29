<template>
  <div>
    <BackButton :fallback="{ name: 'index' }" />
    <h1 class="h1">Receive</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        label="Official bridge"
        :icon-url="destinations.ethereum.iconUrl"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-deposit', query: $route.query }"
        description="Add funds using official bridge"
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
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, QrCodeIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";

const { destinations } = storeToRefs(useDestinationsStore());
</script>

<style lang="scss" scoped></style>
