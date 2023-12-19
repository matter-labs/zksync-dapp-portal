import Hyperchains from "@/hyperchains/config.json";

import type { ZkSyncNetwork } from "@/data/networks";
import type { Token } from "@/types";

import { zkSyncNetworks as defaultEraNetworks, dockerizedNode, inMemoryNode } from "@/data/networks";

export default () => {
  const runtimeConfig = useRuntimeConfig();

  const isCustomNode = !!runtimeConfig.public.nodeType;
  const zkSyncNetworks: ZkSyncNetwork[] = [];
  if (runtimeConfig.public.nodeType === "memory") {
    zkSyncNetworks.push(inMemoryNode);
  } else if (runtimeConfig.public.nodeType === "dockerized") {
    zkSyncNetworks.push(dockerizedNode);
  } else if (runtimeConfig.public.nodeType === "hyperchain") {
    zkSyncNetworks.push(
      ...(Hyperchains as unknown as Array<{ network: ZkSyncNetwork; tokens: Token[] }>).map((e) => ({
        ...e.network,
        getTokens: () => e.tokens,
      }))
    );
  } else {
    zkSyncNetworks.push(...defaultEraNetworks);
  }

  const defaultNetwork = zkSyncNetworks[0];

  return {
    isCustomNode,

    zkSyncNetworks,
    defaultNetwork,
  };
};
