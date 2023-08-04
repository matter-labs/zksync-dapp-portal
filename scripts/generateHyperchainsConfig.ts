/* 
  This file will collect all info about hyperchains from /hyperchains folder
  and create a single .json file with all configs.
  This file runs once before starting the app with `npm run dev:node:hyperchain` or `npm run generate:node:hyperchain`
*/
import { parse as envParse } from "dotenv";
import { readdir, readFileSync, statSync, writeFileSync } from "fs";
import { join as pathJoin, parse as pathParse } from "path";

import { ETH_L1_ADDRESS, ETH_L2_ADDRESS } from "../utils/constants";

import type { EraNetwork } from "../data/networks";
import type { Token } from "../types";

const hyperchainsPath = pathJoin(__dirname, "../hyperchains");

const result: Record<string, { network: Omit<EraNetwork, "getTokens">; tokens: Token[]; lastModified?: Date }> = {};

readdir(hyperchainsPath, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach((file) => {
    if (!file.endsWith(".env")) {
      return;
    }
    // Get the file base name (without extension)
    const baseName = pathParse(file).name;

    const filePath = pathJoin(hyperchainsPath, file);
    const fileStats = statSync(filePath);
    const env = envParse(readFileSync(pathJoin(hyperchainsPath, file)));
    const tokens: Token[] = files.includes(`${baseName}.json`)
      ? JSON.parse(readFileSync(pathJoin(hyperchainsPath, `${baseName}.json`), "utf-8"))
      : [];

    result[baseName] = {
      lastModified: fileStats.mtime,
      network: {
        id: Number(env.CHAIN_ETH_ZKSYNC_NETWORK_ID),
        key: baseName,
        name: env.CHAIN_ETH_ZKSYNC_NETWORK,
        shortName: env.CHAIN_ETH_ZKSYNC_NETWORK,
        rpcUrl: env.API_WEB3_JSON_RPC_HTTP_URL,
        l1Network: {
          id: Number(env.ETH_CLIENT_CHAIN_ID),
          name: env.CHAIN_ETH_NETWORK.charAt(0).toUpperCase() + env.CHAIN_ETH_NETWORK.slice(1),
          network: env.CHAIN_ETH_NETWORK,
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: { http: [env.ETH_CLIENT_WEB3_URL] },
            public: { http: [env.ETH_CLIENT_WEB3_URL] },
          },
        },
        visible: true,
      },
      tokens,
    };

    // Add ETH token if it's not in the list
    if (!tokens.find((token: Token) => token.address === ETH_L2_ADDRESS)) {
      result[baseName].tokens.unshift({
        address: ETH_L2_ADDRESS,
        l1Address: ETH_L1_ADDRESS,
        symbol: "ETH",
        decimals: 18,
        iconUrl: "/img/eth.svg",
        enabledForFees: true,
      });
    }
  });

  // sort chains by last modified date (the latest is the default network)
  const chains = Object.values(result)
    .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
    .map((e) => ({ network: e.network, tokens: e.tokens }));

  if (!chains.length) throw new Error("No hyperchains found. Read /hyperchains/README.md for more info.");
  writeFileSync(pathJoin(hyperchainsPath, "hyperchains.json"), JSON.stringify(chains, null, 2));
});
