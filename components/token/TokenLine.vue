<template>
  <CommonButtonLineWithImg :as="as">
    <template #image>
      <TokenImage :symbol="symbol" :address="address" :icon-url="iconUrl" />
    </template>
    <template #default>
      <CommonButtonLineBodyInfo class="text-left">
        <template #label>{{ symbol }}</template>
        <template #underline>
          <span class="hidden xs:block" :title="address">{{ shortenAddress(address, 5) }}</span>
          <span class="xs:hidden" :title="address">{{ shortenAddress(address, 2) }}</span>
        </template>
      </CommonButtonLineBodyInfo>
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import type { TokenPrice } from "@/types";
import type { Component, PropType } from "vue";

import { shortenAddress } from "@/utils/formatters";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
  symbol: {
    type: String,
    required: true,
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
</script>

<style lang="scss" scoped></style>
