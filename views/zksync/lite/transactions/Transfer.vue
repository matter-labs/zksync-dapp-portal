<template>
  <div class="flex h-full flex-col">
    <TokenSelectDropdown
      v-model:opened="selectFeeTokenModalOpened"
      v-model:token-address="selectedFeeTokenAddress"
      title="Choose fee token"
      :loading="balancesLoading"
      :balances="tokensAvailableForFee"
    >
      <template #body-bottom>
        <CommonAlert class="sticky bottom-0 mt-3" variant="neutral" :icon="InformationCircleIcon">
          <p>Only tokens available for paying fees are displayed</p>
          <a :href="LITE_FEE_PAYING" target="_blank" class="alert-link">
            Learn more
            <ArrowUpRightIcon class="ml-1 h-3 w-3" />
          </a>
        </CommonAlert>
      </template>
    </TokenSelectDropdown>

    <ConfirmTransactionModal
      v-model:opened="transactionConfirmModalOpened"
      :fee-token="feeToken"
      :fee="fee"
      :account-activation="isAccountActivated === false"
      :destination="destination"
      :transactions="transactions"
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
        >
          <button class="change-fee-token-button" type="button" title="Change fee token" @click="openFeeTokenModal">
            Change
            <span class="xs:hidden">&nbsp;fee token</span>
            <PencilIcon class="change-fee-token-icon" aria-hidden="true" />
          </button>
        </TransactionFeeDetails>
      </transition>
      <transition v-bind="TransitionAlertScaleInOutTransition">
        <CommonAlert v-if="!enoughBalanceToCoverFee" class="mt-1" variant="error" :icon="ExclamationTriangleIcon">
          <p>
            Insufficient <span class="font-medium">{{ feeToken?.symbol }}</span> balance on
            {{ destinations.zkSyncLite.label }} to cover the fee
          </p>
          <button type="button" class="alert-link" @click="openFeeTokenModal">Change fee token</button>
        </CommonAlert>
      </transition>
      <transition v-bind="TransitionAlertScaleInOutTransition">
        <CommonAlert v-if="isAccountActivated === false" class="mt-1" variant="info" :icon="InformationCircleIcon">
          <p>
            This is your first transaction on
            <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> network, which means your account
            requires <span class="font-medium">one-time</span> account activation. Transaction
            <span class="font-medium">fee</span> will be <span class="font-medium">higher than usual</span>
          </p>
          <a :href="LITE_ACCOUNT_ACTIVATION" target="_blank" class="alert-link">
            Learn more
            <ArrowUpRightIcon class="ml-1 h-3 w-3" />
          </a>
        </CommonAlert>
      </transition>

      <ZksyncLiteTransactionFooter>
        <template #after-checks>
          <CommonButtonTopLink v-if="type === 'Withdraw'" :href="LITE_WITHDRAWAL_TIMES" target="_blank">
            Will arrive in 10 minutes to 7 hours
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
      </ZksyncLiteTransactionFooter>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { ArrowUpRightIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { PencilIcon } from "@heroicons/vue/24/solid";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";
import { closestPackableTransactionAmount } from "zksync";

import ConfirmTransactionModal from "@/components/transaction/zksync/lite/ConfirmTransactionModal.vue";
import ZksyncLiteTransactionFooter from "@/components/transaction/zksync/lite/TransactionFooter.vue";

import useFee from "@/composables/zksync/lite/useFee";

import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/lite/ConfirmTransactionModal.vue";
import type { FeeEstimationParams } from "@/composables/zksync/lite/useFee";
import type { PropType } from "vue";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { LITE_ACCOUNT_ACTIVATION, LITE_FEE_PAYING, LITE_WITHDRAWAL_TIMES } from "@/utils/doc-links";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<"Transfer" | "Withdraw">,
    required: true,
  },
});

const route = useRoute();

const onboardStore = useOnboardStore();
const liteProviderStore = useLiteProviderStore();
const walletLiteStore = useLiteWalletStore();
const liteAccountActivationStore = useLiteAccountActivationStore();
const liteTokensStore = useLiteTokensStore();
const { account } = storeToRefs(onboardStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens } = storeToRefs(liteTokensStore);
const { balance, balanceInProgress, allBalancePricesLoaded, balanceError } = storeToRefs(walletLiteStore);
const { isAccountActivated, accountActivationCheckInProgress } = storeToRefs(liteAccountActivationStore);

