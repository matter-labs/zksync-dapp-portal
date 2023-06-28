<template>
  <TransactionLineItem
    :failed="isTransactionFailed"
    :icon="icon"
    :transaction-url="`${blockExplorerUrl}/tx/${transaction.transactionHash}`"
  >
    <template #top-left>{{ label }}</template>
    <template #bottom-left>{{ time }}</template>
    <template #top-right>
      <TokenAmount v-if="token" :token="token" :amount="computeAmount" :direction="direction" />
    </template>
    <template #bottom-right>
      <TotalPrice v-if="token" :token="token" :amount="computeAmount" :direction="direction" :loading="priceLoading" />
    </template>
  </TransactionLineItem>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import {
  ArrowDownLeftIcon,
  ArrowRightIcon,
  BanknotesIcon,
  MinusIcon,
  PaperAirplaneIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/transactionLineItem/TokenAmount.vue";
import TotalPrice from "@/components/transaction/transactionLineItem/TotalPrice.vue";

import type { EraTransaction } from "@/utils/zksync/era/mappers";
import type { Component, PropType } from "vue";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { isBigNumber } from "@/utils/validators";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  transaction: {
    type: Object as PropType<EraTransaction>,
    required: true,
  },
  displayDate: {
    type: Boolean,
    required: false,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { blockExplorerUrl } = storeToRefs(useEraProviderStore());

const label = computed(() => {
  if (props.transaction.type === "transfer") {
    if (direction.value === "in") {
      return "Receive";
    }
    return "Send";
  } else if (props.transaction.type === "withdrawal") {
    return "Withdraw";
  } else if (props.transaction.type === "deposit") {
    return "Deposit";
  } else if (props.transaction.type === "fee") {
    return "Contract execution";
  } else if (props.transaction.type === undefined) {
    return "Unknown";
  }
  return props.transaction.type;
});
const transactionAmount = computed(() => {
  return props.transaction.amount;
});
const hasAmount = computed(() => {
  return isBigNumber(transactionAmount.value);
});
const amount = computed(() => {
  if (!hasAmount.value) {
    return BigNumber.from(props.transaction.feeAmount).toString();
  }
  return transactionAmount.value;
});
const computeAmount = computed(() => {
  return BigNumber.from(amount.value).abs().toString();
});
const token = computed(() => {
  return props.transaction.token;
});
const priceLoading = computed(() => {
  return token.value?.price === "loading";
});
const direction = computed(() => {
  if (
    props.transaction.to === props.transaction.from &&
    props.transaction.toNetwork === props.transaction.fromNetwork
  ) {
    return undefined;
  }
  if (props.transaction.toNetwork === "L2" && props.transaction.to === account.value.address) {
    return "in";
  } else {
    return "out";
  }
});
const isTransactionFailed = computed(() => props.transaction.status === "failed");
const icon = computed(() => {
  switch (props.transaction.type) {
    case "transfer":
      return direction.value === "in" ? ArrowDownLeftIcon : PaperAirplaneIcon;
    case "withdrawal":
      return MinusIcon;
    case "deposit":
      return PlusIcon;
    case "fee":
      return BanknotesIcon;
    case undefined:
      return undefined;
    default:
      if (direction.value) {
        return direction.value === "in" ? ArrowDownLeftIcon : ArrowRightIcon;
      }
      return undefined;
  }
});
const time = computed(() => {
  const date = new Date(props.transaction.receivedAt);
  return `
    ${props.displayDate ? date.toLocaleDateString([], { day: "numeric", month: "long" }) + " ∙" : ""}
    ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
  `;
});
</script>
