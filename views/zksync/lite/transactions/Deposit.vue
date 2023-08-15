<template>
  <div class="flex h-full flex-col">
    <TransactionAllowanceModal
      v-model:opened="allowanceModalOpened"
      :transaction="transaction"
      :destination="destinations.zkSyncLite"
      :get-allowance="requestAllowance"
      :set-allowance="setTokenAllowance"
      :fetch-balance="() => fetchBalances(true)"
      @continue="allowanceModalContinue"
    />
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
                The fee has changed since the last estimation. Insufficient
                <span class="font-medium">{{ selectedToken?.symbol }}</span> balance to pay for transaction. Please go
                back and adjust the amount to proceed.
              </p>
              <button type="button" class="alert-link" @click="transactionConfirmModalOpened = false">Go back</button>
            </CommonAlert>
          </div>
        </transition>
      </template>
    </ConfirmTransactionModal>

    <TransactionHeader
      title="Add funds to"
      :address="props.address"
      :destination="destination"
      :destination-tooltip="`Adding funds to ${destination.label}`"
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
            {{ destinations.ethereum.label }} to cover the fee
          </p>
        </CommonAlert>
      </transition>
      <transition v-bind="TransitionAlertScaleInOutTransition">
        <CommonAlert
          v-if="!enoughAllowance && !allowance?.isZero()"
          class="mt-1"
          variant="info"
          :icon="InformationCircleIcon"
        >
          <p>
            Your current allowance for <span class="font-medium">{{ selectedToken!.symbol }}</span> is
            <button type="button" class="link underline underline-offset-2" @click="setAmountToAllowance">
              {{ parseTokenAmount(allowance!, selectedToken!.decimals) }}
            </button>
            <span class="block wrap-balance">
              Depositing more than that will require you to approve a new allowance.
            </span>
          </p>
          <a :href="TOKEN_ALLOWANCE" target="_blank" class="alert-link">
            Learn more
            <ArrowUpRightIcon class="ml-1 h-3 w-3" />
          </a>
        </CommonAlert>
      </transition>
      <CommonErrorBlock v-if="allowanceRequestError" class="mt-2" @try-again="requestAllowance">
        Checking allowance error: {{ allowanceRequestError.message }}
      </CommonErrorBlock>

      <ZksyncLiteTransactionFooter :authorization="false" :account-activation="false">
        <template #after-checks>
          <CommonButton
            type="submit"
            :disabled="continueButtonDisabled"
            variant="primary-solid"
            @click="openConfirmationModal"
          >
            Continue
          </CommonButton>
        </template>
      </ZksyncLiteTransactionFooter>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { ArrowUpRightIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import ZksyncLiteTransactionFooter from "@/components/transaction/zksync/lite/TransactionFooter.vue";
import ConfirmTransactionModal from "@/components/transaction/zksync/lite/deposit/ConfirmTransactionModal.vue";

import useAllowance from "@/composables/transaction/useAllowance";
import useFee from "@/composables/zksync/lite/deposit/useFee";

import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/lite/deposit/ConfirmTransactionModal.vue";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteEthereumBalanceStore } from "@/store/zksync/lite/ethereumBalance";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { TOKEN_ALLOWANCE } from "@/utils/doc-links";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice, parseTokenAmount } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const route = useRoute();

const onboardStore = useOnboardStore();
const walletLiteStore = useLiteWalletStore();
const liteTokensStore = useLiteTokensStore();
const liteProviderStore = useLiteProviderStore();
const liteEthereumBalance = useLiteEthereumBalanceStore();
const { account } = storeToRefs(onboardStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens } = storeToRefs(liteTokensStore);
const { balance, balanceInProgress, allBalancePricesLoaded, balanceError } = storeToRefs(liteEthereumBalance);

const destination = computed(() => destinations.value.zkSyncLite);

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
watch(
  () => selectedToken?.value?.symbol,
  (symbol) => {
    if (!symbol) return;
    liteTokensStore.requestTokenPrice(symbol);
  },
  { immediate: true }
);
watch(allBalancePricesLoaded, (loaded) => {
  if (loaded && !selectedToken.value) {
    selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
  }
});

const allowanceModalOpened = ref(false);
const {
  result: allowance,
  inProgress: allowanceRequestInProgress,
  error: allowanceRequestError,
  requestAllowance,

  setAllowance,
} = useAllowance(
  computed(() => account.value.address),
  computed(() => selectedToken.value?.address),
  async () => (await liteProviderStore.requestProvider())?.contractAddress.mainContract,
  onboardStore.getWallet,
  onboardStore.getPublicClient
);
const enoughAllowance = computed(() => {
  if (!allowance.value || !selectedToken.value) {
    return true;
  }
  return BigNumber.from(allowance.value).gte(totalComputeAmount.value);
});
const setAmountToAllowance = () => {
  if (!allowance.value || !selectedToken.value) {
    return;
  }
  amount.value = parseTokenAmount(allowance.value, selectedToken.value.decimals);
};
const setTokenAllowance = async () => await setAllowance(totalComputeAmount.value);
const allowanceModalContinue = () => {
  allowanceModalOpened.value = false;
  if (enoughAllowance.value) {
    transactionConfirmModalOpened.value = true;
  }
};

const transactionConfirmModalOpened = ref(false);
const unsubscribe = onboardStore.subscribeOnAccountChange(() => {
  transactionConfirmModalOpened.value = false;
});
const openConfirmationModal = () => {
  if (continueButtonDisabled.value) {
    return;
  }
  if (!enoughAllowance.value) {
    allowanceModalOpened.value = true;
  } else {
    transactionConfirmModalOpened.value = true;
  }
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
} = useFee(tokens, balance, walletLiteStore.getWalletInstance, onboardStore.getPublicClient);
watch(
  () => feeToken?.value?.symbol,
  (symbol) => {
    if (!symbol) return;
    liteTokensStore.requestTokenPrice(symbol);
  },
  { immediate: true }
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
  return { token: selectedToken.value, to: props.address, amount: totalComputeAmount.value.toString() };
});

const estimate = async () => {
  if (!account.value.address || !selectedToken.value) {
    return;
  }
  await estimateFee(account.value.address, selectedToken.value.address);
};
const feeAutoUpdateEstimate = async () => {
  if (transactionConfirmModalOpened.value || allowanceModalOpened.value) {
    return;
  }
  await estimate();
};
watch(
  [() => props.address, () => selectedToken.value?.symbol, () => account.value.address],
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
  if (allowanceRequestInProgress.value || allowanceRequestError.value) return true;
  if (!enoughAllowance.value) return false; // We can proceed to allowance modal even if fee is not loaded
  if (feeLoading.value || !fee.value) return true;
  return false;
});

const fetchBalances = async (force = false) => {
  await liteEthereumBalance.requestBalance({ force }).then(() => {
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
