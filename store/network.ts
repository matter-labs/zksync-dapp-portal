import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";

import type { L1Network, L2Network } from "@/data/networks";

import { useRoute } from "#app";
import { eraNetworks, zkSyncLiteNetworks } from "@/data/networks";

export type Version = "era" | "lite";
const l2Networks = [...eraNetworks, ...zkSyncLiteNetworks];
const defaultNetwork = l2Networks[0];

export const useNetworkStore = defineStore("network", () => {
  const route = useRoute();

  const networkUsesLocalStorage = useStorage<boolean>("networkUsesLocalStorage", false);
  const selectedNetworkKey = useStorage<string>(
    "selectedNetwork",
    defaultNetwork.key,
    networkUsesLocalStorage.value ? window.localStorage : window.sessionStorage
  );
  const selectedNetwork = computed<L2Network>(() => {
    return l2Networks.find((e) => e.key === selectedNetworkKey.value) ?? defaultNetwork;
  });

  const version = computed<Version>(() => getVersionByNetwork(selectedNetwork.value));
  const l1Network = computed<L1Network | undefined>(() => selectedNetwork.value.l1Network);
  const l1BlockExplorerUrl = computed<string | undefined>(() => l1Network.value?.blockExplorers?.default.url);

  const networkChangedWarningDisabled = useStorage<boolean>("networkChangedWarningDisabled", false);
  const lastSelectedNetworkKey = useStorage<string | undefined>("lastSelectedNetworkKey", undefined);
  const lastSelectedNetwork = computed<L2Network | undefined>(() => {
    return l2Networks.find((network) => network.key === lastSelectedNetworkKey.value);
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
    if (networkFromQueryParam && l2Networks.some((e) => e.key === networkFromQueryParam)) {
      selectedNetworkKey.value = networkFromQueryParam;
      resetNetworkChangeWarning();
    }
  };
  const identifyNetworkByRoute = (routeName: string) => {
    const getVersionFromRouteName = (): Version | undefined => {
      if (/(-lite-|.*-lite$)/.test(routeName)) {
        return "lite";
      } else if (/(-era-|.*-era$)/.test(routeName)) {
        return "era";
      }
    };
    const versionFromRoute = getVersionFromRouteName();
    if (!versionFromRoute || versionFromRoute === version.value) return;

    const networkWithSameL1 = l2Networks.find(
      (network) =>
        network.l1Network &&
        getVersionByNetwork(network) === versionFromRoute &&
        l1Network.value?.network === network.l1Network.network
    );
    if (networkWithSameL1) {
      selectedNetworkKey.value = networkWithSameL1.key;
    } else {
      const anyNetworkWithSameVersion = l2Networks.find(
        (network) => getVersionByNetwork(network) === versionFromRoute
      )!;
      window.location.href = getNetworkUrl(anyNetworkWithSameVersion, route.fullPath);
    }
  };

  identifyNetworkByQueryParam(); // need to be done only on load once
  watch(
    () => route.name,
    (routeName) => {
      if (!routeName) return;
      identifyNetworkByRoute(routeName.toString());
    },
    { immediate: true }
  );

  return {
    networkUsesLocalStorage,
    selectedNetworkKey,
    selectedNetwork,

    version,
    l1Network,
    l1BlockExplorerUrl,

    networkChangedWarningDisabled,
    networkChangedWarning,
    lastSelectedNetwork,
    resetNetworkChangeWarning,
  };
});
