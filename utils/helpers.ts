import type { ZkSyncNetwork } from "@/data/networks";
import type { TokenAmount } from "@/types";

export function isOnlyZeroes(value: string) {
  return value.replace(/0/g, "").replace(/\./g, "").length === 0;
}

export function calculateFee(gasLimit: bigint, gasPrice: bigint) {
  return gasLimit * gasPrice;
}

export const getNetworkUrl = (network: ZkSyncNetwork, routePath: string) => {
  const url = new URL(routePath, window.location.origin);
  url.searchParams.set("network", network.key);
  return url.toString();
};

export const isMobile = () => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
};

export const calculateTotalTokensPrice = (tokens: TokenAmount[]) => {
  return tokens.reduce((acc, { amount, decimals, price }) => {
    if (typeof price !== "number") return acc;
    return acc + parseFloat(parseTokenAmount(amount, decimals)) * price;
  }, 0);
};

// Changes URL without changing actual router view
export const silentRouterChange = (location: string, mode: "push" | "replace" = "push") => {
  window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", location);
};

interface RetryOptions {
  retries?: number;
  delay?: number;
}
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  retries: 2,
  delay: 0,
};
export async function retry<T>(func: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries, delay } = Object.assign({}, DEFAULT_RETRY_OPTIONS, options);
  try {
    return await func();
  } catch (error) {
    if (retries && retries > 0) {
      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return retry(func, { retries: retries - 1, delay });
    } else {
      throw error;
    }
  }
}
