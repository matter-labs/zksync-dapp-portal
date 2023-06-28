<template>
  <BackButton :fallback="{ name: 'index' }" />
  <h1 class="h1">Faucet</h1>
  <CommonContentBlock>
    <IconsFaucet class="mx-auto aspect-square h-auto w-24" />
    <p class="mt-3 text-center leading-tight wrap-balance">
      Ready to explore the <span class="font-medium">zkSync Era∎</span>? Get started with our Faucet tool, offering free
      test tokens, once per day, to enrich your crypto journey.
    </p>
    <div class="mt-5 flex flex-wrap justify-center gap-1.5">
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
        <TokenBadge v-for="item in faucetTokens" v-bind="item" :key="item.token.address" />
      </template>
    </div>

    <div ref="turnstileElement" class="mt-5 flex h-[67px] justify-center" :class="{ hidden: turnstileError }"></div>
    <CommonErrorBlock v-if="turnstileError" class="mt-5" @try-again="initializeTurnstile">
      Captcha error: {{ turnstileError }}
    </CommonErrorBlock>

    <CommonButton as="button" variant="primary-solid" class="mx-auto mt-5" :disabled="buttonDisabled">
      Request Your Free Test Tokens
    </CommonButton>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { storeToRefs } from "pinia";

import useTurnstile from "@/composables/useTurnstile";
import useFaucet from "@/composables/zksync/era/useFaucet";

import { useNetworkStore } from "@/store/network";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { ETH_ADDRESS } from "@/utils/constants";

const eraTokensStore = useEraTokensStore();
const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const { tokens, tokensRequestInProgress, tokensRequestError } = storeToRefs(eraTokensStore);
const fetch = () => {
  eraTokensStore.requestTokens();
};
fetch();

const faucetTokens = computed(() => {
  if (!tokens.value) return [];

  return [
    {
      token: tokens.value[ETH_ADDRESS],
      amount: "10000000000000000",
    },
    {
      token: tokens.value["0x0BfcE1D53451B4a8175DD94e6e029F7d8a701e9c"],
      amount: "1000000",
    },
    {
      token: tokens.value["0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78"],
      amount: "100000000000000000000",
    },
    {
      token: tokens.value["0x0faF6df7054946141266420b43783387A78d82A9"],
      amount: "300000000",
    },
    {
      token: tokens.value["0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b"],
      amount: "300000000000000000000",
    },
  ];
});

const { token: turnstileToken, expire: turnstileExpire, fail: turnstileError, renderTurnstile } = useTurnstile();
const {
  isRequestPending: isFaucetRequestPending,
  /* isRequestFailed: isFaucetRequestFailed,
  success: isFaucetRequestSucceeded,
  errorMessage: faucetError,
  requestTestTokens, */
} = useFaucet();

const turnstileElement = ref<HTMLElement | null>(null);

const buttonDisabled = computed(() => {
  return (
    selectedEthereumNetwork.value.network === "mainnet" ||
    isFaucetRequestPending.value ||
    !turnstileToken.value ||
    turnstileExpire.value ||
    turnstileError.value
  );
});

const initializeTurnstile = () => {
  if (!turnstileElement.value) return;

  try {
    renderTurnstile(turnstileElement.value);
  } catch (error) {
    console.log("\n\n\n", error);
  }
};
watch(
  turnstileElement,
  (element) => {
    if (element) {
      initializeTurnstile();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
