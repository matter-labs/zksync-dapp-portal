/* eslint-disable @typescript-eslint/no-explicit-any */
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { Helper } from "../helpers/helper";
import { BasePage } from "../pages/base.page";
import { LoginPage } from "../pages/login.page";
import { MainPage } from "../pages/main.page";
import { MetamaskPage } from "../pages/metamask.page";
import { config } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";

let basePage: BasePage;
let mainPage: MainPage;
let metamaskPage: MetamaskPage;
let helper: Helper;
let result: any;
let element: any;

Given("I go to {string} url", config.stepTimeout, async function (this: ICustomWorld, url: string) {
  basePage = new BasePage(this);
  await basePage.goTo(url);
});

Given("I go to page {string}", config.stepTimeout, async function (this: ICustomWorld, route: string) {
  await this.page?.goto(config.BASE_URL + route);
});

When("I click by text {string}", config.stepTimeout, async function (this: ICustomWorld, text: string) {
  basePage = new BasePage(this);
  await basePage.clickByText(text);
});

When(
  "I click by {string} with {string} value",
  config.stepTimeout,
  async function (this: ICustomWorld, elementType: string, value: string) {
    basePage = new BasePage(this);
    await basePage.clickBy(elementType, value);
  }
);

When("Connect Metamask extension with login action", config.stepTimeout, async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this);

  await loginPage.connectMetamask();
});

When(
  "I go to {string} transaction section",
  config.stepTimeout,
  async function (this: ICustomWorld, transactionType: string) {
    mainPage = new MainPage(this);
    await mainPage.selectTransaction(transactionType);
  }
);

When(
  "I choose {string} as token and insert {string} as amount",
  config.stepTimeout,
  async function (this: ICustomWorld, token: string, amount: string) {
    mainPage = new MainPage(this);
    await mainPage.insertAmount(amount);
    await mainPage.chooseToken(token);
  }
);

When(
  "Message {string} should be visible",
  { timeout: 181 * 1000 },
  async function (this: ICustomWorld, successMessage: string) {
    result = await this.page?.locator(`//*[text()="${successMessage}"]`).first();
    await expect(result).toBeVisible({ timeout: 180 * 1000 });
  }
);

When(
  "I {string} transaction after clicking {string} button",
  config.stepTimeout,
  async function (this: ICustomWorld, actionType: string, transactionBtn: string) {
    mainPage = new MainPage(this);
    await mainPage.makeTransaction(actionType, transactionBtn);
  }
);

Then(
  "Element with {string} {string} should be {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, elementType: string, value: string, checkType: string) {
    basePage = new BasePage(this);
    helper = new Helper(this);
    element = await basePage.returnElementByType(elementType, value);

    if (checkType === "visible") {
      await expect(element).toBeVisible();
    } else if (checkType === "invisible") {
      result = await helper.checkElementVisible(element);
      await expect(result).toBe(false);
    } else if (checkType === "clickable") {
      result = await helper.checkElementClickable(element);
      await expect(result).toBe(true);
    } else if (checkType === "disabled") {
      result = await element.isDisabled();
      await expect(result).toBe(true);
    } else if (checkType === "enabled") {
      result = await element.isDisabled();
      await expect(result).toBe(false);
    }
  }
);

When("I insert {string} as amount", config.stepTimeout, async function (this: ICustomWorld, amount: string) {
  mainPage = new MainPage(this);
  await mainPage.insertAmount(amount);
});

When("I confirm the network switching", config.stepTimeout, async function (this: ICustomWorld) {
  metamaskPage = new MetamaskPage(this);
  await metamaskPage.switchNetwork();
});

When("A wallet should be {string}", config.stepTimeout, async function (this: ICustomWorld, balanceValue: string) {
  mainPage = new MainPage(this);
  result = await mainPage.getTotalBalance();

  if (balanceValue === "fullfilled") {
    expect(result).toBeGreaterThan(0.1);
  } else if (balanceValue === "empty") {
    expect(result).toBeLessThanOrEqual(0);
  } else {
    console.log("An incorrect value has been provided as a parameter: the correct ones only 'fullfilled' and 'empty'");
  }
});
