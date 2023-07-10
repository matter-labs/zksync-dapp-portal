import { defineStore, storeToRefs } from "pinia";
import { getDefaultRestProvider } from "zksync";

import type { RestProvider } from "zksync";

import { useNetworkStore } from "@/store/network";

export const useLiteProviderStore = defineStore("liteProvider", () => {
  const { selectedNetwork, version } = storeToRefs(useNetworkStore());

  const {
    inProgress: providerRequestInProgress,
    error: providerRequestError,
    execute: requestProvider,
  } = usePromise<RestProvider>(async () => {
    if (version.value !== "lite") throw new Error("Invalid network");
    return await getDefaultRestProvider(selectedNetwork.value.l1Network.network);
  });

  return {
    providerRequestInProgress: computed(() => providerRequestInProgress.value),
    providerRequestError: computed(() => providerRequestError.value),
    requestProvider,

    blockExplorerUrl: computed(() => selectedNetwork.value.blockExplorerUrl),
  };
});
