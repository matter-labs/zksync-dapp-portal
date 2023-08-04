import { defineStore, storeToRefs } from "pinia";
import { getDefaultRestProvider } from "zksync";

import type { RestProvider } from "zksync";

import { type ZkSyncLiteNetwork, zkSyncLiteNetworks } from "@/data/networks";
import { useNetworkStore } from "@/store/network";

export const useLiteProviderStore = defineStore("liteProvider", () => {
  const { selectedNetwork, l1Network, version } = storeToRefs(useNetworkStore());
  const zkSyncLiteNetwork = computed<ZkSyncLiteNetwork>(() => {
    if (version.value === "lite") {
      return selectedNetwork.value as ZkSyncLiteNetwork;
    } else {
      return (
        (l1Network.value && (findNetworkWithSameL1(l1Network.value, zkSyncLiteNetworks) as ZkSyncLiteNetwork)) ||
        zkSyncLiteNetworks[0]
      );
    }
  });

  const {
    inProgress: providerRequestInProgress,
    error: providerRequestError,
    execute: requestProvider,
  } = usePromise<RestProvider>(async () => {
    return await getDefaultRestProvider(zkSyncLiteNetwork.value.network);
  });

  return {
    zkSyncLiteNetwork,
    providerRequestInProgress: computed(() => providerRequestInProgress.value),
    providerRequestError: computed(() => providerRequestError.value),
    requestProvider,

    blockExplorerUrl: computed(() => zkSyncLiteNetwork.value.blockExplorerUrl),
  };
});
