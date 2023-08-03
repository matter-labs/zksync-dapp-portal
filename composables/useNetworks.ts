import type { L2Network } from "@/data/networks";
import type { Version } from "@/store/network";

import {
  eraNetworks as defaultEraNetworks,
  eraDockerizedNode,
  eraInMemoryNode,
  zkSyncLiteNetworks,
} from "@/data/networks";

export default () => {
  const runtimeConfig = useRuntimeConfig();

  const eraNetworks = [
    ...(runtimeConfig.public.localNode === "memory" ? [eraInMemoryNode] : []),
    ...(runtimeConfig.public.localNode === "dockerized" ? [eraDockerizedNode] : []),
    ...defaultEraNetworks,
  ];
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
