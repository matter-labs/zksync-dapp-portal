import { $fetch } from "ofetch";

import type { Api } from "@/types";
import type { Token } from "@/types";

import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { mapApiToken } from "@/utils/mappers";

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
      const response: Api.Response.Collection<Api.Response.Token> = await $fetch(
        `${eraNetwork.value.blockExplorerApi}/tokens?limit=100`
      );
      const explorerTokens = response.items.map(mapApiToken);
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
