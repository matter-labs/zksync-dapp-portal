<template>
  <div :title="fullAmount">
    <div class="flex items-center justify-end">
      <span v-if="direction" class="relative -top-px mr-[2px] text-xs">{{ direction === "in" ? "+" : "-" }}</span>
      <span class="max-w-[100px] truncate text-sm xs:max-w-[150px]">{{ fullAmount }}</span>
      <TokenImage
        class="ml-1 mr-0.5 h-3.5 w-3.5"
        :symbol="token.symbol"
        :address="token.address"
        :icon-url="token.iconUrl"
      />
      <span :title="token.symbol" class="max-w-[5.5rem] truncate text-sm font-medium">{{ token.symbol }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import type { Token } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { parseTokenAmount } from "@/utils/formatters";

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
</script>
