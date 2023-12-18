<template>
  <div>
    <template v-if="step === 'form'">
      <PageTitle>Bridge</PageTitle>
      <BridgeNavigation />
    </template>
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
          label="From"
          :tokens="availableTokens"
          :balances="availableBalances"
          :max-amount="maxAmount"
          :loading="tokensRequestInProgress || balanceInProgress"
        >
          <template #dropdown>
            <CommonButtonDropdown :toggled="false" size="xs" variant="light">
              <template #left-icon>
                <img :src="destinations.ethereum.iconUrl" class="h-full w-full" />
              </template>
              <span>{{ destinations.ethereum.label }}</span>
            </CommonButtonDropdown>
          </template>
        </CommonInputTransactionAmount>
        <CommonInputTransactionAddress
          v-model="address"
          label="To"
          :default-label="`To your account ${account.address ? shortenAddress(account.address) : ''}`"
          class="mt-6"
        >
          <template #dropdown>
            <CommonButtonDropdown :toggled="false" size="xs" variant="light">
              <template #left-icon>
                <img :src="destination.iconUrl" class="h-full w-full" />
              </template>
              <span>{{ destination.label }}</span>
            </CommonButtonDropdown>
          </template>
        </CommonInputTransactionAddress>
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
      </template>
      <template v-else-if="step === 'submitted'">
        <h1 class="h1 mt-block-gap text-center">Transaction submitted</h1>
        <p class="text-center">
          Your funds will be available after the transaction is committed on
          <span class="font-medium">{{ destinations.ethereum.label }}</span> and then processed on
          <span class="font-medium">{{ destination.label }}</span
          >.<br />You are free to close this page.
        </p>
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
            :href="`${l1BlockExplorerUrl}/tx/${ethTransactionHash}`"
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
        <div class="mt-4 flex items-center gap-4">
          <transition v-bind="TransitionOpacity()">
            <TransactionFeeDetails
              v-if="!feeError && (fee || feeLoading)"
              label="Fee:"
              :fee-token="feeToken"
              :fee-amount="fee"
              :loading="feeLoading"
              :update-duration="60000"
              @update="feeAutoUpdateEstimate"
            />
          </transition>
          <span v-if="!isCustomNode" class="ml-auto text-right text-neutral-700 dark:text-neutral-500">
            ~15 minutes
          </span>
        </div>
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <CommonAlert v-if="!enoughBalanceToCoverFee" class="mt-1" variant="error" :icon="ExclamationTriangleIcon">
            <p>
              Insufficient <span class="font-medium">{{ feeToken?.symbol }}</span> balance on
              <span class="font-medium">{{ destinations.ethereum.label }}</span> to cover the fee
            </p>
          </CommonAlert>
        </transition>
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <CommonAlert
            v-if="recommendedBalance && feeToken"
            class="mt-1"
            variant="error"
            :icon="ExclamationTriangleIcon"
          >
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
              <transition v-bind="TransitionAlertScaleInOutTransition">
                <div v-if="!enoughBalanceForTransaction" class="mb-4">
                  <CommonAlert
                    v-if="amountError === 'exceeds_max_amount'"
                    variant="error"
                    :icon="ExclamationTriangleIcon"
                  >
                    <p>
                      The inputted amount is higher than the recommended maximum amount. This means your transaction
                      might fail.
                    </p>
                    <button type="button" class="alert-link" @click="step = 'form'">Go back</button>
                  </CommonAlert>
                  <CommonAlert v-else-if="continueButtonDisabled" variant="error" :icon="ExclamationTriangleIcon">
                    <p>
                      The fee has changed since the last estimation. Insufficient
                      <span class="font-medium">{{ selectedToken?.symbol }}</span> balance to pay for transaction.
                      Please go back and adjust the amount to proceed.
                    </p>
                    <button type="button" class="alert-link" @click="step = 'form'">Go back</button>
                  </CommonAlert>
                </div>
              </transition>
              <CommonButton
                :disabled="continueButtonDisabled || status !== 'not-started'"
                class="w-full"
                variant="primary"
                @click="buttonContinue()"
              >
                <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
                  <span v-if="status === 'processing'">Processing...</span>
                  <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
                  <span v-else>Bridge now</span>
                </transition>
              </CommonButton>
              <TransactionButtonUnderlineConfirmTransaction :opened="status === 'waiting-for-signature'" />
            </template>
          </template>
        </EthereumTransactionFooter>
      </template>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import {
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import EthereumTransactionFooter from "@/components/transaction/EthereumTransactionFooter.vue";

import useAllowance from "@/composables/transaction/useAllowance";
import useNetworks from "@/composables/useNetworks";
import useFee from "@/composables/zksync/era/deposit/useFee";
import useTransaction from "@/composables/zksync/era/deposit/useTransaction";

import type { TransactionDestination } from "@/store/destinations";
import type { Token, TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useEraEthereumBalanceStore } from "@/store/zksync/era/ethereumBalance";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { TOKEN_ALLOWANCE } from "@/utils/doc-links";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice, parseTokenAmount } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const route = useRoute();

