<template>
  <div>
    <BackButton :fallback="{ name: 'index' }" />
    <h1 class="h1">Swap tokens</h1>

    <CommonCardWithLineButtons v-if="eraNetwork.l1Network">
      <DestinationItem
        label="Mute.io"
        icon-url="/img/mute.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://app.mute.io/swap"
      />
      <DestinationItem
        label="Maverick Protocol"
        icon-url="/img/maverick-protocol.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://app.mav.xyz/?chain=324"
      />
      <DestinationItem
        label="iZiSwap"
        icon-url="/img/izumi.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://zksync.izumi.finance/swap"
      />
      <DestinationItem
        label="Velocore"
        icon-url="/img/velocore.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://app.velocore.xyz/swap"
      />
      <DestinationItem
        label="SpaceFi"
        icon-url="/img/spacefi.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://swap-zksync.spacefi.io/#/swap"
      />
      <DestinationItem
        label="eZKalibur"
        icon-url="/img/ezkalibur.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://dapp.ezkalibur.com/"
      />
      <DestinationItem
        label="veSync"
        icon-url="/img/vesync.svg"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://app.vesync.finance/swap"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useEraProviderStore } from "@/store/zksync/era/provider";

const { eraNetwork } = storeToRefs(useEraProviderStore());
</script>

<style lang="scss" scoped></style>
