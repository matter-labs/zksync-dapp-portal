<template>
  <CommonModal title="Allowance approval">
    <p class="leading-normal">
      Allowance approval authorizes our bridge to move set amount of your
      <span class="font-medium">{{ token?.symbol || "ERC-20" }}</span>
      token. It's a necessary step to ensure that only the amount you specify can be transferred. This will not deduct
      any funds from your balance, except for a approval transaction fee.
      <a :href="TOKEN_ALLOWANCE" target="_blank" class="underline underline-offset-2">Learn more</a>
    </p>
  </CommonModal>
</template>

<script lang="ts" setup>
import type { Token } from "@/types";
import type { PropType } from "vue";

defineProps({
  token: {
    type: Object as PropType<Token>,
  },
});
</script>
