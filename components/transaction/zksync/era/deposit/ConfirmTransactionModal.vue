<template>
  <CommonModal
    v-if="status !== 'done'"
    :opened="opened"
    :close-on-background-click="status === 'not-started'"
    class="confirm-deposit-transaction-modal"
    title="Confirm transaction"
    @close="closeModal"
  >
    <div class="flex h-full flex-col overflow-auto">
      <template v-if="transaction">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="account.address!"
            :destination="destinations.ethereum"
            :tooltip="`Add funds from ${destinations.ethereum.label}`"
          />
          <TokenBalance v-bind="transaction.token" as="div" :amount="transaction.amount" amount-display="full" />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="transaction.to"
            :destination="destinations.era"
            :tooltip="`Add funds to ${destinations.era.label}`"
          />
        </CommonCardWithLineButtons>
      </template>

      <TransactionFeeDetails class="my-2" label="Fee:" :fee-token="feeToken" :fee-amount="lastFee" />

      <TransactionConfirmModalFooter>
        <template #alerts>
          <slot name="alerts" />
        </template>
        <template #default>
          <TransactionTotalByToken :total-by-token="totalOfEachToken" />
          <transition v-bind="TransitionAlertScaleInOutTransition">
            <div v-if="!buttonDisabled && newFeeAlert" class="mx-4 mt-3">
              <CommonAlert variant="warning" :icon="ExclamationCircleIcon">
                <p>Fee has changed since you started the transaction. Please confirm the updated fee to proceed.</p>
                <CommonButton @click="newFeeAlert = false">Confirm</CommonButton>
              </CommonAlert>
            </div>
          </transition>
          <div v-if="error" class="mx-4">
            <CommonErrorBlock :retry-button="false" class="mt-3">
              {{ error.message }}
            </CommonErrorBlock>
          </div>
          <CommonButtonTopInfo class="mt-2">Arriving in ~15 minutes</CommonButtonTopInfo>
          <CommonButton
            :disabled="buttonDisabled || newFeeAlert || status !== 'not-started'"
            class="mx-auto"
            variant="primary-solid"
            autofocus
            @click="makeTransaction"
          >
            <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
              <span v-if="status === 'processing'">Processing...</span>
              <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
              <span v-else>Add funds to {{ destinations.era.label }}</span>
            </transition>
          </CommonButton>
          <TransactionButtonUnderlineConfirmTransaction :opened="status === 'waiting-for-signature'" />
        </template>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>

  <CommonModal v-else opened :closable="false" class="deposit-transaction-successful-modal" title="">
    <template #animation>
      <AnimationsProgressPlane class="w-72" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">Transaction submitted</div>
      <CommonCardWithLineButtons v-if="transaction">
        <TransactionLineItem
          :icon="transactionReceiptIcon"
          :explorer-url="l1BlockExplorerUrl"
          :transaction-hash="ethTransactionHash"
        >
          <template #top-left>Deposit</template>
          <template #top-right>
            <TokenAmount
              :token="transaction.token"
              :amount="transaction.amount"
              :direction="transactionReceiptDirection"
            />
          </template>
          <template #bottom-right>
            <TotalPrice
              :token="transaction.token"
              :amount="transaction.amount"
              :direction="transactionReceiptDirection"
              :loading="transaction.token.price === 'loading'"
            />
          </template>
        </TransactionLineItem>
      </CommonCardWithLineButtons>

      <CommonAlert class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available on <span class="font-medium">{{ destinations.era.label }}</span> after the
          transaction is committed on <span class="font-medium">{{ destinations.ethereum.label }}</span> and then
          processed on <span class="font-medium">{{ destinations.era.label }}</span
          >. You are free to close this page.
        </p>
        <a :href="`${l1BlockExplorerUrl}/tx/${ethTransactionHash}`" target="_blank" class="alert-link">
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>

      <TransactionConfirmModalFooter>
        <template v-if="layout === 'default'">
          <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto mt-4" variant="primary-solid">
            Go to Assets page
          </CommonButton>
        </template>
        <template v-else-if="layout === 'bridge'">
          <CommonButtonTopLink @click="emit('newTransaction')">Make another transaction</CommonButtonTopLink>
          <CommonButton v-if="refererName" class="mx-auto" variant="primary-solid" @click="closeWindow">
            Go back to {{ refererName }}
          </CommonButton>
          <CommonButton
            v-else
            as="a"
            href="https://ecosystem.zksync.io"
            target="_blank"
            class="mx-auto"
            variant="primary-solid"
          >
            Explore ecosystem
            <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" aria-hidden="true" />
          </CommonButton>
        </template>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { useRouteQuery } from "@vueuse/router";
import { BigNumber } from "ethers";
import { Logger } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/transactionLineItem/TokenAmount.vue";
import TotalPrice from "@/components/transaction/transactionLineItem/TotalPrice.vue";

