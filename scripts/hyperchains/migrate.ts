/* 
  This file will look for hyperchain configuration files on the zksync-era repo
  and generate a /hyperchains/config.json file for the Portal.
*/
import { parse as envParse } from "dotenv";
import { prompt } from "enquirer";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join as pathJoin, parse as pathParse } from "path";

import { generateNetworkConfig, logUserInfo, promptNetworkReplacement } from "./utils";

import type { Network } from "./utils";
import type { Token } from "../../types";

const args = process.argv;
const rootPath = args[2];
if (!rootPath) {
  console.error(
    `Please provide the path to your zksync-era repo:
    npm run hyperchain:migrate <path_to_your_zksync-era_repo>`
  );
  process.exit(1);
}

const envsDirectory = pathJoin(rootPath, "/etc/env");
const tokensDirectory = pathJoin(rootPath, "/etc/tokens");

const migrateHyperchainInfo = async () => {
  console.log("Starting Hyperchain configuration setup...\n");

  const network = await promptNetworkEnv();
  const envName = network.key;
  await promptNetworkInfo(network);
  await promptNetworkReplacement(network);

  await generateNetworkConfig(network, getTokensFromDirectory(pathJoin(tokensDirectory, `${envName}.json`)));

  logUserInfo();
};

/* Utils */
const createNetworkFromEnv = (envPath: string): Network => {
  const env = envParse(readFileSync(envPath));
  const baseName = pathParse(envPath).name;

  const l1ChainName = env.CHAIN_ETH_NETWORK.charAt(0).toUpperCase() + env.CHAIN_ETH_NETWORK.slice(1);
  return {
    id: Number(env.CHAIN_ETH_ZKSYNC_NETWORK_ID),
    key: baseName,
    name: env.CHAIN_ETH_ZKSYNC_NETWORK,
    shortName: env.CHAIN_ETH_ZKSYNC_NETWORK,
    rpcUrl: env.API_WEB3_JSON_RPC_HTTP_URL,
    l1Network: {
      id: Number(env.ETH_CLIENT_CHAIN_ID),
      name: l1ChainName === "Localhost" ? "Localhost L1" : l1ChainName,
      network: env.CHAIN_ETH_NETWORK,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: { http: [env.ETH_CLIENT_WEB3_URL] },
        public: { http: [env.ETH_CLIENT_WEB3_URL] },
      },
    },
  };
};
const getTokensFromDirectory = (directoryPath: string): Token[] => {
  try {
    return JSON.parse(readFileSync(directoryPath).toString());
  } catch {
    return [];
  }
};

/* Prompts */
const promptNetworkEnv = async () => {
  const getEnvsFromDirectory = (directoryPath: string): string[] => {
    if (existsSync(directoryPath)) {
      return readdirSync(directoryPath)
        .map((fullFileName) => pathParse(fullFileName))
        .filter((file) => {
          if (!file.ext.endsWith(".env")) return false;
          if (!file.name) return false;
          if (file.base === ".init.env") return false;
          return true;
        })
        .map((file) => file.name);
    } else {
      console.error("No .env files available for provided directory");
    }
  };

  const { selectedEnv }: { selectedEnv: string } = await prompt([
    {
      message: "Which environment do you want to use?",
      name: "selectedEnv",
      type: "select",
      choices: getEnvsFromDirectory(envsDirectory).sort(),
    },
  ]);

  return createNetworkFromEnv(pathJoin(envsDirectory, `${selectedEnv}.env`));
};
const promptNetworkInfo = async (network: Network) => {
  const { name, shortName, l1NetworkName }: { name: string; shortName: string; l1NetworkName: string } = await prompt([
    {
      message: "Displayed network name",
      name: "name",
      type: "input",
      initial: network.name,
      required: true,
    },
    {
      message: "Displayed network short name",
      name: "shortName",
      type: "input",
      initial: network.shortName,
      required: true,
    },
    {
      message: "Displayed L1 network name",
      name: "l1NetworkName",
      type: "input",
      initial: network.l1Network.name,
      required: true,
    },
  ]);

  network.name = name;
  network.shortName = shortName;
  network.l1Network.name = l1NetworkName;
};

migrateHyperchainInfo();
