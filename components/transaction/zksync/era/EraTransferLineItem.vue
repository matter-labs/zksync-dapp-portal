<template>
  <TransactionLineItem :icon="icon" :explorer-url="blockExplorerUrl" :transaction-hash="transfer.transactionHash!">
    <template #top-left>{{ label }}</template>
    <template #bottom-left>
      <span data-testid="withdraw-date">{{ time }}</span>
      <slot name="bottom-left"></slot>
    </template>
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

import TokenAmount from "@/components/transaction/lineItem/TokenAmount.vue";
import TotalPrice from "@/components/transaction/lineItem/TotalPrice.vue";

import type { EraTransfer } from "@/utils/zksync/era/mappers";
import type { Component, PropType } from "vue";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  transfer: {
    type: Object as PropType<EraTransfer>,
    required: true,
  },
  displayDate: {
    type: Boolean,
    required: false,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { blockExplorerUrl } = storeToRefs(useEraProviderStore());

const direction = computed(() => {
  if (props.transfer.to === props.transfer.from && props.transfer.toNetwork === props.transfer.fromNetwork) {
    return undefined;
  }
  if (props.transfer.toNetwork === "L2" && props.transfer.to === account.value.address) {
    return "in";
  } else {
    return "out";
  }
});
const label = computed(() => {
  if (props.transfer.type === "transfer") {
    if (direction.value === "in") {
      return "Receive";
    }
    return "Send";
  } else if (props.transfer.type === "withdrawal") {
    return "Withdraw";
  } else if (props.transfer.type === "deposit") {
    return direction.value === "in" ? "Deposit" : "Send";
  } else if (props.transfer.type === "fee") {
    return "Contract execution";
  } else if (props.transfer.type === "mint") {
    return "Mint";
  }
  return props.transfer.type || "Unknown";
});
const computeAmount = computed(() => {
  return BigNumber.from(props.transfer.amount || "0").toString();
});
const token = computed(() => {
  return props.transfer.token;
});
const priceLoading = computed(() => {
  return token.value?.price === "loading";
});
const icon = computed(() => {
  switch (props.transfer.type) {
    case "transfer":
      return direction.value === "in" ? ArrowDownLeftIcon : PaperAirplaneIcon;
    case "withdrawal":
      return MinusIcon;
    case "deposit":
      return direction.value === "in" ? PlusIcon : PaperAirplaneIcon;
    case "mint":
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
  const date = new Date(props.transfer.timestamp);
  return `
    ${props.displayDate ? date.toLocaleDateString("en-US", { day: "numeric", month: "long" }) + " ∙" : ""}
    ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
  `;
});
</script>
