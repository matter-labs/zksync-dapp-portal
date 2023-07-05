import { defineStore, storeToRefs } from "pinia";
import { Provider } from "zksync-web3";

import type { EthereumNetworkName } from "@/store/network";

import { useNetworkStore } from "@/store/network";

const eraNetworks: Record<
  EthereumNetworkName & "stage",
  {
    id: 324 | 280 | 270;
    name: string;
    rpcUrl: string;
    blockExplorerUrl: string;
    blockExplorerApi: string;
    faucetUrl?: string;
  }
> = {
  mainnet: {
    id: 324,
    name: "zkSync Era Mainnet",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.mainnet.zksync.io",
  },
  goerli: {
    id: 280,
    name: "zkSync Era Testnet",
    rpcUrl: "https://testnet.era.zksync.dev",
    blockExplorerUrl: "https://goerli.explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.testnets.zksync.dev",
    faucetUrl: "https://testnet2-faucet.zksync.dev",
  },
  stage: {
    id: 270,
    name: "zkSync Era Stage",
    rpcUrl: "https://z2-dev-api.zksync.dev",
    blockExplorerUrl: "https://goerli.explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.testnets.zksync.dev",
    faucetUrl: "https://stage2-faucet.zksync.dev",
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
