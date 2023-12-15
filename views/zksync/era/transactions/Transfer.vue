<template>
  <div>
    <PageTitle v-if="step === 'form'" :fallback-route="fallbackRoute">{{ title }}</PageTitle>
    <PageTitle
      v-else-if="step === 'confirm'"
      :back-function="
        () => {
          step = 'form';
        }
      "
    >
      Confirm transaction
    </PageTitle>

    <!-- <ConfirmTransactionModal
      v-model:opened="transactionConfirmModalOpened"
      :layout="layout"
      :fee-token="feeToken"
      :fee="gasLimitAndPrice"
      :destination="destination"
      :transaction="transaction"
      :button-disabled="continueButtonDisabled || !enoughBalanceForTransaction"
      :estimate="estimate"
      :key="`${account.address}-${transactionKey}`"
      @new-transaction="resetForm"
    >
      <template #alerts>
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <div v-if="!enoughBalanceForTransaction" class="mx-4 my-3">
            <CommonAlert variant="error" :icon="ExclamationTriangleIcon">
              <p>
                {{
                  selectedToken?.address === ETH_L2_ADDRESS ? "The fee has changed since the last estimation. " : ""
                }}Insufficient <span class="font-medium">{{ selectedToken?.symbol }}</span> balance to pay for
                transaction. Please go back and adjust the amount to proceed.
              </p>
              <button type="button" class="alert-link" @click="transactionConfirmModalOpened = false">Go back</button>
            </CommonAlert>
          </div>
        </transition>
      </template>
    </ConfirmTransactionModal> -->

    <!-- <TransactionHeader
      v-if="layout === 'default'"
      title="Send to"
      :address="props.address"
      :destination="destination"
      :destination-tooltip="`Sending to ${destination.label}`"
    /> -->

    <CommonErrorBlock v-if="tokensRequestError" @try-again="fetchBalances">
      Getting tokens error: {{ tokensRequestError.message }}
    </CommonErrorBlock>
    <CommonErrorBlock v-else-if="balanceError" @try-again="fetchBalances">
      Getting balances error: {{ balanceError.message }}
    </CommonErrorBlock>
    <form v-else @submit.prevent="">
      <template v-if="step === 'form'">
        <CommonInputTransactionAmount
          v-model="amount"
          v-model:error="amountError"
          v-model:token-address="amountInputTokenAddress"
          :tokens="availableTokens"
          :balances="availableBalances"
          :max-amount="maxAmount"
          :loading="tokensRequestInProgress || balanceInProgress"
        >
          <template #token-dropdown-bottom v-if="type === 'withdrawal' && account.address">
            <CommonAlert class="sticky bottom-0 mt-3" variant="neutral" :icon="InformationCircleIcon">
              <p>Only tokens available for withdrawal are displayed</p>
            </CommonAlert>
          </template>
        </CommonInputTransactionAmount>
        <CommonInputTransactionAddress v-model="address" class="mt-6" />
      </template>
      <template v-else-if="step === 'confirm'">
        <CommonCardWithLineButtons>
          <TransactionSummaryTokenEntry label="You send" :token="transaction!.token" />
          <TransactionSummaryAddressEntry
            label="From"
            :address="transaction!.from.address"
            :destination="transaction!.from.destination"
          />
          <TransactionSummaryAddressEntry
            label="To"
            :address="transaction!.to.address"
            :destination="transaction!.to.destination"
          />
        </CommonCardWithLineButtons>
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <div v-if="!enoughBalanceForTransaction" class="mt-4">
            <CommonAlert variant="error" :icon="ExclamationTriangleIcon">
              <p>
                {{
                  selectedToken?.address === ETH_L2_ADDRESS ? "The fee has changed since the last estimation. " : ""
                }}Insufficient <span class="font-medium">{{ selectedToken?.symbol }}</span> balance to pay for
                transaction. Please go back and adjust the amount to proceed.
              </p>
              <button type="button" class="alert-link" @click="step = 'form'">Go back</button>
            </CommonAlert>
          </div>
        </transition>
      </template>
      <template v-else-if="step === 'submitted'">
        <template v-if="transactionCommitted">
          <h1 class="h1 mt-block-gap text-center">Transaction completed</h1>
          <p class="text-center">
            Your funds should now be available at the
            <a
              v-if="blockExplorerUrl"
              :href="`${blockExplorerUrl}/address/${transaction!.to.address}`"
              target="_blank"
              class="font-medium underline underline-offset-2"
              >destination address</a
            >
            <span v-else>destination address</span>.
          </p>
        </template>
        <template v-else>
          <h1 class="h1 mt-block-gap text-center">Transaction submitted</h1>
          <p class="text-center">
            Your funds will be available at the
            <a
              v-if="blockExplorerUrl"
              :href="`${blockExplorerUrl}/address/${transaction!.to.address}`"
              target="_blank"
              class="font-medium underline underline-offset-2"
              >destination address</a
            >
            <span v-else>destination address</span>
            after the transaction is committed on the <span class="font-medium">{{ destinations.era.label }}</span
            >. You are free to close this page.
          </p>
        </template>
        <CommonContentBlock class="mt-block-gap">
          <div class="grid grid-cols-[max-content_1fr_max-content] items-center gap-x-4 gap-y-2">
            <AddressAvatar class="mx-auto h-12 w-12" :address="transaction!.from.address">
              <template #icon>
                <img
                  v-tooltip="transaction!.from.destination.label"
                  :src="transaction!.from.destination.iconUrl"
                  :alt="transaction!.from.destination.label"
                />
              </template>
            </AddressAvatar>
            <div class="border-t border-dashed border-neutral-500"></div>
            <AddressAvatar class="mx-auto h-12 w-12" :address="transaction!.to.address">
              <template #icon>
                <img
                  v-tooltip="transaction!.to.destination.label"
                  :src="transaction!.to.destination.iconUrl"
                  :alt="transaction!.to.destination.label"
                />
              </template>
            </AddressAvatar>

            <div>{{ shortenAddress(transaction!.from.address) }}</div>
            <div></div>
            <div>{{ shortenAddress(transaction!.to.address) }}</div>
          </div>
          <CommonButton
            size="sm"
            variant="light"
            as="a"
            :href="`${blockExplorerUrl}/tx/${transactionHash}`"
            target="_blank"
            class="mx-auto mt-block-gap w-max"
          >
            Explorer
            <ArrowTopRightOnSquareIcon class="ml-2 h-6 w-6" aria-hidden="true" />
          </CommonButton>
          <div class="mt-block-padding flex items-center justify-center">
            <span class="text-neutral-400">Value:</span>
            <span class="ml-1">
              {{ parseTokenAmount(transaction!.token.amount, transaction!.token.decimals) }}
              {{ transaction!.token.symbol }}</span
            >
            <TokenImage class="ml-1.5 mr-1 h-5 w-5" v-bind="transaction!.token" />
          </div>
        </CommonContentBlock>

        <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mt-block-gap" variant="primary">
          Go to Assets page
        </CommonButton>
        <CommonButton size="sm" class="mx-auto mt-block-gap" @click="resetForm">Make another transaction</CommonButton>
      </template>

      <template v-if="step === 'form' || step === 'confirm'">
        <CommonErrorBlock v-if="feeError" class="mt-2" @try-again="estimate">
          Fee estimation error: {{ feeError.message }}
        </CommonErrorBlock>
        <transition v-bind="TransitionOpacity()">
          <TransactionFeeDetails
            v-if="!feeError && (fee || feeLoading)"
            class="mt-4"
            label="Fee:"
            :fee-token="feeToken"
            :fee-amount="fee"
            :loading="feeLoading"
            :update-duration="60000"
            @update="feeAutoUpdateEstimate"
          />
        </transition>
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <CommonAlert v-if="!enoughBalanceToCoverFee" class="mt-1" variant="error" :icon="ExclamationTriangleIcon">
            <p>
              Insufficient <span class="font-medium">{{ feeToken?.symbol }}</span> balance on
              {{ destinations.era.label }} to cover the fee
            </p>
          </CommonAlert>
        </transition>

        <EraTransactionFooter>
          <template #after-checks>
            <!-- <CommonButtonTopLink
              v-if="type === 'withdrawal' && !isCustomNode"
              as="a"
              :href="ERA_WITHDRAWAL_DELAY"
              target="_blank"
            >
              Arriving in ~24 hours
              <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
            </CommonButtonTopLink> -->
            <CommonButton
              v-if="step === 'form'"
              type="submit"
              :disabled="continueButtonDisabled"
              variant="primary"
              class="w-full"
              @click="buttonContinue()"
            >
              Continue
            </CommonButton>
            <template v-else-if="step === 'confirm'">
              <CommonButton
                :disabled="continueButtonDisabled || status !== 'not-started'"
                class="mt-3 w-full"
                variant="primary"
                @click="buttonContinue()"
              >
                <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
                  <span v-if="status === 'processing'">Processing...</span>
                  <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
                  <span v-else>Send now</span>
                </transition>
              </CommonButton>
              <TransactionButtonUnderlineConfirmTransaction :opened="status === 'waiting-for-signature'" />
            </template>
          </template>
        </EraTransactionFooter>
      </template>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import EraTransactionFooter from "@/components/transaction/zksync/era/EraTransactionFooter.vue";

