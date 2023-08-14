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
      iconUrl: "/img/zksync-lite.svg?v=1",
    },
    era: {
      key: "era",
      label: eraNetwork.value.name,
      iconUrl: "/img/era.svg?v=1",
    },
    ethereum: {
      key: "ethereum",
      label: `Ethereum ${l1Network.value ? l1Network.value.name : ""}`,
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
      iconUrl: "/img/zigzag.svg?v=1",
    },
  }));

  return {
    destinations,
  };
});
