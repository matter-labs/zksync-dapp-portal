<template>
  <TransactionFeeDetails
    v-for="(item, index) in totalByToken"
    class="-my-0.5"
    :key="item.token.address"
    :label="index === 0 ? 'Total to pay:' : ''"
    :fee-token="item.token"
    :fee-amount="item.amount"
  />
</template>

<script lang="ts" setup>
import type { Token } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

defineProps({
  totalByToken: {
    type: Array as PropType<{ token: Token; amount: BigNumberish }[]>,
    required: true,
  },
});
</script>
