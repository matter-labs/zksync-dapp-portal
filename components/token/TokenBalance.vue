<template>
  <CommonButtonLineWithImg
    :as="sendRouteName ? 'RouterLink' : as"
    :icon="sendRouteName ? PaperAirplaneIcon : undefined"
    :to="sendRouteName ? { name: sendRouteName, query: { token: address } } : undefined"
    class="token-balance"
    :class="{ 'is-zero-amount': isZeroAmount }"
  >
    <template #image>
      <TokenImage class="token-balance-image-container" :symbol="symbol" :address="address" :icon-url="iconUrl" />
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
      <CommonButtonLineBodyInfo class="text-right">
        <template #secondary>
          <div class="token-balance-amount" :title="fullAmount">
            <CommonContentLoader v-if="priceLoading" :length="15" />
            <template v-else>{{ displayedAmount }}</template>
          </div>
        </template>
        <template #underline>
          <div class="token-balance-price">
            <CommonContentLoader v-if="priceLoading" :length="12" />
            <template v-else-if="price && !isZeroAmount">
              {{ formatTokenPrice(amount, decimals, price as number) }}
            </template>
          </div>
        </template>
      </CommonButtonLineBodyInfo>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";

import type { TokenPrice } from "@/types";
import type { BigNumberish } from "ethers";
import type { Component, PropType } from "vue";

import { formatTokenPrice, parseTokenAmount, removeSmallAmount, shortenAddress } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
  amountDisplay: {
    type: String as PropType<"remove-small" | "full">,
    default: "remove-small",
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
  amount: {
    type: String as PropType<BigNumberish>,
    required: true,
  },
  price: {
    type: [String, Number] as PropType<TokenPrice>,
  },
  sendRouteName: {
    type: String,
  },
});

const priceLoading = computed(() => props.price === "loading");
const isZeroAmount = computed(() => BigNumber.from(props.amount).isZero());

const fullAmount = computed(() => parseTokenAmount(props.amount, props.decimals));
const displayedAmount = computed(() => {
  if (typeof props.price !== "number") {
    return fullAmount.value;
  }
  const withoutSmallAmount = removeSmallAmount(props.amount, props.decimals, props.price);
  if (props.amountDisplay === "remove-small") {
    if (isZeroAmount.value) {
      return "0";
    } else if (!isOnlyZeroes(withoutSmallAmount)) {
      return withoutSmallAmount;
    }
    return `<${withoutSmallAmount.slice(0, -1)}1`;
  }
  return fullAmount.value;
});
</script>

<style lang="scss">
.token-balance {
  @apply grid grid-cols-[35px_1fr_max-content] items-center gap-2.5 xs:grid-cols-[40px_1fr_max-content] xs:gap-4;
  &.is-zero-amount {
    .token-balance-amount,
    .send-button {
      @apply opacity-50;
    }
    .token-balance-amount {
      @apply text-gray-secondary dark:text-neutral-400;
    }
  }
}
</style>
