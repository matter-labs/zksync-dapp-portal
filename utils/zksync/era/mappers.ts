import type { Api, Token } from "@/types";

import { ETH_TOKEN } from "@/utils/constants";

export const mapApiToken = (token: Api.Response.Token): Token => {
  if (token.l2Address === ETH_TOKEN.address) {
    return {
      ...ETH_TOKEN,
      price: token.usdPrice || undefined,
    };
  }

  return {
    l1Address: token.l1Address || undefined,
    address: token.l2Address,
    symbol: token.symbol || "unknown",
    name: token.name || "unknown",
    decimals: token.decimals,
    iconUrl: token.iconURL || undefined,
    enabledForFees: token.l2Address === ETH_TOKEN.address,
    price: token.usdPrice || undefined,
  };
};

export type NetworkLayer = "L1" | "L2";
export function mapApiTransfer(transfer: Api.Response.Transfer) {
  const token = transfer.token ? mapApiToken(transfer.token) : undefined;
  return {
    transactionHash: transfer.transactionHash,
    type: transfer.type,
    from: transfer.from,
    to: transfer.to,
    fromNetwork: transfer.type === "deposit" ? "L1" : ("L2" as NetworkLayer),
    toNetwork: transfer.type === "withdrawal" ? "L1" : ("L2" as NetworkLayer),
    amount: transfer.amount,
    token,
    timestamp: transfer.timestamp,
  };
}
export type EraTransfer = ReturnType<typeof mapApiTransfer>;
