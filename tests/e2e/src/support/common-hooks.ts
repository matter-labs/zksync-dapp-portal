import path from "path";
import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

import type { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { Helper } from "../helpers/helper";
import { BasePage } from "../pages/base.page";
import { MetamaskPage } from "../pages/metamask.page";
import { config } from "../support/config";

import type { ICustomWorld } from "./custom-world";

const pathToExtension = path.join(__dirname, "../support/extension/metamask-chrome-" + config.METAMASK_VERSION);
const userDataDir = "";
let browser: any;

setDefaultTimeout(process.env.PWDEBUG ? -1 : 301 * 1000);

BeforeAll(async function (this: ICustomWorld) {
  if (process.env.INCOGNITO_MODE === "true") {
    browser = await chromium.launchPersistentContext(userDataDir, {
      slowMo: config.slowMo,
      headless: config.headless,
      args: ["--disable-extensions"],
      viewport: config.mainWindowSize,
    });
  } else {
    browser = await chromium.launchPersistentContext(userDataDir, {
      slowMo: config.slowMo,
      headless: config.headless,
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
      viewport: config.mainWindowSize,
      permissions: ["clipboard-read"],
    });
  }
  await browser;
  console.log("-------- Base Url: ", config.BASE_URL + config.DAPP_NETWORK);
});

Before({ tags: "@ignore" }, async function () {
  return "skipped" as any;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.testName = pickle.name.replace(/\W/g, "-");
  this.context = browser;
  this.page = await this.context?.newPage();

  const basePage = new BasePage(this);
  const helper = new Helper(this);
  const metamaskPage = new MetamaskPage(this);

  await helper.metamaskAuthorization(metamaskPage, basePage, pickle);
  this.feature = pickle;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  const metamaskPage = new MetamaskPage(this);
  const helper = new Helper(this);
  await helper.getScreenshotOnFail(result);
  await helper.restoreEnvironment(metamaskPage, this.context);
});

AfterAll(async function (this: ICustomWorld) {
  await browser.close();
});
