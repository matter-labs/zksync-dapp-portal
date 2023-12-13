import liteTokenIcons from "@/assets/json/tokens/lite-tokens-icons.json";

import type { TokenPrice, ZkSyncLiteToken } from "@/types";
import type { ExtendedTokens, TokenInfo } from "zksync/build/types";

import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { checksumAddress } from "@/utils/formatters";

type TokenIcons = {
  thumb: string;
  small: string;
  large: string;
};

export const useLiteTokensStore = defineStore("liteTokens", () => {
  const liteProviderStore = useLiteProviderStore();

  const {
    result: tokensRaw,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    reset: resetTokens,
  } = usePromise<TokenInfo[]>(async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    // const tokens = await provider.getTokens(); <-- this is the right way but tokens are already available in the provider
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokens = provider.tokenSet.tokensBySymbol as ExtendedTokens;
    return Object.entries(tokens).map(([, token]) => ({ ...token, address: checksumAddress(token.address) }));
  });

  const tokenPrices = ref<{ [tokenSymbol: string]: TokenPrice }>({});
  const requestTokenPrice = async (tokenSymbol: string, { force } = { force: false }) => {
    if (!force && typeof tokenPrices.value[tokenSymbol] === "number") return;
    if (tokenPrices.value[tokenSymbol] === "loading") return;
    tokenPrices.value[tokenSymbol] = "loading";
    try {
      const provider = await liteProviderStore.requestProvider();
      if (!provider) throw new Error("Provider is not available");

      const price = await provider.getTokenPrice(tokenSymbol);
      tokenPrices.value[tokenSymbol] = typeof price === "number" ? price : 0;
    } catch (error) {
      console.warn(`Failed to get price for zkSync Lite token ${tokenSymbol}`, error);
      tokenPrices.value[tokenSymbol] = undefined;
    }
  };

  function getTokenIconUrlBySymbol(symbol: string, size: "thumb" | "small" | "large" = "small"): string | undefined {
    if (symbol in liteTokenIcons) {
      return (liteTokenIcons as Record<string, TokenIcons>)[symbol][size];
    }
    return undefined;
  }
  const tokens = computed<{ [tokenSymbol: string]: ZkSyncLiteToken } | undefined>(() => {
    if (!tokensRaw.value) return undefined;
    return Object.fromEntries(
      tokensRaw.value.map((token) => {
        const iconUrl = getTokenIconUrlBySymbol(token.symbol);
        return [
          token.symbol,
          {
            ...token,
            l1Address: token.address,
            price: tokenPrices.value[token.symbol],
            iconUrl,
          },
        ];
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
