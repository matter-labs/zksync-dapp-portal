<template>
  <div>
    <CommonContentBlock>
      <CommonTotalBalance :balance="balance" :loading="loading" :error="balanceError" />
      <CommonButtonGroup class="my-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite-receive' }">
          <template #icon>
            <ArrowDownIcon aria-hidden="true" />
          </template>
          <template #default>Receive</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite-swap' }">
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
              send-route-name="transaction-zksync-lite"
              v-bind="item"
            />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1">
              <div class="wrap-balance">
                You don't have any balances on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span>
              </div>
              <span class="mt-1.5 inline-block">
                Proceed to
                <NuxtLink class="link" :to="{ name: 'transaction-zksync-lite-receive' }">Add funds</NuxtLink> page to
                add balance to your account
              </span>
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>

    <transition v-bind="TransitionOpacity()">
      <TypographyCategoryLabel v-if="pendingDeposits.length">Pending deposits</TypographyCategoryLabel>
    </transition>
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonContentBlock v-if="pendingDeposits.length">
        <div class="-mx-2 -my-3">
          <TokenBalance v-for="item in pendingDeposits" as="div" :key="item.address" v-bind="item" />
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
import useSingleLoading from "@/composables/useSingleLoading";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

const onboardStore = useOnboardStore();
const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded, pendingDeposits } =
  storeToRefs(walletLiteStore);
const { destinations } = storeToRefs(useDestinationsStore());

const displayedBalances = computed(() => {
  return balance.value.filter(({ amount, decimals, price }) => {
    if (price === "loading") return false;

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

const fetch = () => {
  walletLiteStore.requestBalance();
};
fetch();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetch();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetSingleLoading();
  resetAutoUpdate();
  fetch();
});

onBeforeUnmount(() => {
  stopAutoUpdate();
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
