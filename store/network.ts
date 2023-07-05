import { useStorage } from "@vueuse/core";
import { goerli, mainnet, sepolia } from "@wagmi/core/chains";
import { defineStore } from "pinia";

import type { Chain } from "@wagmi/core/chains";
export type EthereumNetworkName = "goerli" | "sepolia" | "mainnet";

export type ExtendedChain = Chain & {
  network: EthereumNetworkName;
  iconUrl?: string;
  hostnames: { staging: string; production: string };
};
export const chains: ExtendedChain[] = [
  {
    ...mainnet,
    name: "Mainnet",
    network: "mainnet",
    iconUrl: "/img/ethereum.svg",
    hostnames: {
      staging: "https://staging-portal.zksync.dev",
      production: "https://portal.zksync.io",
    },
  },
  {
    ...goerli,
    name: "Goerli Testnet",
    hostnames: {
      staging: "https://goerli.staging-portal.zksync.dev",
      production: "https://goerli.portal.zksync.io",
    },
  },
  {
    ...sepolia,
    name: "Sepolia Testnet",
    hostnames: {
      staging: "",
      production: "",
    },
  },
];

export const useNetworkStore = defineStore("network", () => {
  const selectedEthereumNetworkName = useStorage<EthereumNetworkName>(
    "selectedEthereumNetwork",
    chains[0].network,
    window.sessionStorage
  );
  const selectedEthereumNetwork = computed<ExtendedChain>(() => {
    return chains.find((network) => network.network === selectedEthereumNetworkName.value) ?? chains[0];
  });
  const blockExplorerUrl = computed<string | undefined>(
    () => selectedEthereumNetwork.value.blockExplorers?.default.url
  );

  const lastSelectedEthereumNetworkName = useStorage<EthereumNetworkName | undefined>(
    "lastSelectedEthereumNetwork",
    undefined
  );
  const lastSelectedEthereumNetwork = computed<ExtendedChain | undefined>(() => {
    return chains.find((network) => network.network === lastSelectedEthereumNetworkName.value);
  });
  const ethereumNetworkChangedWarning = computed(
    () =>
      typeof lastSelectedEthereumNetworkName.value === "string" &&
      (lastSelectedEthereumNetworkName.value as string) !== "undefined" &&
      lastSelectedEthereumNetwork.value?.network !== selectedEthereumNetwork.value.network
  );
  watch(selectedEthereumNetworkName, (val) => {
    lastSelectedEthereumNetworkName.value = val;
  });

  const identifyNetwork = () => {
    const windowLocation = window.location;
    const networkFromQueryParam = new URLSearchParams(windowLocation.search).get("network");
    const networkOnDomain = chains.find((e) => Object.values(e.hostnames).includes(windowLocation.origin));
    const defaultNetwork = chains[0];
    const defaultNetworkName = defaultNetwork.network;
    if (networkFromQueryParam && chains.some((e) => e.network === networkFromQueryParam)) {
      selectedEthereumNetworkName.value = networkFromQueryParam as EthereumNetworkName;
    } else if (selectedEthereumNetworkName.value === defaultNetworkName) {
      if (networkOnDomain) {
        selectedEthereumNetworkName.value = networkOnDomain.network;
      } else {
        selectedEthereumNetworkName.value = defaultNetwork.network;
      }
    }
  };
  identifyNetwork();

  return {
    selectedEthereumNetwork,
    blockExplorerUrl,

    ethereumNetworkChangedWarning,
    lastSelectedEthereumNetworkName: computed(
      () => lastSelectedEthereumNetwork.value?.name ?? lastSelectedEthereumNetworkName.value
    ),
    lastSelectedEthereumNetwork,
    resetNetworkChangeWarning: () => {
      lastSelectedEthereumNetworkName.value = selectedEthereumNetwork.value.network;
    },
  };
});