const destination = computed(() =>
  props.type === "Transfer" ? destinations.value.zkSyncLite : destinations.value.ethereum
);

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

const selectFeeTokenModalOpened = ref(false);
const selectedFeeTokenAddress = ref<string | undefined>();
const feeTokenAddress = computed(() => selectedFeeTokenAddress.value ?? selectedTokenAddress.value);
const {
  result: fee,
  inProgress: feeInProgress,
  error: feeError,
  estimateFee,
  resetFee,

  tokensAvailableForFee,
  feeToken,
  enoughBalanceToCoverFee,
} = useFee(liteProviderStore.requestProvider, tokens, feeTokenAddress, balance);
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
    return closestPackableTransactionAmount(BigNumber.from(selectedToken.value.amount).sub(fee.value)).toString();
  }
  return closestPackableTransactionAmount(selectedToken.value.amount).toString();
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

const transactions = computed<ConfirmationModalTransaction[]>(() => {
  if (!selectedToken.value) {
    return [];
  }
  return [
    { type: props.type, token: selectedToken.value, to: props.address, amount: totalComputeAmount.value.toString() },
  ];
});

const estimate = async () => {
  if (
    !account.value.address ||
    !selectedToken.value ||
    !feeToken.value ||
    accountActivationCheckInProgress.value ||
    isAccountActivated.value === undefined
  ) {
    return;
  }
  const fees: FeeEstimationParams[] = transactions.value.map((e) => ({
    type: e.type,
    to: e.to,
    symbol: e.token.symbol,
  }));
  if (isAccountActivated.value === false) {
    fees.push({
      type: {
        ChangePubKey: { onchainPubkeyAuth: false },
      },
      symbol: selectedToken.value.symbol,
      to: account.value.address,
    });
  }
  await estimateFee(fees, account.value.address, feeToken.value.symbol);
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
    () => selectedToken.value?.symbol,
    () => feeToken.value?.symbol,
    () => account.value.address,
    isAccountActivated,
  ],
  () => {
    resetFee();
    estimate();
  },
  { immediate: true }
);

const feeLoading = computed(
  () =>
    feeInProgress.value ||
    (!fee.value && balancesLoading.value) ||
    (accountActivationCheckInProgress.value && isAccountActivated.value === undefined)
);
watch(
  () => feeToken.value?.symbol,
  (symbol) => {
    if (!symbol) return;
    liteTokensStore.requestTokenPrice(symbol);
  },
  { immediate: true }
);
const openFeeTokenModal = () => {
  selectFeeTokenModalOpened.value = true;
};

const balancesLoading = computed(() => {
  return balanceInProgress.value || (!selectedToken.value && !allBalancePricesLoaded.value);
});

const continueButtonDisabled = computed(
  () =>
    !selectedToken.value ||
    !enoughBalanceToCoverFee.value ||
    !fee.value ||
    !transactions.value.length ||
    feeLoading.value ||
    !!amountError.value ||
    totalComputeAmount.value.isZero()
);

const fetchBalances = async () => {
  await walletLiteStore.requestBalance().then(() => {
    if (allBalancePricesLoaded.value && !selectedToken.value) {
      selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
    }
  });
};
fetchBalances();

liteAccountActivationStore.checkAccountActivation();

const unsubscribeFetchBalance = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetchBalances();
});

onBeforeUnmount(() => {
  unsubscribe();
  unsubscribeFetchBalance();
});
</script>

<style lang="scss" scoped>
.lite.dark {
  .change-fee-token-button {
    @apply bg-primary-400 hover:bg-primary-300;
  }
}
.change-fee-token-button {
  @apply ml-2 mt-1 flex w-max cursor-pointer items-center rounded bg-primary-100/50 px-1.5 py-1 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-100 xs:-mr-4 xs:mt-0;
  @apply dark:bg-primary-300 dark:text-white dark:hover:bg-primary-200;

  .change-fee-token-icon {
    @apply ml-1 h-3 w-3;
  }
}
</style>
