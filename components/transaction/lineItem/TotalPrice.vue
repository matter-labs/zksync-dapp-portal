<template>
  <div class="whitespace-nowrap">
    <template v-if="loading">
      <CommonContentLoader :length="12" />
    </template>
    <template v-else-if="token.price && !isZeroAmount">
      <span v-if="direction">{{ direction === "in" ? "+" : "-" }}</span
      >{{ formatTokenPrice(amount, token.decimals, token.price as number) }}
    </template>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from "ethers";

import type { Token } from "@/types";
import type { BigNumberish } from "ethers";

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
  loading: {
    type: Boolean,
  },
});

const isZeroAmount = computed(() => {
  return BigNumber.from(props.amount).isZero();
});
</script>
