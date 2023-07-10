import { useStorage } from "@vueuse/core";
import { goerli, mainnet, sepolia } from "@wagmi/core/chains";
import { defineStore } from "pinia";

import { useRoute } from "#app";

export type Version = "era" | "lite";
export type L2Network = {
  key: string;
  name: string;
  shortName: string;
  l1Network: L1Network;
  blockExplorerUrl: string;
  visible: boolean;
};
export const l1Networks = {
  mainnet: {
    ...mainnet,
    name: "Mainnet",
    network: "mainnet",
  },
  goerli: {
    ...goerli,
    name: "Goerli Testnet",
  },
  sepolia: {
    ...sepolia,
    name: "Sepolia Testnet",
  },
} as const;
export type L1Network = (typeof l1Networks)[keyof typeof l1Networks];

export type EraNetwork = L2Network & {
  id: 324 | 280 | 270;
  rpcUrl: string;
  blockExplorerApi: string;
  faucetUrl?: string;
};
export const eraNetworks: EraNetwork[] = [
  {
    id: 324,
    key: "era-mainnet",
    name: "zkSync Era Mainnet",
    shortName: "Era Mainnet",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.mainnet.zksync.io",
    l1Network: l1Networks.mainnet,
    visible: true,
  },
  {
    id: 280,
    key: "era-goerli",
    name: "zkSync Era Testnet",
    shortName: "Era Testnet",
    rpcUrl: "https://testnet.era.zksync.dev",
    blockExplorerUrl: "https://goerli.explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.testnets.zksync.dev",
    faucetUrl: "https://testnet2-faucet.zksync.dev/ask_money",
    l1Network: l1Networks.goerli,
    visible: true,
  },
  {
    id: 270,
    key: "era-stage",
    name: "zkSync Era Stage",
    shortName: "Era Stage",
    rpcUrl: "https://z2-dev-api.zksync.dev",
    blockExplorerUrl: "https://goerli.explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.testnets.zksync.dev",
    faucetUrl: "https://stage2-faucet.zksync.dev/ask_money",
    l1Network: l1Networks.sepolia,
    visible: false,
  },
];
export const zkSyncLiteNetworks: L2Network[] = [
  {
    key: "lite-mainnet",
    name: "zkSync Lite Mainnet",
    shortName: "Lite Mainnet",
    blockExplorerUrl: "https://zkscan.io",
    l1Network: l1Networks.mainnet,
    visible: true,
  },
  {
    key: "lite-goerli",
    name: "zkSync Lite Goerli",
    shortName: "Lite Goerli",
    blockExplorerUrl: "https://goerli.zkscan.io",
    l1Network: l1Networks.goerli,
    visible: true,
  },
];
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
  const selectedEthereumNetwork = computed<L1Network>(() => selectedNetwork.value.l1Network);
  const l1BlockExplorerUrl = computed<string | undefined>(
    () => selectedEthereumNetwork.value.blockExplorers?.default.url
  );

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
        getVersionByNetwork(network) === versionFromRoute &&
        selectedNetwork.value.l1Network.network === network.l1Network.network
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
    selectedEthereumNetwork,
    l1BlockExplorerUrl,

    networkChangedWarningDisabled,
    networkChangedWarning,
    lastSelectedNetwork,
    resetNetworkChangeWarning,
  };
});
