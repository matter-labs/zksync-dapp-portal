<template>
  <FaucetModal v-if="faucetNetwork" :faucet-network="faucetNetwork" :status="status" @close="resetFaucet">
    <template #tokens>
      <div class="flex flex-wrap justify-center gap-1.5">
        <TokenBadge v-for="item in faucetTokens" v-bind="item" :key="item.token.symbol" />
      </div>
    </template>
  </FaucetModal>

  <BackButton :fallback="{ name: 'transaction-zksync-era-receive' }" />
  <h1 class="h1">Faucet</h1>
  <CommonContentBlock class="faucet-page">
    <AnimationsIdleFaucet class="mx-auto w-80" />
    <div v-if="noFunds">
      <p class="text-center text-2xl font-bold">Out of funds</p>
      <p class="mt-3 text-center leading-tight wrap-balance">
        The faucet is <span class="font-medium">out of funds currently</span>. If you want to test your app, consider
        testing it locally with access to rich wallets
        <a class="link" href="https://era.zksync.io/docs/tools/testing/" target="_blank"
          >following the instructions from our docs</a
        >.
      </p>
      <div class="mt-3 text-center leading-tight wrap-balance">
        You can also request Goerli ETH from one of the following third party faucets:
        <ul class="mt-4 space-y-3">
          <li>
            <a class="link hover:underline" href="https://faucet.chainstack.com/zksync-testnet-faucet" target="_blank"
              >Chainstack faucet</a
            >
          </li>
          <li>
            <a class="link hover:underline" href="https://faucet.quicknode.com/ethereum/goerli" target="_blank"
              >QuickNode faucet</a
            >
          </li>
          <li><a class="link hover:underline" href="https://goerli-faucet.pk910.de/" target="_blank">PoW faucet</a></li>
        </ul>
      </div>
    </div>

    <div v-else>
      <p class="mt-3 text-center leading-tight wrap-balance">
        Ready to explore <span class="font-medium">zkSync Era</span>? Get started with our faucet tool, offering free
        test tokens, once per day, to enrich your crypto journey.
      </p>

      <div class="mt-5 flex flex-wrap justify-center gap-1.5 lg:px-4">
        <TokenBadge v-for="item in faucetTokens" v-bind="item" :key="item.token.symbol" />
      </div>

      <div
        ref="turnstileElement"
        class="relative isolate mx-auto mt-5 flex h-[65px] w-[300px] justify-center"
        :class="{ hidden: turnstileError || !isFaucetAvailable || !faucetAvailableOnCurrentNetwork }"
      >
        <CommonContentLoader class="absolute inset-0 z-[-1] block h-full w-full" />
      </div>
      <CommonErrorBlock v-if="isFaucetAvailable && turnstileError" class="mt-5" @try-again="initializeTurnstile">
        Captcha error: {{ turnstileError }}
      </CommonErrorBlock>
      <CommonErrorBlock v-else-if="isFaucetAvailable && faucetError" class="mt-2" @try-again="requestTokens">
        Requesting test tokens error: {{ faucetError.message }}
      </CommonErrorBlock>

      <div class="mt-5">
        <template v-if="isFaucetAvailable">
          <template v-if="!faucetAvailableOnCurrentNetwork">
            <CommonButtonTopInfo>Switch to {{ faucetNetwork.name }} network to request test tokens</CommonButtonTopInfo>
            <CommonButton as="button" variant="primary-solid" class="mx-auto" @click="changeNetwork">
              Change network to {{ faucetNetwork.name }}
            </CommonButton>
          </template>
          <template v-else>
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
        </template>
        <template v-else>
          <CommonButtonTopInfo>You already requested test tokens in the last 24 hours</CommonButtonTopInfo>
          <CommonButton as="button" variant="primary-solid" disabled class="mx-auto">
            You can use faucet in&nbsp;<CommonTimer :future-date="faucetAvailableTime!" />
          </CommonButton>
        </template>
      </div>
    </div>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";

import FaucetModal, { type FaucetStep } from "@/components/transaction/zksync/era/EraFaucetModal.vue";

import useIsBeforeDate from "@/composables/useIsBeforeDate";
import useNetworks from "@/composables/useNetworks";
import useTurnstile from "@/composables/useTurnstile";
import useFaucet from "@/composables/zksync/era/useFaucet";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { getNetworkUrl } from "@/utils/helpers";

const walletEraStore = useEraWalletStore();
const eraTransfersHistoryStore = useEraTransfersHistoryStore();
const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);
const { selectedNetwork } = storeToRefs(useNetworkStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());

const route = useRoute();

// displays the out of funds message replacing the form to request tokens
const noFunds = true;

const { eraNetworks } = useNetworks();
const faucetNetwork = computed(() => {
  if (!eraNetwork.value.faucetUrl) {
    return eraNetworks.filter((network) => network.faucetUrl)[0];
  }
  return eraNetworks.filter((network) => network.faucetUrl)[0];
});
const faucetAvailableOnCurrentNetwork = computed(() => {
  if (!faucetNetwork.value) return false;
  return faucetNetwork.value.key === selectedNetwork.value.key;
});
const faucetTokens = computed(() => {
  return [
    {
      token: { decimals: 18, symbol: "ETH" },
      amount: "10000000000000000",
    },
    {
      token: { decimals: 8, symbol: "wBTC" },
      amount: "1000000",
    },
    {
      token: { decimals: 18, symbol: "LINK" },
      amount: "100000000000000000000",
    },
    {
      token: { decimals: 6, symbol: "USDC" },
      amount: "300000000",
    },
    {
      token: { decimals: 18, symbol: "DAI" },
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
} = useFaucet(
  computed(() => account.value.address),
  computed(() => faucetNetwork.value ?? eraNetwork.value)
);
const { isBefore } = useIsBeforeDate(faucetAvailableTime);
const isFaucetAvailable = computed(() => true || !faucetAvailableTime.value || !isBefore.value);

const turnstileElement = ref<HTMLElement | null>(null);
const initializeTurnstile = () => {
  if (!turnstileElement.value) return;

  renderTurnstile(turnstileElement.value);
};
watch(
  [isFaucetAvailable, faucetAvailableOnCurrentNetwork, turnstileElement],
  ([available, availableOnCurrentNetwork, element]) => {
    if (available && availableOnCurrentNetwork && element) {
      initializeTurnstile();
    }
  },
  { immediate: true }
);

const changeNetwork = () => {
  if (!faucetNetwork.value) return;
  window.location.href = getNetworkUrl(faucetNetwork.value, route.fullPath);
};

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
  requestTestTokens(turnstileToken.value!)
    .then(() => {
      walletEraStore.requestBalance({ force: true });
      eraTransfersHistoryStore.reloadRecentTransfers();
    })
    .catch(() => undefined);
};
</script>

<style lang="scss" scoped></style>
