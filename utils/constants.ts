import type { Token } from "@/types";

export const ETH_TOKEN: Token = {
  address: "0x000000000000000000000000000000000000800A",
  l1Address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  iconUrl: "/img/eth.svg",
};

export const WST_ETH_TOKEN: Token = {
  address: "0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
  l1Address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
  symbol: "wstETH",
  name: "Wrapped liquid staked Ether 2.0",
  decimals: 18,
  iconUrl: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png",
};

// External non-native bridge addresses:
export const EXTERNAL_BRIDGES = {
  [WST_ETH_TOKEN.l1Address!]: "0x41527B2d03844dB6b0945f25702cB958b6d55989",
  [WST_ETH_TOKEN.address]: "0xE1D6A50E7101c8f8db77352897Ee3f1AC53f782B",
};