import useFee from "@/composables/zksync/era/useFee";
import useTransaction from "@/composables/zksync/era/useTransaction";

import type { FeeEstimationParams } from "@/composables/zksync/era/useFee";
import type { TransactionDestination } from "@/store/destinations";
import type { Token, TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { ETH_L2_ADDRESS } from "@/utils/constants";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice, parseTokenAmount } from "@/utils/formatters";
import { calculateFee } from "@/utils/helpers";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  layout: {
    type: String as PropType<"default" | "bridge">,
    default: "default",
  },
  title: {
    type: String,
    required: true,
  },
  fallbackRoute: {
    type: [String, Object] as PropType<string | RouteLocationRaw>,
  },
  type: {
    type: String as PropType<FeeEstimationParams["type"]>,
    required: true,
  },
});

const route = useRoute();

const onboardStore = useOnboardStore();
const walletEraStore = useEraWalletStore();
const eraTokensStore = useEraTokensStore();
const eraProviderStore = useEraProviderStore();
const { account, isConnected } = storeToRefs(onboardStore);
const { blockExplorerUrl } = storeToRefs(eraProviderStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens, tokensRequestInProgress, tokensRequestError } = storeToRefs(eraTokensStore);
const { balance, balanceInProgress, balanceError } = storeToRefs(walletEraStore);