const onboardStore = useOnboardStore();
const eraTokensStore = useEraTokensStore();
const eraProviderStore = useEraProviderStore();
const eraEthereumBalance = useEraEthereumBalanceStore();
const eraWalletStore = useEraWalletStore();
const { account, isConnected } = storeToRefs(onboardStore);
const { eraNetwork } = storeToRefs(eraProviderStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { l1BlockExplorerUrl } = storeToRefs(useNetworkStore());
const { l1Tokens, tokensRequestInProgress, tokensRequestError } = storeToRefs(eraTokensStore);
const { balance, balanceInProgress, balanceError } = storeToRefs(eraEthereumBalance);
const { isCustomNode } = useNetworks();

const step = ref<"form" | "confirm" | "submitted">("form");
const destination = computed(() => destinations.value.era);

const availableTokens = computed<Token[]>(() => {
  if (balance.value) return balance.value;
  return Object.values(l1Tokens.value ?? []);
});
const availableBalances = computed<TokenAmount[]>(() => {
  return balance.value ?? [];
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
  return tokenWithHighestBalancePrice[0] ? tokenWithHighestBalancePrice[0] : undefined;
});
const defaultToken = computed(() => availableTokens.value[0] ?? undefined);
const selectedTokenAddress = ref<string | undefined>(
  routeTokenAddress.value ?? tokenWithHighestBalancePrice.value?.address ?? defaultToken.value?.address
);
const selectedToken = computed<Token | undefined>(() => {
  if (!selectedTokenAddress.value) {
    return defaultToken.value;
  }
  return (
    availableTokens.value.find((e) => e.address === selectedTokenAddress.value) ||
    availableBalances.value.find((e) => e.address === selectedTokenAddress.value) ||
    defaultToken.value
  );
});
const amountInputTokenAddress = computed({
  get: () => selectedToken.value?.address,
  set: (address) => {
    selectedTokenAddress.value = address;
  },
});
const tokenBalance = computed<BigNumberish | undefined>(() => {
  return balance.value?.find((e) => e.address === selectedToken.value?.address)?.amount;
});

const transactionKey = ref(0);
const {
  result: allowance,
  inProgress: allowanceRequestInProgress,
  error: allowanceRequestError,
  requestAllowance,

  /* setAllowance, */
} = useAllowance(
  computed(() => account.value.address),
  computed(() => selectedToken.value?.address),
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
/* const setTokenAllowance = async () => await setAllowance(totalComputeAmount.value); */

const unsubscribe = onboardStore.subscribeOnAccountChange(() => {
  step.value = "form";
});

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
} = useFee(availableTokens, balance, eraWalletStore.getL1VoidSigner, onboardStore.getPublicClient);

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
const enoughBalanceForTransaction = computed(() => !amountError.value);

const transaction = computed<
  | {
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
    token: {
      ...selectedToken.value!,
      amount: totalComputeAmount.value.toString(),
    },
    from: {
      address: account.value.address!,
      destination: destinations.value.ethereum,
    },
    to: {
      address: toAddress,
      destination: destination.value,
    },
  };
});

const estimate = async () => {
  if (!transaction.value?.from.address || !transaction.value?.to.address || !selectedToken.value) {
    return;
  }
  await estimateFee(transaction.value.to.address, selectedToken.value.address);
};
const feeAutoUpdateEstimate = async () => {
  await estimate();
};
watch(
  [() => selectedToken.value?.address, () => transaction.value?.from.address],
  () => {
    resetFee();
    estimate();
  },
  { immediate: true }
);

const feeLoading = computed(() => feeInProgress.value || (!fee.value && balanceInProgress.value));

const continueButtonDisabled = computed(() => {
  if (
    !transaction.value ||
    !enoughBalanceToCoverFee.value ||
    !(!amountError.value || amountError.value === "exceeds_max_amount") ||
    BigNumber.from(transaction.value.token.amount).isZero()
  )
    return true;
  if (allowanceRequestInProgress.value || allowanceRequestError.value) return true;
  if (!enoughAllowance.value) return false; // We can proceed to allowance modal even if fee is not loaded
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
const { status, error, ethTransactionHash, commitTransaction } = useTransaction(eraWalletStore.getL1Signer);

const transactionCommitted = ref(false);
const makeTransaction = async () => {
  if (continueButtonDisabled.value) return;

  const tx = await commitTransaction(
    {
      to: transaction.value!.to.address,
      tokenAddress: transaction.value!.token.address,
      amount: transaction.value!.token.amount,
    },
    feeValues.value!
  );

  if (status.value === "done") {
    step.value = "submitted";
    previousTransactionAddress.value = transaction.value!.to.address;
  }

  if (tx) {
    eraEthereumBalance.deductBalance(feeToken.value!.address!, fee.value!);
    eraEthereumBalance.deductBalance(transaction.value!.token.address!, transaction.value!.token.amount);
    tx.wait()
      .then(async () => {
        transactionCommitted.value = true;
        setTimeout(() => {
          eraTransfersHistoryStore.reloadRecentTransfers().catch(() => undefined);
          eraWalletStore.requestBalance({ force: true }).catch(() => undefined);
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
  address.value = "";
  amount.value = "";
  transactionKey.value += 1;
  step.value = "form";
  status.value = "not-started";
};

const fetchBalances = async (force = false) => {
  eraTokensStore.requestTokens();
  if (!isConnected.value) return;

  await eraEthereumBalance.requestBalance({ force }).then(() => {
    if (!selectedToken.value) {
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
