<template>
  <div :title="fullAmount">
    <div class="flex items-center justify-end">
      <span v-if="direction" class="relative -top-px mr-[2px] text-xs">{{ direction === "in" ? "+" : "-" }}</span>
      <span class="max-w-[100px] truncate xs:max-w-[150px]">{{ displayedAmount }}</span>
      &nbsp;
      <span :title="token.symbol" class="max-w-[5.5rem] truncate font-medium">{{ token.symbol }}</span>
      &nbsp;
      <TokenImage class="h-4 w-4" :symbol="token.symbol" :address="token.address" :icon-url="token.iconUrl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type BigNumberish } from "ethers";

import type { Token } from "@/types";

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

const displayedAmount = computed(() => {
  if (!props.token.price) {
    return fullAmount.value;
  }
  return removeSmallAmountPretty(props.amount, props.token.decimals, props.token.price);
});
</script>