import useTransaction from "@/composables/zksync/era/deposit/useTransaction";

import type { DepositFeeValues } from "@/composables/zksync/era/deposit/useFee";
import type { Token } from "@/types";
import type { TransactionReceipt } from "@ethersproject/providers";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useEraEthereumBalanceStore } from "@/store/zksync/era/ethereumBalance";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  to: string;
  token: Token;
  amount: BigNumberish;
};

const props = defineProps({
  opened: {
    type: Boolean,
  },
  layout: {
    type: String as PropType<"default" | "bridge">,
    default: "default",
  },
  transaction: {
    type: Object as PropType<ConfirmationModalTransaction>,
  },
  fee: {
    type: String as PropType<BigNumberish>,
  },
  feeToken: {
    type: Object as PropType<Token>,
  },
  feeValues: {
    type: Object as PropType<DepositFeeValues>,
  },
  buttonDisabled: {
    type: Boolean,
    default: false,
  },
  estimate: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "newTransaction"): void;
}>();
const closeModal = () => emit("update:opened", false);

const eraTransfersHistoryStore = useEraTransfersHistoryStore();
const walletEraStore = useEraWalletStore();
const eraEthereumBalanceStore = useEraEthereumBalanceStore();
const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { l1BlockExplorerUrl } = storeToRefs(useNetworkStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, ethTransactionHash, commitTransaction } = useTransaction(walletEraStore.getL1Signer);

const lastFee = ref(props.fee);
watch(
  () => props.fee,
  (newFee) => {
    if (newFee) {
      lastFee.value = newFee;
    }
  }
);

const newFeeAlert = ref(false);

const totalOfEachToken = computed<{ token: Token; amount: BigNumberish }[]>(() => {
  const tokenBySymbol: { [symbol: string]: Token } = {};
  if (props.transaction) {
    tokenBySymbol[props.transaction.token.symbol] = props.transaction.token;
  }
  if (props.feeToken) {
    tokenBySymbol[props.feeToken.symbol] = props.feeToken;
  }

  const totalBySymbol: { [symbol: string]: BigNumberish } = {};
  const addToTotal = (tokenSymbol: string, amount: BigNumberish) => {
    if (totalBySymbol[tokenSymbol]) {
      totalBySymbol[tokenSymbol] = BigNumber.from(totalBySymbol[tokenSymbol]).add(amount);
    } else {
      totalBySymbol[tokenSymbol] = amount;
    }
  };

  if (props.transaction) {
    addToTotal(props.transaction.token.symbol, props.transaction.amount);
  }
  if (props.feeToken && lastFee.value) {
    addToTotal(props.feeToken.symbol, lastFee.value);
  }

  return Object.entries(totalBySymbol).map(([symbol, amount]) => ({
    token: tokenBySymbol[symbol],
    amount: amount.toString(),
  }));
});

const transactionReceiptDirection = computed(() => {
  if (!props.transaction) return undefined;
  return props.transaction.to === account.value.address ? "in" : "out";
});
const transactionReceiptIcon = computed(() => {
  if (!transactionReceiptDirection.value) {
    return undefined;
  }
  return transactionReceiptDirection.value === "in" ? PlusIcon : ArrowRightIcon;
});

const makeTransaction = async () => {
  if (!props.feeToken || !props.fee || !props.feeValues) return;

  const prevFee = BigNumber.from(lastFee.value);

  await props.estimate();

  if (prevFee.lt(props.fee)) {
    newFeeAlert.value = true;
  }

  if (newFeeAlert.value || props.buttonDisabled) return;

  const tx = await commitTransaction(props.transaction!, props.feeValues);

  if (status.value === "done") {
    previousTransactionAddress.value = props.transaction!.to;
  }

  if (tx) {
    for (const tokenAddress in totalOfEachToken.value) {
      const token = totalOfEachToken.value[tokenAddress];
      if (!token?.token.l1Address) continue;
      eraEthereumBalanceStore.deductBalance(token.token.l1Address, token.amount.toString());
    }
    tx.waitL1Commit()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        if (err?.code === Logger.errors.TRANSACTION_REPLACED) {
          if (err.cancelled) {
            error.value = new Error("Transaction was cancelled by the user");
            status.value = "not-started";
          } else {
            ethTransactionHash.value = (err.receipt as TransactionReceipt).transactionHash;
          }
          return;
        }
        error.value = err as Error;
        status.value = "not-started";
      })
      .finally(() => {
        eraTransfersHistoryStore.reloadRecentTransfers().catch(() => undefined);
        walletEraStore.requestBalance({ force: true }).catch(() => undefined);
        eraEthereumBalanceStore.requestBalance({ force: true }).catch(() => undefined);
      });
  }
};

const refererName = useRouteQuery("refererName");
const closeWindow = () => window.close();
</script>

<style lang="scss">
.confirm-deposit-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
.deposit-transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
