<template>
  <CommonModal
    v-if="status !== 'done'"
    :opened="opened"
    :close-on-background-click="status === 'not-started'"
    class="confirm-transaction-modal"
    title="Confirm transaction"
    @close="closeModal"
  >
    <div class="flex h-full flex-col overflow-auto">
      <template v-if="accountActivation">
        <CommonCardWithLineButtons>
          <DestinationItem
            as="div"
            label="Account activation"
            :description="`${destinations.zkSyncLite.label} account activation`"
            :icon-url="destinations.zkSyncLite.iconUrl"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="PlusIcon" />
      </template>

      <template v-for="(item, index) in computedTransactions" :key="index">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="account.address!"
            :destination="destinations.zkSyncLite"
            :tooltip="`${getActionName(item.type)} from ${destinations.zkSyncLite.label}`"
          />
          <TokenBalance v-bind="item.token" as="div" :amount="item.amount" amount-display="full" />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="item.to"
            :destination="destination"
            :tooltip="`${getActionName(item.type)} to ${destination.label}`"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon v-if="index !== computedTransactions.length - 1" :icon="PlusIcon" />
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
          <a
            v-if="destination.key === 'ethereum'"
            class="link mx-auto -mb-1 mt-2 flex items-center justify-center text-center text-sm"
            :href="LITE_WITHDRAWAL_TIMES"
            target="_blank"
          >
            Will arrive in 10 minutes to 7 hours
            <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
          </a>
          <CommonButton
            :disabled="buttonDisabled || newFeeAlert || status !== 'not-started'"
            class="mx-auto mt-3"
            variant="primary-solid"
            @click="makeTransaction"
          >
            <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
              <span v-if="status === 'processing'">Processing...</span>
              <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
              <span v-else-if="status === 'sending'">Sending...</span>
              <span v-else>Send to {{ destination.label }}</span>
            </transition>
          </CommonButton>
          <TransactionButtonUnderlineConfirmTransaction :opened="status === 'waiting-for-signature'" />
        </template>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>

  <TransferSuccessfulModal
    v-else-if="destination.key === 'zkSyncLite'"
    opened
    :transaction-hashes="transactionHashes"
    :in-progress="!transactionCommitted"
  />
  <WithdrawSuccessfulModal v-else-if="destination.key === 'ethereum'" opened :transaction-hashes="transactionHashes" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { ArrowDownIcon, ArrowUpRightIcon, ExclamationCircleIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import TransferSuccessfulModal from "@/components/transaction/zksync/lite/TransferSuccessfulModal.vue";
import WithdrawSuccessfulModal from "@/components/transaction/zksync/lite/WithdrawSuccessfulModal.vue";

import useTransaction from "@/composables/zksync/lite/useTransaction";

import type { TransactionDestination } from "@/store/destinations";
import type { ZkSyncLiteToken } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";
import type { IncomingTxFeeType } from "zksync/build/types";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { LITE_WITHDRAWAL_TIMES } from "@/utils/doc-links";
import { TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  type: IncomingTxFeeType;
  to: string;
  token: ZkSyncLiteToken;
  amount: BigNumberish;
};

const props = defineProps({
  opened: {
    type: Boolean,
  },
  transactions: {
    type: Array as PropType<ConfirmationModalTransaction[]>,
  },
  feeToken: {
    type: Object as PropType<ZkSyncLiteToken>,
  },
  fee: {
    type: String as PropType<BigNumberish>,
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
  accountActivation: {
    type: Boolean,
    default: false,
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
const liteAccountActivationStore = useLiteAccountActivationStore();
const walletLiteStore = useLiteWalletStore();
const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, transactionHashes, commitTransaction } = useTransaction(() =>
  walletLiteStore.getWalletInstance(true)
);

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

const computedTransactions = computed(() => props.transactions ?? []);

const totalOfEachToken = computed<{ token: ZkSyncLiteToken; amount: BigNumberish }[]>(() => {
  const tokenBySymbol: { [symbol: string]: ZkSyncLiteToken } = Object.fromEntries(
    computedTransactions.value.map((e) => [e.token.symbol, e.token])
  );
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

  for (const transaction of computedTransactions.value) {
    addToTotal(transaction.token.symbol, transaction.amount);
  }

  if (props.feeToken && lastFee.value) {
    addToTotal(props.feeToken.symbol, lastFee.value);
  }

  return Object.entries(totalBySymbol).map(([symbol, amount]) => ({
    token: tokenBySymbol[symbol],
    amount: amount.toString(),
  }));
});

const transactionCommitted = ref(false);

const getActionName = (type: IncomingTxFeeType) => {
  if (type === "Transfer") return "Sending";
  else if (type === "Withdraw") return "Withdrawing";
  return "Transaction";
};

const makeTransaction = async () => {
  if (!props.feeToken || !props.fee) return;

  const fee = BigNumber.from(lastFee.value);

  await props.estimate();

  if (fee.lt(props.fee)) {
    newFeeAlert.value = true;
  }

  if (newFeeAlert.value || props.buttonDisabled) return;

  const tx = await commitTransaction(
    computedTransactions.value.map((e) => ({
      type: e.type,
      to: e.to,
      symbol: e.token.symbol,
      amount: e.amount,
    })),
    props.feeToken.symbol,
    props.fee,
    props.accountActivation
      ? await liteAccountActivationStore.getAccountActivationTransaction(props.feeToken.id)
      : undefined
  );

  if (status.value === "done") {
    previousTransactionAddress.value = computedTransactions.value[0].to;
  }

  if (tx) {
    try {
      await tx[0].awaitReceipt();
      transactionCommitted.value = true;

      liteTransactionsHistoryStore.reloadRecentTransactions().catch(() => undefined);
      walletLiteStore.requestBalance({ force: true }).catch(() => undefined);
      if (liteAccountActivationStore.isAccountActivated === false) {
        liteAccountActivationStore.checkAccountActivation({ force: true }).catch(() => undefined);
      }
    } catch (err) {
      transactionCommitted.value = false;
      error.value = err as Error;
      status.value = "not-started";
    }
  }
};
</script>

<style lang="scss">
.confirm-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
</style>
