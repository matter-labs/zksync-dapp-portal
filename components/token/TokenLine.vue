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
          <CommonLabelButton
            v-if="eraNetwork.blockExplorerUrl"
            as="a"
            :href="`${eraNetwork.blockExplorerUrl}/address/${address}`"
            target="_blank"
            class="flex gap-1"
            @click.stop=""
          >
            <span class="truncate">{{ name }}</span>
            <ArrowTopRightOnSquareIcon class="h-6 w-6 flex-shrink-0" />
          </CommonLabelButton>
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

import { useEraProviderStore } from "@/store/zksync/era/provider";

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

const { eraNetwork } = storeToRefs(useEraProviderStore());
</script>

<style lang="scss" scoped></style>
