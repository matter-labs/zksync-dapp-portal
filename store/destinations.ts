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
  const { selectedNetwork, version, l1Network } = storeToRefs(useNetworkStore());

  const destinations = computed(() => ({
    zkSyncLite: {
      key: "zkSyncLite",
      label:
        version.value === "lite" ? selectedNetwork.value.name : `zkSync Lite ${capitalize(l1Network.value.network)}`,
      iconUrl: "/img/zksync-lite.svg?v=1",
    },
    era: {
      key: "era",
      label:
        version.value === "era" ? selectedNetwork.value.name : `zkSync Era∎ ${capitalize(l1Network.value.network)}`,
      iconUrl: "/img/era.svg?v=1",
    },
    ethereum: {
      key: "ethereum",
      label: `Ethereum ${capitalize(l1Network.value.network)}`,
      iconUrl: "/img/ethereum.svg?v=1",
    },
    layerswap: {
      key: "layerswap",
      label: "Layerswap",
      iconUrl: "/img/layerswap.svg?v=1",
    },
    orbiter: {
      key: "orbiter",
      label: "Orbiter",
      iconUrl: "/img/orbiter.svg?v=1",
    },
    banxa: {
      key: "banxa",
      label: "Banxa",
      iconUrl: "/img/banxa.svg?v=1",
    },
    ramp: {
      key: "ramp",
      label: "Ramp",
      iconUrl: "/img/ramp.svg?v=1",
    },
    moonpay: {
      key: "moonpay",
      label: "Moonpay",
      iconUrl: "/img/moonpay.svg?v=1",
    },
    binance: {
      key: "binance",
      label: "Binance",
      iconUrl: "/img/binance.svg?v=1",
    },
    zigzag: {
      key: "zigzag",
      label: "ZigZag",
      iconUrl: "/img/zigzag.png?v=1",
    },
  }));

  return {
    destinations,
  };
});
