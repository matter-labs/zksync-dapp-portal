import { defineStore, storeToRefs } from "pinia";
import { Provider } from "zksync-web3";

import type { EthereumNetworkName } from "@/store/network";

import { useNetworkStore } from "@/store/network";

const eraNetworks: Record<
  EthereumNetworkName,
  { id: 324 | 280; name: string; rpcUrl: string; blockExplorerApi: string }
> = {
  mainnet: {
    id: 324,
    name: "zkSync Era Mainnet",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerApi: "https://block-explorer-api.mainnet.zksync.io",
  },
  goerli: {
    id: 280,
    name: "zkSync Era Testnet",
    rpcUrl: "https://testnet.era.zksync.dev",
    blockExplorerApi: "https://block-explorer-api.testnets.zksync.dev",
  },
} as const;

export const useEraProviderStore = defineStore("eraProvider", () => {
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
  const eraNetwork = computed(() => eraNetworks[selectedEthereumNetwork.value.network]);
  const provider = new Provider(eraNetwork.value.rpcUrl);

  const requestProvider = () => provider;

  const blockExplorerUrl = computed(() => {
    if (selectedEthereumNetwork.value.network === "mainnet") {
      return "https://explorer.zksync.io";
    }
    return `https://${selectedEthereumNetwork.value.network}.explorer.zksync.io`;
  });

  return {
    eraNetwork,

    requestProvider,

    blockExplorerUrl,
  };
});
