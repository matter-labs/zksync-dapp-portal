<template>
  <div>
    <BackButton :fallback="{ name: 'index' }" />
    <h1 class="h1">Swap tokens</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.syncswap"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://syncswap.xyz/"
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
