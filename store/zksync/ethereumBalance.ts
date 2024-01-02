import { fetchBalance } from "@wagmi/core";

import type { Hash, TokenAmount } from "@/types";

import { l1Networks } from "@/data/networks";
import { useEthereumBalanceStore } from "@/store/ethereumBalance";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useZkSyncTokensStore } from "@/store/zksync/tokens";

export const useZkSyncEthereumBalanceStore = defineStore("zkSyncEthereumBalances", () => {
  const runtimeConfig = useRuntimeConfig();
  const onboardStore = useOnboardStore();
  const ethereumBalancesStore = useEthereumBalanceStore();
  const tokensStore = useZkSyncTokensStore();
  const { l1Network, selectedNetwork } = storeToRefs(useNetworkStore());
  const { account } = storeToRefs(onboardStore);
  const { balance: ethereumBalance } = storeToRefs(ethereumBalancesStore);
  const { l1Tokens } = storeToRefs(tokensStore);

  const getBalancesFromApi = async (): Promise<TokenAmount[]> => {
    await Promise.all([ethereumBalancesStore.requestBalance(), tokensStore.requestTokens()]);

    if (!ethereumBalance.value) throw new Error("Ethereum balances are not available");

    // Get balances from Ankr API and merge them with tokens data from explorer
    return [
      ...ethereumBalance.value.map((e) => {
        const tokenFromExplorer = l1Tokens.value?.[e.address];
        return {
          ...e,
          symbol: tokenFromExplorer?.symbol ?? e.symbol,
          name: tokenFromExplorer?.name ?? e.name,
          iconUrl: tokenFromExplorer?.iconUrl ?? e.iconUrl,
          price: tokenFromExplorer?.price ?? e.price,
        };
      }),
      ...Object.values(l1Tokens.value ?? []) // Add tokens that are not in Ankr API
        .filter((token) => !ethereumBalance.value?.find((e) => e.address === token.address))
        .map((e) => ({
          ...e,
          amount: "0",
        })),
    ];
  };
  const getBalancesFromRPC = async (): Promise<TokenAmount[]> => {
    await tokensStore.requestTokens();
    if (!l1Tokens.value) throw new Error("Tokens are not available");
    if (!account.value.address) throw new Error("Account is not available");

    return await Promise.all(
      Object.values(l1Tokens.value ?? []).map(async (token) => {
        const amount = await fetchBalance({
          address: account.value.address!,
          chainId: l1Network.value!.id,
          token: token.address === ETH_TOKEN.l1Address ? undefined : (token.address! as Hash),
        });
        return {
          ...token,
          amount: amount.value.toString(),
        };
      })
    );
  };
  const {
    result: balance,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<TokenAmount[]>(
    async () => {
      if (!l1Network.value) throw new Error(`L1 network is not available on ${selectedNetwork.value.name}`);

      if (
        ([l1Networks.mainnet.id, l1Networks.goerli.id] as number[]).includes(l1Network.value?.id) &&
        runtimeConfig.public.ankrToken
      ) {
        return getBalancesFromApi();
      } else {
        return getBalancesFromRPC();
      }
    },
    { cache: 30000 }
  );

  onboardStore.subscribeOnAccountChange(() => {
    resetBalance();
  });

  return {
    balance,
    balanceInProgress,
    balanceError,
    requestBalance,

    deductBalance: ethereumBalancesStore.deductBalance,
  };
});
