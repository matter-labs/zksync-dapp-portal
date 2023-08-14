import type { Api, Token } from "@/types";

import { ETH_L2_ADDRESS } from "@/utils/constants";

const mapApiToken = (token: Api.Response.Token): Token => {
  return {
    l1Address: token.l1Address || undefined,
    address: token.l2Address,
    symbol: token.symbol || "unknown",
    decimals: token.decimals,
    iconUrl: undefined,
    enabledForFees: token.l2Address === ETH_L2_ADDRESS,
    price: undefined,
  };
};

export function mapApiTransfer(transfer: Api.Response.Transfer) {
  const token = transfer.token ? mapApiToken(transfer.token) : undefined;
  return {
    transactionHash: transfer.transactionHash,
    type: transfer.type,
    from: transfer.from,
    to: transfer.to,
    fromNetwork: transfer.type === "deposit" ? "L1" : "L2",
    toNetwork: transfer.type === "withdrawal" ? "L1" : "L2",
    amount: transfer.amount,
    token,
    timestamp: transfer.timestamp,
  };
}
export type EraTransfer = ReturnType<typeof mapApiTransfer>;
