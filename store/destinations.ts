import { computed } from "vue";

import { defineStore, storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";

export type TransactionDestination = {
  key?: string;
  label: string;
  iconUrl: string;
};

export const useDestinationsStore = defineStore("destinations", () => {
  const { l1Network } = storeToRefs(useNetworkStore());
  const { eraNetwork } = storeToRefs(useEraProviderStore());
  const { zkSyncLiteNetwork } = storeToRefs(useLiteProviderStore());

  const destinations = computed(() => ({
    zkSyncLite: {
      key: "zkSyncLite",
      label: zkSyncLiteNetwork.value.name,
      iconUrl: "/img/zksync-lite.svg",
    },
    era: {
      key: "era",
      label: eraNetwork.value.name,
      iconUrl: "/img/era.svg",
    },
    ethereum: {
      key: "ethereum",
      label: `Ethereum ${l1Network.value ? l1Network.value.name : ""}`,
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
      iconUrl: "/img/zigzag.svg",
    },
    rhino: {
      key: "rhino",
      label: "rhino.fi",
      iconUrl: "/img/rhino.svg",
    },
  }));

  return {
    destinations,
  };
});
