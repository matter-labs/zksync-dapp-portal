<template>
  <div class="token-badge">
    <div class="token-badge-amount">{{ parseTokenAmount(amount, token.decimals) }} {{ token.symbol }}</div>
    <TokenImage class="token-badge-img" v-bind="token" />
  </div>
</template>

<script lang="ts" setup>
import type { Token } from "@/types";
import type { PropType } from "vue";

defineProps({
  amount: {
    type: String,
    required: true,
  },
  token: {
    type: Object as PropType<Token>,
    required: true,
  },
});
</script>

<style lang="scss">
.token-badge {
  @apply flex items-center gap-1 rounded-2xl bg-gray-200/50 p-1 px-2 dark:bg-neutral-800;

  .token-badge-img {
    @apply -mr-1 h-6 w-6;
  }
}
</style>