const step = ref<"form" | "confirm" | "submitted">("form");
const destination = computed(() => (props.type === "transfer" ? destinations.value.era : destinations.value.ethereum));

const availableTokens = computed(() => {
  if (!tokens.value) return [];
  if (props.type === "withdrawal") {
    return Object.values(tokens.value).filter((e) => e.l1Address);
  }
  return Object.values(tokens.value);
});
const availableBalances = computed(() => {
  if (props.type === "withdrawal") {
    if (!tokens.value) return [];
    return balance.value.filter((e) => e.l1Address);
  }
  return balance.value;
});
const routeTokenAddress = computed(() => {
  if (!route.query.token || Array.isArray(route.query.token) || !isAddress(route.query.token)) {
    return;
  }
  return checksumAddress(route.query.token);
});
const tokenWithHighestBalancePrice = computed(() => {
  const tokenWithHighestBalancePrice = [...availableBalances.value].sort((a, b) => {
    const aPrice = typeof a.price === "number" ? formatRawTokenPrice(a.amount, a.decimals, a.price) : 0;
    const bPrice = typeof b.price === "number" ? formatRawTokenPrice(b.amount, b.decimals, b.price) : 0;
    return bPrice - aPrice;
  });
  return tokenWithHighestBalancePrice[0] ?? undefined;
});
const defaultToken = computed(() => availableTokens.value?.[0] ?? undefined);
const selectedTokenAddress = ref<string | undefined>(
  routeTokenAddress.value ?? tokenWithHighestBalancePrice.value?.address ?? defaultToken.value?.address
);
const selectedToken = computed<Token | undefined>(() => {
  if (!tokens.value) {
    return undefined;
  }
  return selectedTokenAddress.value
    ? availableTokens.value.find((e) => e.address === selectedTokenAddress.value) ||
        availableBalances.value.find((e) => e.address === selectedTokenAddress.value) ||
        defaultToken.value
    : defaultToken.value;
});
const amountInputTokenAddress = computed({
  get: () => selectedToken.value?.address,
  set: (address) => {
    selectedTokenAddress.value = address;
  },
});
const tokenBalance = computed<BigNumberish | undefined>(() => {
  return balance.value.find((e) => e.address === selectedToken.value?.address)?.amount;
});
const selectedTokenZeroBalance = computed(() => {
  if (!tokenBalance.value) {
    return true;
  }
  return BigNumber.from(tokenBalance.value).isZero();
});

const transactionKey = ref(0);
const unsubscribe = onboardStore.subscribeOnAccountChange(() => {
  step.value = "form";
});

const {
  gasLimit,
  gasPrice,
  result: fee,
  inProgress: feeInProgress,
  error: feeError,
  feeToken,
  enoughBalanceToCoverFee,
  estimateFee,
  resetFee,
} = useFee(eraProviderStore.requestProvider, tokens, balance);

const address = ref("");
const amount = ref("");
const amountError = ref<string | undefined>();
const maxAmount = computed(() => {
  if (!selectedToken.value || !tokenBalance.value) {
    return undefined;
  }
  if (feeToken.value?.address === selectedToken.value.address) {
    if (BigNumber.from(tokenBalance.value).isZero()) {
      return "0";
    }
    if (!fee.value) {
      return undefined;
    }
    if (BigNumber.from(fee.value).gt(tokenBalance.value)) {
      return "0";
    }
    return BigNumber.from(tokenBalance.value).sub(fee.value).toString();
  }
  return tokenBalance.value.toString();
});
const totalComputeAmount = computed(() => {
  try {
    if (!amount.value || !selectedToken.value) {
      return BigNumber.from("0");
    }
    return decimalToBigNumber(amount.value, selectedToken.value.decimals);
  } catch (error) {
    return BigNumber.from("0");
  }
});
const enoughBalanceForTransaction = computed(() => {
  if (!fee.value || !selectedToken.value || !tokenBalance.value) {
    return true;
  }
  const totalToPay = totalComputeAmount.value.add(
    selectedToken.value.address === feeToken.value?.address ? fee.value : "0"
  );
  return BigNumber.from(tokenBalance.value).gte(totalToPay);
});

