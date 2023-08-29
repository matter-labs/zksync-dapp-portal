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
            :destination="destinations.zkSyncLite"
            :tooltip="`Add funds to ${destinations.zkSyncLite.label}`"
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
          <CommonButton
            :disabled="buttonDisabled || newFeeAlert || status !== 'not-started'"
            class="mx-auto mt-3"
            variant="primary-solid"
            @click="makeTransaction"
          >
            <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
              <span v-if="status === 'processing'">Processing...</span>
              <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
              <span v-else>Add funds to {{ destinations.zkSyncLite.label }}</span>
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
          Your funds will be available on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> after the
          transaction is committed on <span class="font-medium">{{ destinations.ethereum.label }}</span> and then
          processed on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span
          >. You are free to close this page.
        </p>
        <a
          v-if="l1BlockExplorerUrl"
          :href="`${l1BlockExplorerUrl}/tx/${ethTransactionHash}`"
          target="_blank"
          class="alert-link"
        >
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>

      <TransactionConfirmModalFooter>
        <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto mt-4" variant="primary-solid">
          Go to Assets page
        </CommonButton>
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
import { BigNumber } from "ethers";
import { Logger } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/transactionLineItem/TokenAmount.vue";
import TotalPrice from "@/components/transaction/transactionLineItem/TotalPrice.vue";

import useTransaction from "@/composables/zksync/lite/deposit/useTransaction";

import type { ZkSyncLiteToken } from "@/types";
import type { TransactionReceipt } from "@ethersproject/providers";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useLiteEthereumBalanceStore } from "@/store/zksync/lite/ethereumBalance";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { calculateFee } from "@/utils/helpers";
import { TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  to: string;
  token: ZkSyncLiteToken;
  amount: BigNumberish;
};

const props = defineProps({
  opened: {
    type: Boolean,
  },
  transaction: {
    type: Object as PropType<ConfirmationModalTransaction>,
  },
  feeToken: {
    type: Object as PropType<ZkSyncLiteToken>,
  },
  fee: {
    type: Object as PropType<{
      gasLimit: BigNumberish;
      gasPrice: BigNumberish;
    }>,
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
}>();
const closeModal = () => emit("update:opened", false);

const liteTransactionsHistoryStore = useLiteTransactionsHistoryStore();
const walletLiteStore = useLiteWalletStore();
const liteEthereumBalanceStore = useLiteEthereumBalanceStore();
const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { l1BlockExplorerUrl } = storeToRefs(useNetworkStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, ethTransactionHash, commitTransaction } = useTransaction(() =>
  walletLiteStore.getWalletInstance()
);

const fee = computed(() => {
  if (!props.fee) return undefined;
  return calculateFee(props.fee.gasLimit, props.fee.gasPrice).toString();
});
const lastFee = ref(fee.value);
watch(fee, (newFee) => {
  if (newFee) {
    lastFee.value = newFee;
  }
});

const newFeeAlert = ref(false);

const totalOfEachToken = computed<{ token: ZkSyncLiteToken; amount: BigNumberish }[]>(() => {
  const tokenBySymbol: { [symbol: string]: ZkSyncLiteToken } = {};
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
  if (!props.feeToken || !fee.value) return;

  const prevFee = BigNumber.from(lastFee.value);

  await props.estimate();

  if (prevFee.lt(fee.value)) {
    newFeeAlert.value = true;
  }

  if (newFeeAlert.value || props.buttonDisabled) return;

  const tx = await commitTransaction(props.transaction!, props.fee!);

  if (status.value === "done") {
    previousTransactionAddress.value = props.transaction!.to;
  }

  if (tx) {
    tx.awaitEthereumTxCommit()
      .then(() => {
        liteTransactionsHistoryStore.reloadRecentTransactions().catch(() => undefined);
        walletLiteStore.requestBalance({ force: true }).catch(() => undefined);
        liteEthereumBalanceStore.requestBalance({ force: true }).catch(() => undefined);
      })
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
      });
  }
};
</script>

<style lang="scss">
.confirm-deposit-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
.deposit-transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
