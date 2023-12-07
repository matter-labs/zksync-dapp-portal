import { L2_ETH_TOKEN_ADDRESS } from "zksync-web3/build/src/utils";

import { checksumAddress } from "./formatters";

import type { Token } from "@/types";

export const ETH_L1_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ETH_L2_ADDRESS = checksumAddress(L2_ETH_TOKEN_ADDRESS);

export const ETH_TOKEN: Token = {
  address: ETH_L2_ADDRESS,
  l1Address: ETH_L1_ADDRESS,
  symbol: "ETH",
  decimals: 18,
  iconUrl: "/img/eth.svg",
  enabledForFees: true,
};
