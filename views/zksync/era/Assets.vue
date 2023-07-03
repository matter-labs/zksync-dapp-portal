<template>
  <div>
    <CommonContentBlock>
      <CommonTotalBalance :balance="balance" :loading="loading" :error="balanceError" />
      <CommonButtonGroup class="my-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era-receive' }">
          <template #icon>
            <ArrowDownIcon aria-hidden="true" />
          </template>
          <template #default>Receive</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era-swap' }">
          <template #icon>
            <ArrowsRightLeftIcon aria-hidden="true" />
          </template>
          <template #default>Swap</template>
        </CommonButton>
      </CommonButtonGroup>

      <!-- Tokens container -->
      <div>
        <div class="flex items-center justify-between py-4">
          <TypographyCategoryLabel as="h2" :padded="false">Balances</TypographyCategoryLabel>
          <CommonLabelButton as="RouterLink" :to="{ name: 'balances' }">View all</CommonLabelButton>
        </div>
        <div class="-mx-2 -mt-1 -mb-2">
          <template v-if="loading">
            <TokenBalanceLoader v-for="index in 2" :key="index" send-route-name />
          </template>
          <div v-else-if="balanceError" class="m-3 mb-2.5 -mt-1">
            <CommonErrorBlock @try-again="fetch">
              {{ balanceError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="displayedBalances.length">
            <TokenBalance
              v-for="item in displayedBalances"
              as="div"
              :key="item.address"
              send-route-name="transaction-zksync-era"
              v-bind="item"
            />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1" data-testid="no-balances-warning">
              <div class="wrap-balance">
                You don't have any balances on
                <span class="font-medium">{{ destinations.era.label }}</span>
              </div>
              <span class="mt-1.5 inline-block">
                Proceed to
                <NuxtLink class="link" :to="{ name: 'transaction-zksync-era-receive' }">Add funds</NuxtLink> page to add
                balance to your account
              </span>
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>

    <transition v-bind="TransitionAlertScaleInOutTransition">
      <div v-if="isFaucetDisplayed">
        <DestinationItem
          as="div"
          :icon-url="destinations.era.iconUrl"
          :label="selectedEthereumNetwork.network === 'mainnet' ? 'New to zkSync Era?' : 'Not enough tokens?'"
          :description="
            selectedEthereumNetwork.network === 'mainnet'
              ? 'Explore with free test tokens'
              : 'Use official zkSync Era faucet'
          "
          class="mt-3"
        >
          <template #right>
            <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era-faucet' }">
              Get free test tokens
            </CommonButton>
          </template>
        </DestinationItem>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import { ArrowDownIcon, ArrowsRightLeftIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useInterval from "@/composables/useInterval";
import useSingleLoading from "@/composables/useSingleLoading";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { calculateTotalTokensPrice, isOnlyZeroes } from "@/utils/helpers";
import { TransitionAlertScaleInOutTransition } from "@/utils/transitions";

const onboardStore = useOnboardStore();
const walletEraStore = useEraWalletStore();
const eraTransfersHistoryStore = useEraTransfersHistoryStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletEraStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const { transfers, recentTransfersRequestInProgress, recentTransfersRequestError } =
  storeToRefs(eraTransfersHistoryStore);

const displayedBalances = computed(() => {
  return balance.value.filter(({ amount, decimals, price }) => {
    const decimalAmount =
      typeof price === "number" ? removeSmallAmount(amount, decimals, price) : parseTokenAmount(amount, decimals);
    if (!isOnlyZeroes(decimalAmount)) {
      return true;
    }
    return false;
  });
});

const { loading, reset: resetSingleLoading } = useSingleLoading(
  computed(() => balanceInProgress.value || !allBalancePricesLoaded.value)
);
const { loading: transactionsLoading, reset: resetTransactionsSingleLoading } = useSingleLoading(
  computed(() => recentTransfersRequestInProgress.value)
);
const isFaucetDisplayed = computed(() => {
  if (loading.value || transactionsLoading.value) return false;
  if (selectedEthereumNetwork.value.network === "mainnet") {
    if (recentTransfersRequestError.value || transfers.value.length > 3) {
      return false;
    }
    return true;
  }
  return calculateTotalTokensPrice(balance.value) < 50;
});

const fetch = () => {
  walletEraStore.requestBalance();
  eraTransfersHistoryStore.requestRecentTransfers();
};
fetch();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetch();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetSingleLoading();
  resetTransactionsSingleLoading();
  resetAutoUpdate();
  fetch();
});

onBeforeUnmount(() => {
  stopAutoUpdate();
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
