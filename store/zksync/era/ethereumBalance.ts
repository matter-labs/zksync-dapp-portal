import { fetchBalance } from "@wagmi/core";
import { BigNumber } from "ethers";
import { defineStore, storeToRefs } from "pinia";

import type { Hash, TokenAmount } from "@/types";

import { useEthereumBalanceStore } from "@/store/ethereumBalance";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraTokensStore } from "@/store/zksync/era/tokens";

export const useEraEthereumBalanceStore = defineStore("eraEthereumBalances", () => {
  const runtimeConfig = useRuntimeConfig();
  const onboardStore = useOnboardStore();
  const ethereumBalancesStore = useEthereumBalanceStore();
  const eraTokensStore = useEraTokensStore();
  const { l1Network, selectedNetwork } = storeToRefs(useNetworkStore());
  const { account } = storeToRefs(onboardStore);
  const { balance: ethereumBalance } = storeToRefs(ethereumBalancesStore);
  const { tokens } = storeToRefs(eraTokensStore);

  const getBalancesFromApi = async () => {
    await Promise.all([ethereumBalancesStore.requestBalance(), eraTokensStore.requestTokens()]);

    if (!tokens.value) throw new Error("Tokens are not available");
    if (!ethereumBalance.value) throw new Error("Ethereum balances are not available");

    return Object.fromEntries(ethereumBalance.value.map((token) => [token.address, token.amount]));
  };
  const getBalancesFromRPC = async () => {
    await eraTokensStore.requestTokens();
    if (!tokens.value) throw new Error("Tokens are not available");
    if (!account.value.address) throw new Error("Account is not available");

    const balances = await Promise.all(
      Object.entries(tokens.value)
        .filter(([, token]) => token.l1Address)
        .map(async ([, token]) => {
          const amount = await fetchBalance({
            address: account.value.address!,
            chainId: l1Network.value!.id,
            token: token.l1Address === ETH_L1_ADDRESS ? undefined : (token.l1Address! as Hash),
          });
          if (amount.value) {
            eraTokensStore.requestTokenPrice(token.address);
          }
          return {
            address: token.l1Address!,
            amount: amount.value.toString(),
          };
        })
    );

    return balances.reduce((accumulator: { [tokenL1Address: string]: string }, { address, amount }) => {
      accumulator[address] = amount;
      return accumulator;
    }, {});
  };
  const {
    result: balancesResult,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<{ [tokenL1Address: string]: string }>(
    async () => {
      if (!l1Network.value) throw new Error(`L1 network is not available on ${selectedNetwork.value.name}`);

      if (["mainnet", "goerli"].includes(l1Network.value?.network) && runtimeConfig.public.ankrToken) {
        return getBalancesFromApi();
      } else {
        return getBalancesFromRPC();
      }
    },
    { cache: 30000 }
  );
  const balance = computed<TokenAmount[]>(() => {
    if (!balancesResult.value) return [];
    return Object.entries(tokens.value ?? {}).map(([, token]) => {
      const amount = (token.l1Address && balancesResult.value![token.l1Address]) ?? "0";
      return { ...token, amount };
    });
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
