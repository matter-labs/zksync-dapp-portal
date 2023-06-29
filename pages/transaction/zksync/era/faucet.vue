<template>
  <FaucetModal :status="status" @close="resetFaucet">
    <template #tokens>
      <div v-if="tokens" class="flex flex-wrap justify-center gap-1.5">
        <TokenBadge v-for="item in faucetTokens" v-bind="item" :key="item.token.symbol" />
      </div>
    </template>
  </FaucetModal>

  <BackButton :fallback="{ name: 'transaction-zksync-era-receive' }" />
  <h1 class="h1">Faucet</h1>
  <CommonContentBlock class="faucet-page">
    <IconsFaucet class="mx-auto aspect-square h-auto w-24" />
    <p class="mt-3 text-center leading-tight wrap-balance">
      Ready to explore <span class="font-medium">zkSync Era</span>? Get started with our faucet tool, offering free test
      tokens, once per day, to enrich your crypto journey.
    </p>
    <div class="mt-5 flex flex-wrap justify-center gap-1.5 lg:px-4">
      <template v-if="tokensRequestInProgress">
        <TokenBadgeLoader />
        <TokenBadgeLoader />
        <TokenBadgeLoader />
        <TokenBadgeLoader />
        <TokenBadgeLoader />
      </template>
      <CommonErrorBlock v-else-if="tokensRequestError" @try-again="fetch">
        {{ tokensRequestError.message }}
      </CommonErrorBlock>
      <template v-else>
        <TokenBadge v-for="item in faucetTokens" v-bind="item" :key="item.token.symbol" />
      </template>
    </div>

    <div
      ref="turnstileElement"
      class="relative isolate mx-auto mt-5 flex h-[65px] w-[300px] justify-center"
      :class="{ hidden: turnstileError || !isFaucetAvailable }"
    >
      <CommonContentLoader class="absolute inset-0 z-[-1] block h-full w-full" />
    </div>
    <CommonErrorBlock v-if="isFaucetAvailable && turnstileError" class="mt-5" @try-again="initializeTurnstile">
      Captcha error: {{ turnstileError }}
    </CommonErrorBlock>
    <CommonErrorBlock v-else-if="isFaucetAvailable && faucetError" class="mt-2" @try-again="requestTokens">
      Requesting tokens error: {{ faucetError.message }}
    </CommonErrorBlock>

    <div class="mt-5">
      <template v-if="isFaucetAvailable">
        <CommonButtonTopInfo v-if="selectedEthereumNetwork.network === 'mainnet'">
          Test tokens will be available on zkSync Era Testnet
        </CommonButtonTopInfo>
        <CommonButton
          as="button"
          variant="primary-solid"
          :disabled="buttonDisabled"
          class="mx-auto"
          @click="requestTokens"
        >
          Request free test tokens
        </CommonButton>
      </template>
      <template v-else>
        <CommonButtonTopInfo>You already requested test tokens in the last 24 hours</CommonButtonTopInfo>
        <CommonButton as="button" variant="primary-solid" disabled class="mx-auto">
          You can use faucet in&nbsp;<CommonTimer :future-date="faucetAvailableTime" />
        </CommonButton>
      </template>
    </div>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { storeToRefs } from "pinia";

import FaucetModal, { type FaucetStep } from "@/components/transaction/zksync/era/EraFaucetModal.vue";

import useIsBeforeDate from "@/composables/useIsBeforeDate";
import useTurnstile from "@/composables/useTurnstile";
import useFaucet from "@/composables/zksync/era/useFaucet";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraTokensStore } from "@/store/zksync/era/tokens";

const eraTokensStore = useEraTokensStore();
const { account } = storeToRefs(useOnboardStore());
const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const { tokens, tokensRequestInProgress, tokensRequestError } = storeToRefs(eraTokensStore);
const fetch = () => {
  eraTokensStore.requestTokens();
};
fetch();

const faucetTokens = computed(() => {
  if (!tokens.value) return [];

  const findTokenIconUrlBySymbol = (symbol: string) => {
    const token = Object.values(tokens.value!).find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
    return token?.iconUrl;
  };

  return [
    {
      token: { decimals: 18, symbol: "ETH", iconUrl: findTokenIconUrlBySymbol("ETH") },
      amount: "10000000000000000",
    },
    {
      token: { decimals: 8, symbol: "wBTC", iconUrl: findTokenIconUrlBySymbol("wBTC") },
      amount: "1000000",
    },
    {
      token: {
        decimals: 18,
        symbol: "LINK",
        iconUrl:
          findTokenIconUrlBySymbol("LINK") ??
          "https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/link.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615",
      },
      amount: "100000000000000000000",
    },
    {
      token: { decimals: 6, symbol: "USDC", iconUrl: findTokenIconUrlBySymbol("USDC") },
      amount: "300000000",
    },
    {
      token: {
        decimals: 18,
        symbol: "DAI",
        iconUrl:
          findTokenIconUrlBySymbol("DAI") ??
          "https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/dai.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615",
      },
      amount: "300000000000000000000",
    },
  ];
});

const { token: turnstileToken, error: turnstileError, renderTurnstile } = useTurnstile();
const {
  faucetAvailableTime,
  inProgress: inFaucetRequestProgress,
  success: isFaucetRequestSucceeded,
  error: faucetError,
  requestTestTokens,
  reset: resetFaucet,
} = useFaucet(computed(() => account.value.address));
const { isBefore } = useIsBeforeDate(faucetAvailableTime);
const isFaucetAvailable = computed(() => !faucetAvailableTime.value || !isBefore.value);

const turnstileElement = ref<HTMLElement | null>(null);
const initializeTurnstile = () => {
  if (!turnstileElement.value) return;

  renderTurnstile(turnstileElement.value);
};
watch(
  [isFaucetAvailable, turnstileElement],
  ([available, element]) => {
    if (available && element) {
      initializeTurnstile();
    }
  },
  { immediate: true }
);

const buttonDisabled = computed(() => {
  return !account.value.address || inFaucetRequestProgress.value || !turnstileToken.value || turnstileError.value;
});
const status = computed<FaucetStep>(() => {
  if (isFaucetRequestSucceeded.value) return "done";
  if (inFaucetRequestProgress.value) return "processing";
  return "not-started";
});
const requestTokens = () => {
  if (buttonDisabled.value) return;
  requestTestTokens(turnstileToken.value!).catch(() => undefined);
};
</script>

<style lang="scss" scoped></style>
