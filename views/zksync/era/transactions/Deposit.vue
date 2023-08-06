<template>
  <div class="flex h-full flex-col">
    <TransactionAllowanceModal
      v-model:opened="allowanceModalOpened"
      :transaction="transaction"
      :destination="destinations.era"
      :get-allowance="requestAllowance"
      :set-allowance="setTokenAllowance"
      :fetch-balance="() => fetchBalances(true)"
      :key="`${account.address}-${transactionKey}`"
      @continue="allowanceModalContinue"
    />
    <ConfirmTransactionModal
      v-model:opened="transactionConfirmModalOpened"
      :layout="layout"
      :fee="fee"
      :fee-token="feeToken"
      :fee-values="feeValues"
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
      v-if="layout === 'default'"
      title="Add funds to"
      :address="props.address"
      :destination="destination"
      :destination-tooltip="`Adding funds to ${destination.label}`"
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
        :tokens="Object.values(tokens ?? [])"
        :balances="balance"
        :maxAmount="maxAmount"
        :loading="tokensRequestInProgress || balancesLoading"
        autofocus
      />

      <slot name="form" />

      <CommonErrorBlock v-if="feeError" class="mt-2" @try-again="estimate().catch(() => {})">
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
            <span class="font-medium">{{ destinations.ethereum.label }}</span> to cover the fee
          </p>
        </CommonAlert>
      </transition>
      <transition v-bind="TransitionAlertScaleInOutTransition">
        <CommonAlert v-if="recommendedBalance && feeToken" class="mt-1" variant="error" :icon="ExclamationTriangleIcon">
          <p>
            Insufficient <span class="font-medium">{{ feeToken?.symbol }}</span> balance on
            {{ destinations.ethereum.label }} to cover the fee. We recommend having at least
            <span class="font-medium">{{ recommendedBalance }} {{ feeToken?.symbol }}</span> on
            {{ eraNetwork.l1Network?.name ?? "L1" }} for deposit.
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
            <button type="button" class="link inline underline underline-offset-2" @click="setAmountToAllowance">
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

      <EthereumTransactionFooter>
        <template #after-checks>
          <CommonButtonTopInfo v-if="!isCustomNode">Arriving in ~15 minutes</CommonButtonTopInfo>
          <CommonButton
            type="submit"
            :disabled="continueButtonDisabled"
            variant="primary-solid"
            @click="openConfirmationModal"
          >
            Continue
          </CommonButton>
        </template>
      </EthereumTransactionFooter>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { ArrowUpRightIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import EthereumTransactionFooter from "@/components/transaction/EthereumTransactionFooter.vue";
import ConfirmTransactionModal from "@/components/transaction/zksync/era/deposit/ConfirmTransactionModal.vue";

import useAllowance from "@/composables/transaction/useAllowance";
import useNetworks from "@/composables/useNetworks";
import useFee from "@/composables/zksync/era/deposit/useFee";

import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/era/deposit/ConfirmTransactionModal.vue";
import type { Token } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraEthereumBalanceStore } from "@/store/zksync/era/ethereumBalance";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { TOKEN_ALLOWANCE } from "@/utils/doc-links";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice, parseTokenAmount } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  layout: {
    type: String as PropType<"default" | "bridge">,
    default: "default",
  },
  address: {
    type: String,
  },
});

const route = useRoute();

const onboardStore = useOnboardStore();
const eraTokensStore = useEraTokensStore();
const eraProviderStore = useEraProviderStore();
const eraEthereumBalance = useEraEthereumBalanceStore();
const { account } = storeToRefs(onboardStore);
const { eraNetwork } = storeToRefs(eraProviderStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens, tokensRequestInProgress, tokensRequestError } = storeToRefs(eraTokensStore);
const { balance, balanceInProgress, allBalancePricesLoaded, balanceError } = storeToRefs(eraEthereumBalance);
const { isCustomNode } = useNetworks();

const destination = computed(() => destinations.value.era);

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
const defaultToken = computed(() => (tokens.value ? Object.values(tokens.value)[0] : undefined));
const selectedTokenAddress = ref(
  routeTokenAddress.value ?? tokenWithHighestBalancePrice.value?.address ?? defaultToken.value?.address
);
const selectedToken = computed<Token | undefined>(() => {
  if (!tokens.value) {
    return undefined;
  }
  return selectedTokenAddress.value ? tokens.value[selectedTokenAddress.value] : defaultToken.value;
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
watch(
  () => selectedToken?.value?.address,
  (address) => {
    if (!address) return;
    eraTokensStore.requestTokenPrice(address);
  }
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
const allowanceModalOpened = ref(false);
const {
  result: allowance,
  inProgress: allowanceRequestInProgress,
  error: allowanceRequestError,
  requestAllowance,

  setAllowance,
} = useAllowance(
  computed(() => account.value.address),
  computed(() => selectedToken.value?.l1Address),
  async () => (await eraProviderStore.requestProvider().getDefaultBridgeAddresses()).erc20L1,
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
  fee: feeValues,
  result: fee,
  inProgress: feeInProgress,
  error: feeError,
  recommendedBalance,
  feeToken,
  enoughBalanceToCoverFee,
  estimateFee,
  resetFee,
} = useFee(
  computed(() => account.value.address),
  tokens,
  balance,
  eraProviderStore.requestProvider,
  onboardStore.getPublicClient
);
watch(
  () => feeToken?.value?.address,
  (address) => {
    if (!address) return;
    eraTokensStore.requestTokenPrice(address);
  }
);
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
  if (!fee.value || !tokenBalance.value || !selectedToken.value) {
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
    token: selectedToken.value,
    to: toAddress,
    amount: totalComputeAmount.value.toString(),
  };
});

const estimate = async () => {
  if (!account.value.address || !transaction.value?.to || !selectedToken.value) {
    return;
  }
  await estimateFee(transaction.value.to, selectedToken.value.address);
};
const feeAutoUpdateEstimate = async () => {
  if (transactionConfirmModalOpened.value || allowanceModalOpened.value) {
    return;
  }
  await estimate();
};
watch(
  [() => transaction.value?.to, () => selectedToken.value?.address, () => account.value.address],
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
  if (allowanceRequestInProgress.value || allowanceRequestError.value) return true;
  if (!enoughAllowance.value) return false; // We can proceed to allowance modal even if fee is not loaded
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

  await eraEthereumBalance.requestBalance({ force }).then(() => {
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
