import { NetworkSwitcher } from "../data/data";

import type { LaunchOptions } from "@playwright/test";
const browserOptions: LaunchOptions = {
  slowMo: 10,
  devtools: true,
  headless: false,
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-web-security"],
};

export const config = {
  browser: process.env.BROWSER || "chromium",
  browserOptions,
  BASE_URL: process.env.TARGET_ENV || "http://localhost:3000",
  // BASE_URL: process.env.TARGET_ENV || "https://zkplus.io/",
  METAMASK_VERSION: process.env.METAMASK_VERSION || "10.14.1",
  IMG_THRESHOLD: { threshold: 0.4 },
  mainWindowSize: { width: 1280, height: 720 },
  popUpWindowSize: { width: 355, height: 500 },
  DAPP_NETWORK: NetworkSwitcher.zkSyncEraGoerli,
  headless: false,
  slowMo: 10,
  defaultTimeout: { timeout: 3 * 1000 },
  increasedTimeout: { timeout: 10 * 1000 },
  stepTimeout: { timeout: 60 * 1000 },
  feeLimitations: true,
  feeBoundaryLevel: 0.2, //in ETH
  networkL1: "goerli",
  networkL2: "https://testnet.era.zksync.dev",
  thresholdBalance: 0.6,
  preThresholdBalance: 0.9,
  matterMostURL: "most.matter-labs.io",
};
