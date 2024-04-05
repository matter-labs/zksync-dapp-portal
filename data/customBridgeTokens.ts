type CustomBridgeToken = {
  chainId: number;
  l1Address: string;
  l2Address: string;
  bridgeName: string;
  bridgeUrlDeposit: string;
  bridgeUrlWithdraw: string;
  symbol: string;
};

export const customBridgeTokens: CustomBridgeToken[] = [];
