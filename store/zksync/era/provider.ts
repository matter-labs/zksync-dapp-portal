import { defineStore, storeToRefs } from "pinia";
import { Provider } from "zksync-web3";

import useNetworks from "@/composables/useNetworks";

import type { EraNetwork } from "@/data/networks";

import { useNetworkStore } from "@/store/network";

export const useEraProviderStore = defineStore("eraProvider", () => {
  const { eraNetworks } = useNetworks();
  const { selectedNetwork, l1Network, version } = storeToRefs(useNetworkStore());
  const eraNetwork = computed(() => {
    if (version.value === "era") {
      return selectedNetwork.value as EraNetwork;
    } else {
      return (l1Network.value && (findNetworkWithSameL1(l1Network.value, eraNetworks) as EraNetwork)) || eraNetworks[0];
    }
  });
  let provider: Provider | undefined;

  const requestProvider = () => {
    if (version.value !== "era") throw new Error("Invalid network");
    if (!provider) {
      provider = new Provider(eraNetwork.value.rpcUrl);
    }
    return provider;
  };

  return {
    eraNetwork,

    requestProvider,

    blockExplorerUrl: computed(() => eraNetwork.value.blockExplorerUrl),
  };
});
