import { useStorage } from "@vueuse/core";

import { chainList, defaultNetwork } from "@/data/networks";

import type { L1Network, ZkSyncNetwork } from "@/data/networks";

export const useNetworkStore = defineStore("network", () => {
  const networkUsesLocalStorage = useStorage<boolean>("networkUsesLocalStorage", false);
  const selectedNetworkKey = useStorage<string>(
    "selectedNetwork",
    defaultNetwork.key,
    networkUsesLocalStorage.value ? window.localStorage : window.sessionStorage
  );
  const selectedNetwork = computed<ZkSyncNetwork>(() => {
    return chainList.find((e) => e.key === selectedNetworkKey.value) ?? defaultNetwork;
  });

  const l1Network = computed<L1Network | undefined>(() => selectedNetwork.value.l1Network);
  const l1BlockExplorerUrl = computed<string | undefined>(() => l1Network.value?.blockExplorers?.default.url);

  const networkChangedWarningDisabled = useStorage<boolean>("networkChangedWarningDisabled", false);
  const lastSelectedNetworkKey = useStorage<string | undefined>("lastSelectedNetworkKey", undefined);
  const lastSelectedNetwork = computed<ZkSyncNetwork | undefined>(() => {
    return chainList.find((network) => network.key === lastSelectedNetworkKey.value);
  });
  const networkChangedWarning = computed(
    () =>
      !networkChangedWarningDisabled.value &&
      typeof lastSelectedNetworkKey.value === "string" &&
      (lastSelectedNetworkKey.value as string) !== "undefined" &&
      lastSelectedNetwork.value?.key !== selectedNetwork.value.key
  );
  const resetNetworkChangeWarning = () => {
    lastSelectedNetworkKey.value = selectedNetwork.value.key;
  };
  watch(selectedNetworkKey, (val) => {
    lastSelectedNetworkKey.value = val;
  });
  watch([networkUsesLocalStorage, networkChangedWarningDisabled], () => {
    selectedNetworkKey.value = selectedNetwork.value.key;
  });

  const identifyNetworkByQueryParam = () => {
    const windowLocation = window.location;
    const networkFromQueryParam = new URLSearchParams(windowLocation.search).get("network");
    if (networkFromQueryParam && chainList.some((e) => e.key === networkFromQueryParam)) {
      selectedNetworkKey.value = networkFromQueryParam;
      resetNetworkChangeWarning();
    }
  };

  identifyNetworkByQueryParam(); // need to be done only on load once

  return {
    networkUsesLocalStorage,
    selectedNetworkKey,
    selectedNetwork,

    l1Network,
    l1BlockExplorerUrl,

    networkChangedWarningDisabled,
    networkChangedWarning,
    lastSelectedNetwork,
    resetNetworkChangeWarning,
  };
});
