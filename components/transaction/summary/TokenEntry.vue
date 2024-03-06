<template>
  <CommonButtonLine as="div" class="transaction-summary-token-entry">
    <div class="entry-label">{{ label }}</div>
    <div class="entry-info">
      <div class="entry-text-info">
        <div class="token-amount">{{ displayedAmount }} {{ token.symbol }}</div>
        <div v-if="token.price && displayedAmount !== '0'" class="token-price">
          {{ formatTokenPrice(token.amount, token.decimals, token.price) }}
        </div>
      </div>
      <TokenImage class="token-image" :symbol="token.symbol" :address="token.address" :icon-url="token.iconUrl" />
    </div>
  </CommonButtonLine>
</template>

<script lang="ts" setup>
import type { TokenAmount } from "@/types";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  token: {
    type: Object as PropType<TokenAmount>,
    required: true,
  },
});

const displayedAmount = computed(() => parseTokenAmount(props.token.amount, props.token.decimals));
</script>

<style lang="scss" scoped>
.transaction-summary-token-entry {
  @apply flex items-center py-4;

  .entry-label {
    @apply font-bold;
  }
  .entry-info {
    @apply ml-auto flex gap-4;

    .entry-text-info {
      @apply flex flex-col justify-center text-right;

      .token-price {
        @apply text-sm text-neutral-600 dark:text-neutral-400;
      }
    }
    .token-image {
      @apply h-12 w-12;
    }
  }
}
</style>
