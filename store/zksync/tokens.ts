import { $fetch } from "ofetch";

import type { Api, Token } from "@/types";

export const useZkSyncTokensStore = defineStore("zkSyncTokens", () => {
  const providerStore = useZkSyncProviderStore();
  const { eraNetwork } = storeToRefs(providerStore);

  const {
    result: tokensRaw,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    reset: resetTokens,
  } = usePromise<Token[]>(async () => {
    if (eraNetwork.value.blockExplorerApi) {
      const responses: Api.Response.Collection<Api.Response.Token>[] = await Promise.all([
        $fetch(`${eraNetwork.value.blockExplorerApi}/tokens?minLiquidity=0&limit=100&page=1`),
        $fetch(`${eraNetwork.value.blockExplorerApi}/tokens?minLiquidity=0&limit=100&page=2`),
        $fetch(`${eraNetwork.value.blockExplorerApi}/tokens?minLiquidity=0&limit=100&page=3`),
      ]);
      const explorerTokens = responses.map((response) => response.items.map(mapApiToken)).flat();
      const etherExplorerToken = explorerTokens.find((token) => token.address === ETH_TOKEN.address);
      const tokensWithoutEther = explorerTokens.filter((token) => token.address !== ETH_TOKEN.address);
      return [etherExplorerToken || ETH_TOKEN, ...tokensWithoutEther] as Token[];
    }
    if (eraNetwork.value.getTokens) {
      return await eraNetwork.value.getTokens();
    } else {
      return [ETH_TOKEN];
    }
  });

  const tokens = computed<{ [tokenAddress: string]: Token } | undefined>(() => {
    if (!tokensRaw.value) return undefined;
    return Object.fromEntries(tokensRaw.value.map((token) => [token.address, token]));
  });
  const l1Tokens = computed<{ [tokenAddress: string]: Token } | undefined>(() => {
    if (!tokensRaw.value) return undefined;
    return Object.fromEntries(
      tokensRaw.value
        .filter((e) => e.l1Address)
        .map((token) => [token.l1Address!, { ...token, l1Address: undefined, address: token.l1Address! }])
    );
  });

  return {
    l1Tokens,
    tokens,
    tokensRequestInProgress: computed(() => tokensRequestInProgress.value),
    tokensRequestError: computed(() => tokensRequestError.value),
    requestTokens,
    resetTokens,
  };
});
