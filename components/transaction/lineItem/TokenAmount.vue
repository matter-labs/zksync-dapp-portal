<template>
  <div :title="fullAmount">
    <div class="flex items-center justify-end">
      <span v-if="direction" class="relative -top-px mr-[2px] text-xs">{{ direction === "in" ? "+" : "-" }}</span>
      <span class="max-w-[100px] truncate xs:max-w-[150px]">{{ displayedAmount }}</span>
      <TokenImage
        class="ml-1 mr-0.5 h-4 w-4"
        :symbol="token.symbol"
        :address="token.address"
        :icon-url="token.iconUrl"
      />
      <span :title="token.symbol" class="max-w-[5.5rem] truncate font-medium">{{ token.symbol }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { BigNumber, type BigNumberish } from "ethers";

import type { Token } from "@/types";
import type { PropType } from "vue";

import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const props = defineProps({
  token: {
    type: Object as PropType<Token>,
    required: true,
  },
  amount: {
    type: String as PropType<BigNumberish>,
    required: true,
  },
  direction: {
    type: String as PropType<"in" | "out" | undefined>,
  },
});

const fullAmount = computed(() => {
  return parseTokenAmount(props.amount, props.token.decimals);
});
const isZeroAmount = computed(() => BigNumber.from(props.amount).isZero());

const displayedAmount = computed(() => {
  if (typeof props.token.price !== "number") {
    return fullAmount.value;
  }
  const withoutSmallAmount = removeSmallAmount(props.amount, props.token.decimals, props.token.price);
  if (isZeroAmount.value) {
    return "0";
  } else if (!isOnlyZeroes(withoutSmallAmount)) {
    return withoutSmallAmount;
  }
  return `<${withoutSmallAmount.slice(0, -1)}1`;
});
</script>
