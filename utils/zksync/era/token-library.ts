import { getTokenCollection } from "@matterlabs/token-library";

export const getTokensByNetworkId = async (networkId: number) => {
  if (![270, 324, 280].includes(networkId)) throw new Error(`Network id ${networkId} is not supported`);

  const tokens = await getTokenCollection(networkId as 270 | 324 | 280);
  return tokens.map((token) => {
    const l2Address = token.l2Address === ETH_L1_ADDRESS ? ETH_L2_ADDRESS : checksumAddress(token.l2Address);
    return {
      l1Address: checksumAddress(token.l1Address),
      address: l2Address,
      symbol: token.symbol,
      decimals: token.decimals,
      iconUrl: token.imageUrl,
      enabledForFees: l2Address === ETH_L2_ADDRESS,
      price: undefined,
    };
  });
};
