import { defineStore, storeToRefs } from "pinia";
import { Provider } from "zksync-web3";

import type { EraNetwork } from "@/store/network";
import type { ComputedRef } from "vue";

import { useNetworkStore } from "@/store/network";

export const useEraProviderStore = defineStore("eraProvider", () => {
  const { selectedNetwork, version } = storeToRefs(useNetworkStore());
  const eraNetwork = selectedNetwork as ComputedRef<EraNetwork>;
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
