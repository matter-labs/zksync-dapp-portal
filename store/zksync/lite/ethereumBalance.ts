import { BigNumber } from "ethers";
import { defineStore, storeToRefs } from "pinia";

import type { ZkSyncLiteTokenAmount } from "@/types";

import { useEthereumBalanceStore } from "@/store/ethereumBalance";
import { useOnboardStore } from "@/store/onboard";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";

export const useLiteEthereumBalanceStore = defineStore("liteEthereumBalances", () => {
  const onboardStore = useOnboardStore();
  const ethereumBalancesStore = useEthereumBalanceStore();
  const liteTokensStore = useLiteTokensStore();
  const { balance: ethereumBalance } = storeToRefs(ethereumBalancesStore);
  const { tokens } = storeToRefs(liteTokensStore);

  const {
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise(
    async () => {
      await Promise.all([ethereumBalancesStore.requestBalance(), liteTokensStore.requestTokens()]);

      if (!tokens.value) throw new Error("Tokens are not available");
      if (!ethereumBalance.value) throw new Error("Ethereum balances are not available");
    },
    { cache: 30000 }
  );
  const balance = computed<ZkSyncLiteTokenAmount[]>(() => {
    if (!tokens.value || !ethereumBalance.value) {
      return [];
    }
    return Object.values(tokens.value).map((token) => ({
      ...token,
      amount: ethereumBalance.value!.find((balance) => balance.address === token.address)?.amount ?? "0",
    }));
  });
  watch(
    balance,
    (balances) => {
      balances.map(({ symbol, amount }) => {
        if (BigNumber.from(amount).isZero()) return;
        liteTokensStore.requestTokenPrice(symbol);
      });
    },
    { immediate: true }
  );
  const allBalancePricesLoaded = computed(() => !balance.value.some((e) => e.price === "loading"));

  onboardStore.subscribeOnAccountChange(() => {
    resetBalance();
  });

  return {
    balance,
    balanceInProgress,
    balanceError,
    allBalancePricesLoaded,
    requestBalance,
  };
});
