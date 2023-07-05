<template>
  <div v-if="loading" class="total-balance">
    <CommonContentLoader />
  </div>
  <div v-else class="total-balance">
    <span class="currency-symbol">{{ total.currencySymbol }}</span>
    <span class="total-int">{{ total.int }}</span>
    <span class="total-dec">.{{ total.decimal }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import type { TokenAmount } from "@/types";
import type { PropType } from "vue";

import { calculateTotalTokensPrice } from "@/utils/helpers";

const props = defineProps({
  balance: {
    type: Array as PropType<TokenAmount[]>,
  },
  loading: {
    type: Boolean,
  },
  error: {
    type: Error,
  },
});

const total = computed(() => {
  if (props.error || !props.balance) {
    return {
      int: "?",
      decimal: "??",
      currencySymbol: "$",
    };
  }
  const num = calculateTotalTokensPrice(props.balance);
  return {
    int: Math.floor(num).toString(),
    decimal: (num % 1).toFixed(2).slice(2),
    currencySymbol: "$",
  };
});
</script>

<style lang="scss" scoped>
.total-balance {
  @apply text-[32px] font-semibold;

  .total-dec {
    @apply text-xl font-bold tracking-[0.1px];
  }
}
</style>
