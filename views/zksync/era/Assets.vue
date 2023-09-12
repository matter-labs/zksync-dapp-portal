<template>
  <div>
    <CommonContentBlock>
      <CommonTotalBalance :balance="balance" :loading="loading" :error="balanceError" />
      <CommonButtonGroup class="my-4">
        <CommonButton
          as="RouterLink"
          :to="{
            name: eraNetwork.l1Network ? 'transaction-zksync-era-receive' : 'transaction-zksync-era-receive-address',
          }"
        >
          <template #icon>
            <ArrowDownIcon aria-hidden="true" />
          </template>
          <template #default>Receive</template>
        </CommonButton>
        <CommonButton
          as="RouterLink"
          :to="{ name: eraNetwork.l1Network ? 'transaction-zksync-era' : 'transaction-zksync-era-send' }"
        >
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton
          v-if="eraNetwork.displaySettings?.showPartnerLinks"
          as="RouterLink"
          :to="{ name: 'transaction-zksync-era-swap' }"
        >
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
        <div class="-mx-2 -mb-2 -mt-1">
          <template v-if="loading">
            <TokenBalanceLoader v-for="index in 2" :key="index" send-route-name />
          </template>
          <div v-else-if="balanceError" class="m-3 -mt-1 mb-2.5">
            <CommonErrorBlock @try-again="fetch">
              {{ balanceError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="displayedBalances.length">
            <TokenBalance
              v-for="item in displayedBalances"
              as="div"
              :key="item.address"
              :send-route-name="eraNetwork.l1Network ? 'transaction-zksync-era' : 'transaction-zksync-era-send'"
              v-bind="item"
            />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1" data-testid="no-balances-warning">
              <div class="wrap-balance">
                You don't have any balances on
                <span class="font-medium" data-testid="no-balances-warning">{{ destinations.era.label }}</span>
              </div>
              <span v-if="eraNetwork.l1Network" class="mt-1.5 inline-block">
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
      <CommonContentBlock v-if="isFaucetDisplayed" class="faucet-notification">
        <div class="-m-3">
          <DestinationItem
            as="div"
            :icon-url="destinations.era.iconUrl"
            label="Not enough tokens?"
            description="Use official zkSync Era faucet"
          >
            <template #right>
              <CommonButton
                as="RouterLink"
                :to="{ name: 'transaction-zksync-era-faucet' }"
                class="destination-item-button"
              >
                Get free test tokens
              </CommonButton>
            </template>
          </DestinationItem>
          <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-era-faucet' }" class="outside-button">
            Get free test tokens
          </CommonButton>
        </div>
      </CommonContentBlock>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import { ArrowDownIcon, ArrowsRightLeftIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useInterval from "@/composables/useInterval";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraWalletStore } from "@/store/zksync/era/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { calculateTotalTokensPrice, isOnlyZeroes } from "@/utils/helpers";
import { TransitionAlertScaleInOutTransition } from "@/utils/transitions";

const onboardStore = useOnboardStore();
const walletEraStore = useEraWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletEraStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());

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

const loading = computed(() => balanceInProgress.value || !allBalancePricesLoaded.value);
const isFaucetDisplayed = computed(() => {
  if (loading.value) return false;
  if (eraNetwork.value.faucetUrl) {
    return calculateTotalTokensPrice(balance.value) < 50;
  }
  return false;
});

const fetch = () => {
  walletEraStore.requestBalance();
};
fetch();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetch();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetAutoUpdate();
  fetch();
});

onBeforeUnmount(() => {
  stopAutoUpdate();
  unsubscribe();
});
</script>

<style lang="scss" scoped>
.faucet-notification {
  @apply mt-3;

  .destination-item-button {
    @apply -my-1 max-xs:hidden;
  }
  .outside-button {
    @apply w-full xs:hidden;
  }
}
</style>
