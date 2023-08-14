import { defineStore, storeToRefs } from "pinia";

import type { Token, TokenPrice } from "@/types";

import { useEraProviderStore } from "@/store/zksync/era/provider";
import { ETH_L1_ADDRESS, ETH_L2_ADDRESS } from "@/utils/constants";

export const useEraTokensStore = defineStore("eraTokens", () => {
  const eraProviderStore = useEraProviderStore();
  const { eraNetwork } = storeToRefs(eraProviderStore);

  const {
    result: tokensRaw,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    reset: resetTokens,
  } = usePromise<Token[]>(async () => {
    return await eraNetwork.value.getTokens();
  });

  const tokenPrices = ref<{ [tokenAddress: string]: TokenPrice }>({});
  const requestTokenPrice = async (tokenAddress: string, { force } = { force: false }) => {
    if (!force && typeof tokenPrices.value[tokenAddress] === "number") return;
    if (tokenPrices.value[tokenAddress] === "loading") return;
    tokenPrices.value[tokenAddress] = "loading";
    try {
      const provider = eraProviderStore.requestProvider();

      const price = await provider
        .getTokenPrice(tokenAddress === ETH_L2_ADDRESS ? ETH_L1_ADDRESS : tokenAddress)
        .catch(() => 0);
      tokenPrices.value[tokenAddress] =
        typeof price === "number" || typeof price === "string" ? parseFloat(price.toString()) : 0;
    } catch (error) {
      console.warn(`Failed to get price for Era token ${tokenAddress}`, error);
      tokenPrices.value[tokenAddress] = undefined;
    }
  };

  const tokens = computed<{ [tokenAddress: string]: Token } | undefined>(() => {
    if (!tokensRaw.value) return undefined;
    return Object.fromEntries(
      tokensRaw.value.map((token) => {
        return [token.address, { ...token, price: tokenPrices.value[token.address] }];
      })
    );
  });

  return {
    tokens: computed(() => tokens.value),
    tokensRequestInProgress: computed(() => tokensRequestInProgress.value),
    tokensRequestError: computed(() => tokensRequestError.value),
    requestTokens,
    resetTokens,

    requestTokenPrice,
  };
});