const transaction = computed<
  | {
      type: FeeEstimationParams["type"];
      token: TokenAmount;
      from: { address: string; destination: TransactionDestination };
      to: { address: string; destination: TransactionDestination };
    }
  | undefined
>(() => {
  const toAddress = isAddress(address.value) ? address.value : account.value.address;
  if (!toAddress || !selectedToken.value) {
    return undefined;
  }
  return {
    type: props.type,
    token: {
      ...selectedToken.value!,
      amount: totalComputeAmount.value.toString(),
    },
    from: {
      address: account.value.address!,
      destination: destinations.value.era,
    },
    to: {
      address: toAddress,
      destination: destination.value,
    },
  };
});

const estimate = async () => {
  // estimation fails when token balance is 0
  if (
    !transaction.value?.from.address ||
    !transaction.value?.to.address ||
    !selectedToken.value ||
    !tokenBalance.value ||
    selectedTokenZeroBalance.value
  ) {
    return;
  }
  await estimateFee({
    type: props.type,
    from: transaction.value.from.address,
    to: transaction.value.to.address,
    tokenAddress: selectedToken.value.address,
  });
};
const feeAutoUpdateEstimate = async () => {
  await estimate();
};
watch(
  [() => selectedToken.value?.address, () => selectedTokenZeroBalance.value],
  () => {
    resetFee();
    estimate();
  },
  { immediate: true }
);

const feeLoading = computed(() => feeInProgress.value || (!fee.value && balanceInProgress.value));

const continueButtonDisabled = computed(() => {
  if (
    !address.value ||
    !transaction.value ||
    !enoughBalanceToCoverFee.value ||
    !enoughBalanceForTransaction.value ||
    !!amountError.value ||
    BigNumber.from(transaction.value.token.amount).isZero()
  ) {
    return true;
  }
  if (feeLoading.value || !fee.value) return true;
  return false;
});
const buttonContinue = () => {
  if (continueButtonDisabled.value) {
    return;
  }
  if (step.value === "form") {
    step.value = "confirm";
  } else if (step.value === "confirm") {
    makeTransaction();
  }
};

/* Transaction signing and submitting */
const eraTransfersHistoryStore = useEraTransfersHistoryStore();
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, transactionHash, commitTransaction } = useTransaction(
  walletEraStore.getSigner,
  eraProviderStore.requestProvider
);

const transactionCommitted = ref(false);
const makeTransaction = async () => {
  if (continueButtonDisabled.value) return;

  const tx = await commitTransaction(
    {
      type: props.type,
      to: transaction.value!.to.address,
      tokenAddress: transaction.value!.token.address,
      amount: transaction.value!.token.amount,
    },
    {
      gasLimit: gasLimit.value!,
      gasPrice: gasPrice.value!,
    }
  );

  if (status.value === "done") {
    step.value = "submitted";
    previousTransactionAddress.value = transaction.value!.to.address;
  }

  if (tx) {
    const fee = calculateFee(gasLimit.value!, gasPrice.value!);
    walletEraStore.deductBalance(feeToken.value!.address, fee);
    walletEraStore.deductBalance(transaction.value!.token.address, transaction.value!.token.amount);
    tx.wait()
      .then(async () => {
        transactionCommitted.value = true;
        setTimeout(() => {
          eraTransfersHistoryStore.reloadRecentTransfers().catch(() => undefined);
          walletEraStore.requestBalance({ force: true }).catch(() => undefined);
        }, 2000);
      })
      .catch((err) => {
        transactionCommitted.value = false;
        error.value = err as Error;
        status.value = "not-started";
      });
  }
};

const resetForm = () => {
  amount.value = "";
  transactionKey.value += 1;
  step.value = "form";
  status.value = "not-started";
  transactionCommitted.value = false;
};

const fetchBalances = async (force = false) => {
  eraTokensStore.requestTokens();
  if (!isConnected.value) return;

  await walletEraStore.requestBalance({ force }).then(() => {
    if (!selectedToken.value) {
      selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
    }
  });
};
fetchBalances();

const unsubscribeFetchBalance = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetchBalances();
  resetFee();
  estimate();
});

onBeforeUnmount(() => {
  unsubscribe();
  unsubscribeFetchBalance();
});
</script>

<style lang="scss" scoped></style>
