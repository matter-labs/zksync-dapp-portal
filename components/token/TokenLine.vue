<template>
  <CommonButtonLineWithImg :as="as">
    <template #image>
      <TokenImage :symbol="symbol" :address="address" :icon-url="iconUrl" />
    </template>
    <template #default>
      <CommonButtonLineBodyInfo class="text-left">
        <template #label>
          <div class="truncate">{{ symbol }}</div>
        </template>
        <template v-if="name" #underline>
          <CommonButtonLabel
            v-if="showNameLink && eraNetwork.blockExplorerUrl"
            as="a"
            variant="light"
            :href="`${eraNetwork.blockExplorerUrl}/address/${address}`"
            target="_blank"
            class="flex gap-1"
            @click.stop=""
          >
            <span class="truncate">{{ name }}</span>
            <ArrowTopRightOnSquareIcon class="h-6 w-6 flex-shrink-0" />
          </CommonButtonLabel>
          <div v-else class="truncate">{{ name }}</div>
        </template>
      </CommonButtonLineBodyInfo>
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import type { TokenPrice } from "@/types";
import type { Component, PropType } from "vue";

import { useZkSyncProviderStore } from "@/store/zksync/provider";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  showNameLink: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  decimals: {
    type: Number,
    required: true,
  },
  iconUrl: {
    type: String,
  },
  price: {
    type: [String, Number] as PropType<TokenPrice>,
  },
});

const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
</script>

<style lang="scss" scoped></style>
