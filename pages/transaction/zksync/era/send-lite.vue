<template>
  <div>
    <BackButton :fallback="{ name: 'transaction-zksync-era' }" />
    <h1 class="h1">Choose provider</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.layerswap"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.layerswap.io/?sourceExchangeName=ZKSYNCERA_MAINNET&destNetwork=ZKSYNC_MAINNET"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";

const { destinations } = storeToRefs(useDestinationsStore());
</script>

<style lang="scss" scoped></style>
