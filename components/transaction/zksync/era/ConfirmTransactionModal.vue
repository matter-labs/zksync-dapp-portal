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
      <template v-if="transaction">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="account.address!"
            :destination="destinations.era"
            :tooltip="`${transactionActionName} from ${destinations.era.label}`"
          />
          <TokenBalance v-bind="transaction.token" as="div" :amount="transaction.amount" amount-display="full" />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="transaction.to"
            :destination="destination"
            :tooltip="`${transactionActionName} to ${destination.label}`"
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
          <CommonButtonTopLink
            v-if="destination.key === 'ethereum' && !isCustomNode"
            as="a"
            :href="ERA_WITHDRAWAL_DELAY"
            target="_blank"
          >
            Arriving in ~24 hours
            <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
          </CommonButtonTopLink>
          <CommonButton
            :disabled="buttonDisabled || newFeeAlert || status !== 'not-started'"
            class="mx-auto mt-3"
            variant="primary-solid"
            @click="makeTransaction"
          >
            <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
              <span v-if="status === 'processing'">Processing...</span>
              <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
              <span v-else>Send to {{ destination.label }}</span>
            </transition>
          </CommonButton>
          <TransactionButtonUnderlineConfirmTransaction :opened="status === 'waiting-for-signature'" />
        </template>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>

  <EraTransferSuccessfulModal
    v-else-if="transaction?.type === 'transfer'"
    opened
    :transfer="transferLineItem"
    :in-progress="!transactionCommitted"
  />
  <EraWithdrawalSuccessfulModal
    v-else-if="transaction?.type === 'withdrawal'"
    opened
    v-bind="$attrs"
    :layout="layout"
    :transfer="transferLineItem"
    @new-transaction="emit('newTransaction')"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { ArrowDownIcon, ArrowUpRightIcon, ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import EraTransferSuccessfulModal from "@/components/transaction/zksync/era/EraTransferSuccessfulModal.vue";
import EraWithdrawalSuccessfulModal from "@/components/transaction/zksync/era/EraWithdrawalSuccessfulModal.vue";

import useNetworks from "@/composables/useNetworks";
import useTransaction from "@/composables/zksync/era/useTransaction";

import type { FeeEstimationParams } from "@/composables/zksync/era/useFee";
import type { TransactionDestination } from "@/store/destinations";
import type { Token } from "@/types";
import type { EraTransfer } from "@/utils/zksync/era/mappers";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { ERA_WITHDRAWAL_DELAY } from "@/utils/doc-links";
import { calculateFee } from "@/utils/helpers";
import { TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  type: FeeEstimationParams["type"];
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
  feeToken: {
    type: Object as PropType<Token>,
  },
  fee: {
    type: Object as PropType<{
      gasLimit: BigNumberish;
      gasPrice: BigNumberish;
    }>,
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
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
const eraProviderStore = useEraProviderStore();
const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { isCustomNode } = useNetworks();

const { status, error, transactionHash, commitTransaction } = useTransaction(
  walletEraStore.getSigner,
  eraProviderStore.requestProvider
);

const feeAmount = computed(() => {
  if (!props.fee) return undefined;
  return calculateFee(props.fee.gasLimit, props.fee.gasPrice).toString();
});
const lastFee = ref(feeAmount.value);
watch(feeAmount, (newFee) => {
  if (newFee) {
    lastFee.value = newFee;
  }
});

const newFeeAlert = ref(false);

const totalOfEachToken = computed<{ token: Token; amount: BigNumberish }[]>(() => {
  const tokenByAddress: { [tokenAddress: string]: Token } = {};
  if (props.transaction) {
    tokenByAddress[props.transaction.token.address] = props.transaction.token;
  }
  if (props.feeToken) {
    tokenByAddress[props.feeToken.address] = props.feeToken;
  }

  const totalByAddress: { [tokenAddress: string]: BigNumberish } = {};
  const addToTotal = (tokenAddress: string, amount: BigNumberish) => {
    if (totalByAddress[tokenAddress]) {
      totalByAddress[tokenAddress] = BigNumber.from(totalByAddress[tokenAddress]).add(amount);
    } else {
      totalByAddress[tokenAddress] = amount;
    }
  };

  if (props.transaction) {
    addToTotal(props.transaction.token.address, props.transaction.amount);
  }
  if (props.feeToken && lastFee.value) {
    addToTotal(props.feeToken.address, lastFee.value);
  }

  return Object.entries(totalByAddress).map(([tokenAddress, amount]) => ({
    token: tokenByAddress[tokenAddress],
    amount: amount.toString(),
  }));
});

const transactionCommitted = ref(false);

const transactionActionName = computed(() => {
  switch (props.transaction?.type) {
    case "transfer":
      return "Sending";
    case "withdrawal":
      return "Withdrawing";

    default:
      return "";
  }
});

const makeTransaction = async () => {
  if (!props.feeToken || !feeAmount.value) return;

  const fee = BigNumber.from(lastFee.value);

  await props.estimate();

  if (fee.lt(feeAmount.value)) {
    newFeeAlert.value = true;
  }

  if (newFeeAlert.value || props.buttonDisabled) return;

  const tx = await commitTransaction(
    {
      type: props.transaction!.type,
      to: props.transaction!.to,
      tokenAddress: props.transaction!.token.address,
      amount: props.transaction!.amount,
    },
    props.fee!
  );

  if (status.value === "done") {
    previousTransactionAddress.value = props.transaction!.to;
  }

  if (tx) {
    for (const tokenAddress in totalOfEachToken.value) {
      const token = totalOfEachToken.value[tokenAddress];
      if (!token) continue;
      walletEraStore.deductBalance(token.token.address, token.amount.toString());
    }
    tx.wait()
      .then(async () => {
        transactionCommitted.value = true;
        eraTransfersHistoryStore.reloadRecentTransfers().catch(() => undefined);
        walletEraStore.requestBalance({ force: true }).catch(() => undefined);
      })
      .catch((err) => {
        transactionCommitted.value = false;
        error.value = err as Error;
        status.value = "not-started";
      });
  }
};
const transferLineItem = computed(() => {
  const transaction: EraTransfer = {
    transactionHash: transactionHash.value!,
    type: props.transaction!.type,
    from: account.value.address!,
    fromNetwork: "L2",
    to: props.transaction!.to,
    toNetwork: "L2",
    token: props.transaction!.token,
    amount: BigNumber.from(props.transaction!.amount).toString(),
    timestamp: new Date().toISOString(),
  };
  return transaction;
});
</script>

<style lang="scss">
.confirm-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
</style>
