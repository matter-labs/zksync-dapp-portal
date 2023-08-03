import type { EraNetwork, L2Network } from "@/data/networks";
import type { Version } from "@/store/network";

import {
  eraNetworks as defaultEraNetworks,
  eraDockerizedNode,
  eraInMemoryNode,
  zkSyncLiteNetworks,
} from "@/data/networks";

export default () => {
  const runtimeConfig = useRuntimeConfig();

  const eraNetworks: EraNetwork[] = [];
  if (runtimeConfig.public.localNode === "memory") {
    eraNetworks.push(eraInMemoryNode);
  } else if (runtimeConfig.public.localNode === "dockerized") {
    eraNetworks.push(eraDockerizedNode);
  } else {
    eraNetworks.push(...defaultEraNetworks);
  }
  const getVersionByNetwork = (network: L2Network): Version => {
    if (eraNetworks.some((e) => e.key === network.key)) {
      return "era";
    } else if (zkSyncLiteNetworks.some((e) => e.key === network.key)) {
      return "lite";
    } else {
      throw new Error(`Unknown network: ${network.key}`);
    }
  };

  return {
    eraNetworks,
    zkSyncLiteNetworks,

    getVersionByNetwork,
  };
};
