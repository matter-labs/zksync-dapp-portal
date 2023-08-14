import Hyperchains from "@/hyperchains/config.json";

import type { EraNetwork, L2Network } from "@/data/networks";
import type { Version } from "@/store/network";
import type { Token } from "@/types";

import {
  eraNetworks as defaultEraNetworks,
  eraDockerizedNode,
  eraInMemoryNode,
  zkSyncLiteNetworks,
} from "@/data/networks";

export default () => {
  const runtimeConfig = useRuntimeConfig();

  const isCustomNode = !!runtimeConfig.public.nodeType;
  const eraNetworks: EraNetwork[] = [];
  if (runtimeConfig.public.nodeType === "memory") {
    eraNetworks.push(eraInMemoryNode);
  } else if (runtimeConfig.public.nodeType === "dockerized") {
    eraNetworks.push(eraDockerizedNode);
  } else if (runtimeConfig.public.nodeType === "hyperchain") {
    eraNetworks.push(
      ...(Hyperchains as unknown as Array<{ network: EraNetwork; tokens: Token[] }>).map((e) => ({
        ...e.network,
        getTokens: () => e.tokens,
      }))
    );
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
    isCustomNode,

    eraNetworks,
    zkSyncLiteNetworks,

    getVersionByNetwork,
  };
};
