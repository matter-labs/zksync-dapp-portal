import { BigNumber } from "ethers";
import { defineStore, storeToRefs } from "pinia";

import type { TokenAmount } from "@/types";

import { useEthereumBalanceStore } from "@/store/ethereumBalance";
import { useOnboardStore } from "@/store/onboard";
import { useEraTokensStore } from "@/store/zksync/era/tokens";

export const useEraEthereumBalanceStore = defineStore("eraEthereumBalances", () => {
  const onboardStore = useOnboardStore();
  const ethereumBalancesStore = useEthereumBalanceStore();
  const eraTokensStore = useEraTokensStore();
  const { balance: ethereumBalance } = storeToRefs(ethereumBalancesStore);
  const { tokens } = storeToRefs(eraTokensStore);

  const {
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise(
    async () => {
      await Promise.all([ethereumBalancesStore.requestBalance(), eraTokensStore.requestTokens()]);

      if (!tokens.value) throw new Error("Tokens are not available");
      if (!ethereumBalance.value) throw new Error("Ethereum balances are not available");
    },
    { cache: 30000 }
  );
  const balance = computed<TokenAmount[]>(() => {
    if (!tokens.value || !ethereumBalance.value) {
      return [];
    }
    return Object.values(tokens.value).map((token) => ({
      ...token,
      amount:
        ethereumBalance.value!.find((balance) => balance.contractAddress === token.l1Address)?.tokenBalance ?? "0",
    }));
  });
  watch(
    balance,
    (balances) => {
      balances.map(({ address, amount }) => {
        if (BigNumber.from(amount).isZero()) return;
        eraTokensStore.requestTokenPrice(address);
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

    deductBalance: ethereumBalancesStore.deductBalance,
  };
});
