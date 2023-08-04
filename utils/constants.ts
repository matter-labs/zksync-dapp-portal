import { L2_ETH_TOKEN_ADDRESS } from "zksync-web3/build/src/utils";

import { checksumAddress } from "./formatters";

export const ETH_L1_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ETH_L2_ADDRESS = checksumAddress(L2_ETH_TOKEN_ADDRESS);
