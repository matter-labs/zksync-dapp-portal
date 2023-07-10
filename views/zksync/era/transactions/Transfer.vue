<template>
  <div class="flex h-full flex-col">
    <ConfirmTransactionModal
      v-model:opened="transactionConfirmModalOpened"
      :fee-token="feeToken"
      :fee="gasLimitAndPrice"
      :destination="destination"
      :transaction="transaction"
      :button-disabled="continueButtonDisabled || !enoughBalanceForTransaction"
      :estimate="estimate"
      :key="account.address"
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
      title="Send to"
      :address="props.address"
      :destination="destination"
      :destination-tooltip="`Sending to ${destination.label}`"
    />

    <CommonErrorBlock v-if="balanceError" @try-again="fetchBalances">
      Getting balances error: {{ balanceError.message }}
    </CommonErrorBlock>
    <form v-else class="flex h-full flex-col" @submit.prevent="">
      <CommonAmountInput
        v-model.trim="amount"
        v-model:error="amountError"
        v-model:token-address="selectedTokenAddress"
        :balances="balance"
        :maxAmount="maxAmount"
        :loading="balancesLoading"
        autofocus
      />
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
            v-if="type === 'withdrawal' && selectedEthereumNetwork.network === 'mainnet'"
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

import { ArrowUpRightIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import ConfirmTransactionModal from "@/components/transaction/zksync/era/ConfirmTransactionModal.vue";
import EraTransactionFooter from "@/components/transaction/zksync/era/EraTransactionFooter.vue";

import useFee from "@/composables/zksync/era/useFee";

import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/era/ConfirmTransactionModal.vue";
import type { FeeEstimationParams } from "@/composables/zksync/era/useFee";
import type { PropType } from "vue";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { ETH_L2_ADDRESS } from "@/utils/constants";
import { ERA_WITHDRAWAL_DELAY } from "@/utils/doc-links";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  address: {
    type: String,
    required: true,
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
const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens } = storeToRefs(eraTokensStore);
const { balance, balanceInProgress, allBalancePricesLoaded, balanceError } = storeToRefs(walletEraStore);

const destination = computed(() => (props.type === "transfer" ? destinations.value.era : destinations.value.ethereum));

const routeTokenAddress = computed(() => {
  if (!route.query.token || Array.isArray(route.query.token) || !isAddress(route.query.token)) {
    return;
  }
  return checksumAddress(route.query.token);
});
const tokenWithHighestBalancePrice = computed(() => {
  const tokenWithHighestBalancePrice = [...balance.value].sort((a, b) => {
    const aPrice = typeof a.price === "number" ? formatRawTokenPrice(a.amount, a.decimals, a.price) : 0;
    const bPrice = typeof b.price === "number" ? formatRawTokenPrice(b.amount, b.decimals, b.price) : 0;
    return bPrice - aPrice;
  });
  return tokenWithHighestBalancePrice[0] ? tokenWithHighestBalancePrice[0] : undefined;
});
const selectedTokenAddress = ref(routeTokenAddress.value ?? tokenWithHighestBalancePrice.value?.address);
const selectedToken = computed(() => {
  if (!balance.value) {
    return undefined;
  }
  return balance.value.find((e) => e.address === selectedTokenAddress.value);
});
const selectedTokenZeroBalance = computed(() => {
  if (!selectedToken.value) {
    return undefined;
  }
  return BigNumber.from(selectedToken.value.amount).isZero();
});
watch(
  () => selectedToken?.value?.address,
  (address) => {
    if (!address) return;
    eraTokensStore.requestTokenPrice(address);
  }
);
watch(allBalancePricesLoaded, (loaded) => {
  if (loaded && !selectedToken.value) {
    selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
  }
});

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
watch(
  () => feeToken?.value?.address,
  (address) => {
    if (!address) return;
    eraTokensStore.requestTokenPrice(address);
  }
);
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
  if (!selectedToken.value) {
    return undefined;
  }
  if (feeToken.value?.address === selectedToken.value.address) {
    if (!fee.value) {
      return undefined;
    }
    if (BigNumber.from(fee.value).gt(selectedToken.value.amount)) {
      return "0";
    }
    return BigNumber.from(selectedToken.value.amount).sub(fee.value).toString();
  }
  return selectedToken.value.amount.toString();
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
  if (!fee.value || !selectedToken.value) {
    return true;
  }
  const totalToPay = totalComputeAmount.value.add(
    selectedToken.value.address === feeToken.value?.address ? fee.value : "0"
  );
  return BigNumber.from(selectedToken.value.amount).gte(totalToPay);
});

const transaction = computed<ConfirmationModalTransaction | undefined>(() => {
  if (!selectedToken.value) {
    return undefined;
  }
  return {
    type: props.type,
    token: selectedToken.value,
    to: props.address,
    amount: totalComputeAmount.value.toString(),
  };
});

const estimate = async () => {
  if (!account.value.address || !selectedToken.value || selectedTokenZeroBalance.value) {
    return;
  }
  await estimateFee({
    type: props.type,
    from: account.value.address,
    to: props.address,
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
    () => props.address,
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
  return balanceInProgress.value || (!selectedToken.value && !allBalancePricesLoaded.value);
});

const continueButtonDisabled = computed(() => {
  if (
    !selectedToken.value ||
    !enoughBalanceToCoverFee.value ||
    !!amountError.value ||
    totalComputeAmount.value.isZero()
  )
    return true;
  if (feeLoading.value || !fee.value) return true;
  return false;
});

const fetchBalances = async (force = false) => {
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
