import { BigNumber } from "ethers";

import type { L1Network, L2Network } from "@/data/networks";
import type { Version } from "@/store/network";
import type { TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";

import { parseTokenAmount } from "@/utils/formatters";

export function generateAvatarColors(address: string) {
  const seedArr = address.match(/.{1,7}/g)?.splice(0, 5);
  const colors: string[] = [];

  seedArr?.forEach((seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const rgb = [0, 0, 0];
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
    }
    colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
  });
  return colors;
}

export function isOnlyZeroes(value: string) {
  return value.replace(/0/g, "").replace(/\./g, "").length === 0;
}

export function calculateFee(gasLimit: BigNumberish, gasPrice: BigNumberish) {
  return BigNumber.from(gasLimit).mul(gasPrice);
}

export const getNetworkUrl = (network: L2Network, routePath: string) => {
  const url = new URL(routePath, window.location.origin);
  url.searchParams.set("network", network.key);
  return url.toString();
};

export const isMobile = () => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
};

export const replaceVersionInString = (url: string, replacement: Version) => {
  const regex = new RegExp("\\bera\\b|\\blite\\b", "gi");
  return url.replace(regex, replacement);
};

export const calculateTotalTokensPrice = (tokens: TokenAmount[]) => {
  return tokens.reduce((acc, { amount, decimals, price }) => {
    if (typeof price !== "number") return acc;
    return acc + parseFloat(parseTokenAmount(amount, decimals)) * price;
  }, 0);
};

export const findNetworkWithSameL1 = (l1Network: L1Network, networks: L2Network[]) => {
  return networks.find((network) => l1Network.network === network.l1Network?.network);
};

interface RetryOptions {
  retries?: number;
}
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  retries: 2,
};
export async function retry<T>(func: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries } = Object.assign({}, DEFAULT_RETRY_OPTIONS, options);
  try {
    return await func();
  } catch (error) {
    if (retries && retries > 0) {
      return retry(func, { retries: retries - 1 });
    } else {
      throw error;
    }
  }
}
