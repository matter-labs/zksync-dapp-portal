import { goerli, mainnet, sepolia } from "@wagmi/core/chains";

import type { Token } from "@/types";
import type { Network } from "zksync/build/types";

import { getTokensByNetworkId } from "@/utils/zksync/era/token-library";

export type L2Network = {
  key: string;
  name: string;
  shortName: string;
  l1Network?: L1Network;
  blockExplorerUrl?: string;
  visible: boolean;
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
  },
} as const;
export type L1Network = (typeof l1Networks)[keyof typeof l1Networks];

export type EraNetwork = L2Network & {
  id: number;
  rpcUrl: string;
  blockExplorerApi?: string;
  faucetUrl?: string;
  getTokens: () => Token[] | Promise<Token[]>;
};
export const eraNetworks: EraNetwork[] = [
  // See official documentation for local setup details: https://era.zksync.io/docs/tools/testing/
  {
    id: 260,
    key: "era-local",
    name: "zkSync Era Local",
    shortName: "Era Local",
    rpcUrl: "http://localhost:8011",
    getTokens: () => getTokensByNetworkId(280),
    visible: true,
  },
  {
    id: 324,
    key: "era-mainnet",
    name: "zkSync Era Mainnet",
    shortName: "Era Mainnet",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io",
    blockExplorerApi: "https://block-explorer-api.mainnet.zksync.io",
    l1Network: l1Networks.mainnet,
    getTokens: () => getTokensByNetworkId(324),
    visible: true,
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
    l1Network: l1Networks.goerli,
    getTokens: () => getTokensByNetworkId(280),
    visible: true,
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
    l1Network: l1Networks.sepolia,
    getTokens: () => getTokensByNetworkId(270),
    visible: false,
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
    visible: true,
  },
  {
    key: "lite-goerli",
    name: "zkSync Lite Goerli",
    network: "goerli",
    shortName: "Lite Goerli",
    blockExplorerUrl: "https://goerli.zkscan.io",
    l1Network: l1Networks.goerli,
    visible: true,
  },
];
