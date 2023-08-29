<template>
  <div class="flex h-full flex-col">
    <ConfirmTransactionModal
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
    </ConfirmTransactionModal>

    <TransactionHeader
      v-if="layout === 'default'"
      title="Send to"
      :address="props.address"
      :destination="destination"
      :destination-tooltip="`Sending to ${destination.label}`"
    />

    <CommonErrorBlock v-if="tokensRequestError" @try-again="fetchBalances">
      Getting tokens error: {{ tokensRequestError.message }}
    </CommonErrorBlock>
    <CommonErrorBlock v-else-if="balanceError" @try-again="fetchBalances">
      Getting balances error: {{ balanceError.message }}
    </CommonErrorBlock>
    <form v-else class="flex h-full flex-col" @submit.prevent="">
      <CommonAmountInput
        v-model.trim="amount"
        v-model:error="amountError"
        v-model:token-address="amountInputTokenAddress"
        :tokens="availableTokens"
        :balances="availableBalances"
        :max-amount="maxAmount"
        :loading="tokensRequestInProgress || balancesLoading"
        autofocus
      >
        <template #token-dropdown-bottom v-if="type === 'withdrawal' && account.address">
          <CommonAlert class="sticky bottom-0 mt-3" variant="neutral" :icon="InformationCircleIcon">
            <p>Only tokens available for withdrawal are displayed</p>
          </CommonAlert>
        </template>
      </CommonAmountInput>

      <slot name="form" />

      <CommonErrorBlock v-if="feeError" class="mt-2" @try-again="estimate">
        Fee estimation error: {{ feeError.message }}
      </CommonErrorBlock>
      <transition v-bind="TransitionOpacity()">
        <TransactionFeeDetails
          v-if="!feeError && (fee || feeLoading)"
          class="mt-1"
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

      <EraTransactionFooter :authorization="false" :account-activation="false">
        <template #after-checks>
          <CommonButtonTopLink
            v-if="type === 'withdrawal' && !isCustomNode"
            as="a"
            :href="ERA_WITHDRAWAL_DELAY"
            target="_blank"
          >
            Arriving in ~24 hours
            <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
          </CommonButtonTopLink>
          <CommonButton
            type="submit"
            :disabled="continueButtonDisabled"
            variant="primary-solid"
            @click="openConfirmationModal"
          >
            Continue
          </CommonButton>
        </template>
      </EraTransactionFooter>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { ArrowUpRightIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import ConfirmTransactionModal from "@/components/transaction/zksync/era/ConfirmTransactionModal.vue";
import EraTransactionFooter from "@/components/transaction/zksync/era/EraTransactionFooter.vue";

import useNetworks from "@/composables/useNetworks";
import useFee from "@/composables/zksync/era/useFee";

import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/era/ConfirmTransactionModal.vue";
import type { FeeEstimationParams } from "@/composables/zksync/era/useFee";
import type { Token } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { ETH_L2_ADDRESS } from "@/utils/constants";
import { ERA_WITHDRAWAL_DELAY } from "@/utils/doc-links";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  layout: {
    type: String as PropType<"default" | "bridge">,
    default: "default",
  },
  address: {
    type: String,
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
const { account } = storeToRefs(onboardStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens, tokensRequestInProgress, tokensRequestError } = storeToRefs(eraTokensStore);
const { balance, balanceInProgress, allBalancePricesLoaded, balanceError } = storeToRefs(walletEraStore);
const { isCustomNode } = useNetworks();

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
    // return balance.value.filter((e) => e.l1Address); <-- Uncomment once Era Withdrawal Finalizer is live on mainnet
    return balance.value.filter((e) => e.l1Address && tokens.value![e.address]);
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
watch(
  () => selectedToken?.value?.address,
  (address) => {
    if (!address) return;
    eraTokensStore.requestTokenPrice(address);
  },
  { immediate: true }
);
watch(allBalancePricesLoaded, (loaded) => {
  if (loaded && !selectedTokenAddress.value) {
    if (totalComputeAmount.value.isZero()) {
      selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
    } else {
      selectedTokenAddress.value = selectedToken.value?.address;
    }
  }
});

const transactionKey = ref(0);
const transactionConfirmModalOpened = ref(false);
const unsubscribe = onboardStore.subscribeOnAccountChange(() => {
  transactionConfirmModalOpened.value = false;
});
const openConfirmationModal = () => {
  if (continueButtonDisabled.value) {
    return;
  }
  transactionConfirmModalOpened.value = true;
};

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
const gasLimitAndPrice = computed(() => {
  if (!gasLimit.value || !gasPrice.value) {
    return undefined;
  }
  return {
    gasLimit: gasLimit.value,
    gasPrice: gasPrice.value,
  };
});
watch(enoughBalanceToCoverFee, (isEnough) => {
  if (!isEnough && transactionConfirmModalOpened.value) {
    transactionConfirmModalOpened.value = false;
  }
});

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

const transaction = computed<ConfirmationModalTransaction | undefined>(() => {
  const toAddress = props.address ?? account.value.address;
  if (!toAddress || !selectedToken.value) {
    return undefined;
  }
  return {
    type: props.type,
    token: selectedToken.value,
    to: toAddress,
    amount: totalComputeAmount.value.toString(),
  };
});

const estimate = async () => {
  // estimation fails when token balance is 0
  if (!account.value.address || !transaction.value?.to || !selectedToken.value || selectedTokenZeroBalance.value) {
    return;
  }
  await estimateFee({
    type: props.type,
    from: account.value.address,
    to: transaction.value.to,
    tokenAddress: selectedToken.value.address,
  });
};
const feeAutoUpdateEstimate = async () => {
  if (transactionConfirmModalOpened.value) {
    return;
  }
  await estimate();
};
watch(
  [
    () => transaction.value?.to,
    () => selectedToken.value?.address,
    () => account.value.address,
    () => selectedTokenZeroBalance.value,
  ],
  () => {
    resetFee();
    estimate();
  },
  { immediate: true }
);

const feeLoading = computed(() => feeInProgress.value || (!fee.value && balancesLoading.value));

const balancesLoading = computed(() => {
  return balanceInProgress.value || (!selectedTokenAddress.value && !allBalancePricesLoaded.value);
});

const continueButtonDisabled = computed(() => {
  if (
    !transaction.value ||
    !enoughBalanceToCoverFee.value ||
    !!amountError.value ||
    BigNumber.from(transaction.value.amount).isZero()
  )
    return true;
  if (feeLoading.value || !fee.value) return true;
  return false;
});

const resetForm = () => {
  amount.value = "";
  transactionKey.value += 1;
  transactionConfirmModalOpened.value = false;
};

const fetchBalances = async (force = false) => {
  eraTokensStore.requestTokens();
  if (!account.value.address) return;

  await walletEraStore.requestBalance({ force }).then(() => {
    if (allBalancePricesLoaded.value && !selectedToken.value) {
      selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
    }
  });
};
fetchBalances();

const unsubscribeFetchBalance = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetchBalances();
});

onBeforeUnmount(() => {
  unsubscribe();
  unsubscribeFetchBalance();
});
</script>

<style lang="scss" scoped></style>
