<template>
  <div v-if="loading" class="total-balance">
    <CommonContentLoader />
  </div>
  <div v-else class="total-balance">
    <span class="currency-symbol">{{ total.currencySymbol }}</span>
    <span class="total-integer">{{ total.integer }}</span>
    <span class="total-decimal" :class="{ 'opacity-70': total.decimal === '00' }">.{{ total.decimal }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { TokenAmount } from "@/types";

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
  const currencySymbol = "$";
  if (props.error || !props.balance) {
    return {
      integer: "?",
      decimal: "??",
      currencySymbol,
    };
  }
  const num = calculateTotalTokensPrice(props.balance);
  return {
    integer: Math.floor(num).toString(),
    decimal: (num % 1).toFixed(2).slice(2),
    currencySymbol,
  };
});
</script>

<style lang="scss" scoped>
.total-balance {
  @apply text-6xl;

  .currency-symbol,
  .total-decimal {
    @apply text-3xl;
  }
}
</style>
