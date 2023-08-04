<template>
  <TransactionLineItem
    :failed="isTransactionFailed"
    :icon="icon"
    :explorer-url="blockExplorerUrl"
    :transaction-hash="transaction.txHash"
  >
    <template #top-left>{{ label }}</template>
    <template #bottom-left>{{ time }}</template>
    <template #top-right>
      <TokenAmount v-if="token?.isNFT === false" :token="token" :amount="computeAmount" :direction="direction" />
      <TokenNft v-else-if="token?.isNFT === true" :symbol="token.symbol" :direction="direction" />
    </template>
    <template #bottom-right>
      <template v-if="transaction.type === 'Swap'">
        <TokenAmount
          v-if="!props.transaction.swap.sending.token.isNFT"
          :token="props.transaction.swap.sending.token"
          :amount="props.transaction.swap.sending.amount"
          direction="out"
        />
        <TokenNft v-else :symbol="props.transaction.swap.sending.token.symbol" direction="out" />
      </template>
      <TotalPrice
        v-else-if="token?.isNFT === false"
        :token="token"
        :amount="computeAmount"
        :direction="direction"
        :loading="priceLoading"
      />
    </template>
  </TransactionLineItem>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import {
  ArrowDownLeftIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  MinusIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/transactionLineItem/TokenAmount.vue";
import TokenNft from "@/components/transaction/transactionLineItem/TokenNft.vue";
import TotalPrice from "@/components/transaction/transactionLineItem/TotalPrice.vue";

import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { Component, PropType } from "vue";

import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { isBigNumber } from "@/utils/validators";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  transaction: {
    type: Object as PropType<ZkSyncLiteTransaction>,
    required: true,
  },
  displayDate: {
    type: Boolean,
    required: false,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { blockExplorerUrl } = storeToRefs(useLiteProviderStore());

const label = computed(() => {
  if (props.transaction.isFeeTransaction) {
    return "Fee payment";
  } else if (props.transaction.type === "ChangePubKey") {
    return "Account activation";
  } else if (props.transaction.type === "MintNFT") {
    return "Mint NFT";
  } else if (props.transaction.type === "Transfer" || props.transaction.type === "TransferNFT") {
    if (direction.value === "in") {
      return "Receive";
    }
    return "Send";
  } else if (props.transaction.type === "WithdrawNFT") {
    return "Withdraw";
  }
  return props.transaction.type;
});
const amount = computed(() => {
  if (props.transaction.type === "Swap") {
    return props.transaction.swap.receiving.amount;
  }
  if (props.transaction.isFeeTransaction) {
    return props.transaction.feeAmount;
  }
  return props.transaction.amount;
});
const hasAmount = computed(() => {
  return isBigNumber(amount.value);
});
const computeAmount = computed(() => {
  if (!hasAmount.value) {
    return BigNumber.from(props.transaction.feeAmount).toString();
  }
  return amount.value;
});
const token = computed(() => {
  if (props.transaction.type === "Swap") {
    return props.transaction.swap.receiving.token;
  }
  if (props.transaction.isFeeTransaction || !hasAmount.value) {
    return props.transaction.feeToken;
  }
  return props.transaction.token;
});
const priceLoading = computed(() => {
  if (token.value?.isNFT === false) {
    return token.value?.price === "loading";
  }
  return false;
});
const isTransactionFailed = computed(() => !!props.transaction.failReason);
const direction = computed(() => {
  if (props.transaction.isFeeTransaction) {
    return "out";
  }
  if (props.transaction.type === "Swap") {
    return props.transaction.swap.receiving.address !== account.value.address ? "in" : "out";
  }
  switch (props.transaction.type) {
    case "Transfer":
    case "TransferNFT":
      if (props.transaction.to === props.transaction.from) {
        return undefined;
      }
      return props.transaction.to === account.value.address ? "in" : "out";

    case "Deposit":
      return props.transaction.to === account.value.address ? "in" : "out";

    case "Withdraw":
    case "WithdrawNFT":
    case "ChangePubKey":
      return "out";

    default:
      return undefined;
  }
});
const icon = computed(() => {
  if (props.transaction.isFeeTransaction) {
    return BanknotesIcon;
  }
  switch (props.transaction.type) {
    case "Transfer":
    case "TransferNFT":
      return direction.value === "in" ? ArrowDownLeftIcon : PaperAirplaneIcon;
    case "Withdraw":
    case "WithdrawNFT":
      return MinusIcon;
    case "ChangePubKey":
      return ShieldCheckIcon;
    case "Swap":
      return ArrowsRightLeftIcon;
    case "Deposit":
      return PlusIcon;
    case "MintNFT":
      return PhotoIcon;
  }
  if (direction.value) {
    return direction.value === "in" ? ArrowDownLeftIcon : ArrowRightIcon;
  }
  return undefined;
});
const time = computed(() => {
  const date = new Date(props.transaction.createdAt!);
  return `
    ${props.displayDate ? date.toLocaleDateString([], { day: "numeric", month: "long" }) + " ∙" : ""}
    ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
  `;
});
</script>
