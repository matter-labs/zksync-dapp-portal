type CustomBridgeToken = {
  chainId: number;
  l1Address: string;
  l2Address: string;
  bridgeName: string;
  bridgeUrlDeposit: string;
  bridgeUrlWithdraw: string;
  symbol: string;
};

export const customBridgeTokens: CustomBridgeToken[] = [
  {
    chainId: 1,
    l1Address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    l2Address: "0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
    bridgeName: "txSync Bridge",
    bridgeUrlDeposit: "https://portal.txsync.io/bridge/?token=0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
    bridgeUrlWithdraw: "https://portal.txsync.io/bridge/withdraw/?token=0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
    symbol: "wstETH",
  },
];
