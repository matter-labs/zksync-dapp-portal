import { goerli, mainnet, sepolia } from "@wagmi/core/chains";

import type { Token } from "@/types";
import type { Chain } from "@wagmi/core/chains";
import type { Network } from "zksync/build/types";

import { ETH_L1_ADDRESS, ETH_L2_ADDRESS } from "@/utils/constants";
import { getTokensByNetworkId } from "@/utils/zksync/era/token-library";

export type L2Network = {
  key: string;
  name: string;
  shortName: string;
  l1Network?: L1Network;
  blockExplorerUrl?: string;
  // If set to true, the network will not be shown in the network selector
  hidden?: boolean;
};
export const l1Networks = {
  mainnet: {
    ...mainnet,
    name: "Mainnet",
    network: "mainnet",
  },
  goerli: {
    ...goerli,
    name: "Goerli Testnet",
  },
  sepolia: {
    ...sepolia,
    name: "Sepolia Testnet",
    rpcUrls: {
      public: { http: ["https://sepolia.gateway.tenderly.co"] },
      default: { http: ["https://sepolia.gateway.tenderly.co"] },
    },
  },
} as const;
export type L1Network = Chain;

export type EraNetwork = L2Network & {
  id: number;
  rpcUrl: string;
  blockExplorerApi?: string;
  faucetUrl?: string;
  displaySettings?: {
    showPartnerLinks?: boolean;
    showZkSyncLiteNetworks?: boolean;
  };
  getTokens: () => Token[] | Promise<Token[]>;
};

// See the official documentation on running a local zkSync node: https://era.zksync.io/docs/tools/testing/
// Also see the guide in the README.md file in the root of the repository.

// In-memory node default config. Docs: https://era.zksync.io/docs/tools/testing/era-test-node.html
export const eraInMemoryNode: EraNetwork = {
  id: 260,
  key: "era-local-memory",
  name: "Hyperchain Local",
  shortName: "Hyperchain Local",
  rpcUrl: "http://localhost:8011",
  getTokens: () => [
    {
      address: ETH_L2_ADDRESS,
      symbol: "ETH",
      decimals: 18,
      iconUrl: "/img/eth.svg", // optional
      enabledForFees: true, // optional
    },
  ],
};

// Dockerized local setup default config. Docs: https://era.zksync.io/docs/tools/testing/dockerized-testing.html
export const eraDockerizedNode: EraNetwork = {
  id: 270,
  key: "era-local-dockerized",
  name: "Hyperchain Local",
  shortName: "Hyperchain Local",
  rpcUrl: "http://localhost:3050",
  getTokens: () => [
    {
      address: ETH_L2_ADDRESS,
      l1Address: ETH_L1_ADDRESS, // optional
      symbol: "ETH",
      decimals: 18,
      iconUrl: "/img/eth.svg", // optional
      enabledForFees: true, // optional
    },
  ],
  l1Network: {
    id: 9,
    name: "L1 Local",
    network: "l1-local",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["http://localhost:8545"] },
      public: { http: ["http://localhost:8545"] },
    },
  },
};

export const eraNetworks: EraNetwork[] = [
  {
    id: 324,
    key: "era-mainnet",
    name: "zkSync Era Mainnet",
    shortName: "Era Mainnet",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.mainnet.zksync.io",
    displaySettings: {
      showPartnerLinks: true,
      showZkSyncLiteNetworks: true,
    },
    getTokens: () => getTokensByNetworkId(324),
    l1Network: l1Networks.mainnet,
  },
  {
    id: 280,
    key: "era-goerli",
    name: "zkSync Era Testnet",
    shortName: "Era Testnet",
    rpcUrl: "https://testnet.era.zksync.dev",
    blockExplorerUrl: "https://goerli.explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.testnets.zksync.dev",
    faucetUrl: "https://testnet2-faucet.zksync.dev/ask_money",
    displaySettings: {
      showPartnerLinks: true,
      showZkSyncLiteNetworks: true,
    },
    getTokens: () => getTokensByNetworkId(280),
    l1Network: l1Networks.goerli,
  },
  {
    id: 270,
    key: "era-stage",
    name: "zkSync Era Stage",
    shortName: "Era Stage",
    rpcUrl: "https://z2-dev-api.zksync.dev",
    blockExplorerUrl: "https://goerli-beta.staging-scan-v2.zksync.dev",
    blockExplorerApi: "https://block-explorer-api.stage.zksync.dev",
    faucetUrl: "https://stage2-faucet.zksync.dev/ask_money",
    getTokens: () => getTokensByNetworkId(270),
    l1Network: l1Networks.sepolia,
    hidden: true,
  },
];

export type ZkSyncLiteNetwork = L2Network & { network: Network };
export const zkSyncLiteNetworks: ZkSyncLiteNetwork[] = [
  {
    key: "lite-mainnet",
    name: "zkSync Lite Mainnet",
    network: "mainnet",
    shortName: "Lite Mainnet",
    blockExplorerUrl: "https://zkscan.io",
    l1Network: l1Networks.mainnet,
  },
  {
    key: "lite-goerli",
    name: "zkSync Lite Goerli",
    network: "goerli",
    shortName: "Lite Goerli",
    blockExplorerUrl: "https://goerli.zkscan.io",
    l1Network: l1Networks.goerli,
  },
];
