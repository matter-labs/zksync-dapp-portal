import { computed } from "vue";

import { defineStore, storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";
import { capitalize } from "@/utils/formatters";

export type TransactionDestination = {
  key?: string;
  label: string;
  iconUrl: string;
};

export const useDestinationsStore = defineStore("destinations", () => {
  const { selectedNetwork, version, selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const destinations = computed(() => ({
    zkSyncLite: {
      key: "zkSyncLite",
      label:
        version.value === "lite"
          ? selectedNetwork.value.name
          : `zkSync Lite ${capitalize(selectedEthereumNetwork.value.network)}`,
      iconUrl: "/img/zksync-lite.svg",
    },
    era: {
      key: "era",
      label:
        version.value === "era"
          ? selectedNetwork.value.name
          : `zkSync Era∎ ${capitalize(selectedEthereumNetwork.value.network)}`,
      iconUrl: "/img/era.svg",
    },
    ethereum: {
      key: "ethereum",
      label: `Ethereum ${capitalize(selectedEthereumNetwork.value.network)}`,
      iconUrl: "/img/ethereum.svg",
    },
    layerswap: {
      key: "layerswap",
      label: "Layerswap",
      iconUrl: "/img/layerswap.svg",
    },
    orbiter: {
      key: "orbiter",
      label: "Orbiter",
      iconUrl: "/img/orbiter.svg",
    },
    banxa: {
      key: "banxa",
      label: "Banxa",
      iconUrl: "/img/banxa.svg",
    },
    ramp: {
      key: "ramp",
      label: "Ramp",
      iconUrl: "/img/ramp.svg",
    },
    moonpay: {
      key: "moonpay",
      label: "Moonpay",
      iconUrl: "/img/moonpay.svg",
    },
    binance: {
      key: "binance",
      label: "Binance",
      iconUrl: "/img/binance.svg",
    },
    zigzag: {
      key: "zigzag",
      label: "ZigZag",
      iconUrl: "/img/zigzag.png",
    },
    syncswap: {
      key: "syncswap",
      label: "SyncSwap",
      iconUrl: "/img/syncswap.svg",
    },
  }));

  return {
    destinations,
  };
});
