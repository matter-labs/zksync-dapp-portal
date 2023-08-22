/* eslint-disable @typescript-eslint/no-explicit-any */
import { setTimeout } from "timers/promises";

import { BasePage } from "./base.page";
import { MainPage } from "./main.page";
import { Extension } from "../data/data";
import { depositTag, Helper } from "../helpers/helper";
import { config, wallet } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";

let page: any;
let element: any;
let metamaskHomeUrl: string;
let metamaskWelcomeUrl: string;
let testId: any;
let logoutTrigger: any = undefined;

export class MetamaskPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get continueBtn() {
    return "//*[@class='transaction-footer-row']//button";
  }

  get aggressiveFee() {
    return "//input[@value='high']";
  }

  get feeTypes() {
    return "//*[@class='transaction-detail-edit']//button";
  }

  get feeChangerBtn() {
    return "//div[@class='edit-gas-display']//button";
  }

  get feeChangerAlert() {
    return "//p[contains(text(), 'Fee has changed')]";
  }

  get saveFeeBtn() {
    return "//*[@class='popover-container']//button";
  }

  get metamaskResetButton() {
    return "//*[@data-testid='advanced-setting-reset-account']//button[1]"; // //button[contains(text(),'Reset')]|
  }

  get extensionDetailsBtn() {
    return "id=detailsButton";
  }

  get acceptMetricsBtn() {
    return "page-container-footer-next";
  }

  get confirmTransaction() {
    return "//*[@data-testid='page-container-footer-next']";
  }

  get declineBtn() {
    return "//*[@data-testid='page-container-footer-cancel']";
  }

  get newPasswordField() {
    return "//*[@autocomplete='new-password' and @id='password']";
  }

  get confirmPasswordField() {
    return "id=confirm-password";
  }

  get unlockPasswordField() {
    return "#password";
  }

  get confirmUnlockBtn() {
    return "//button[1]";
  }

  get checkboxTermsUsage() {
    return "//*[@href='https://metamask.io/terms.html']/../../../../input";
  }

  get importBtn() {
    return "//button[@type='submit']";
  }

  get succeedBtn() {
    return "//button[@role='button']";
  }

  get confirmBtn() {
    return "//div[@class='confirmation-footer']//button[2]";
  }

  get mainBtn() {
    return ".button";
  }

  get metamaskFormField() {
    return "@class='form-field__input'";
  }

  async metamaskValue(value: string) {
    return `@value='${value}'`;
  }

  //metamask home page
  get headerIcon() {
    return "(//*[contains(@class,'app-header')]//div[contains(@class,'identicon')])[1]";
  }

  get logoutBtn() {
    return "//div[@class='account-menu']//button";
  }

  get popOverMenuCloseBtn() {
    return "//h2[@title='popover']/..//button";
  }

  async getCodePhraseField(indx: number) {
    element = `${this.byTestId}import-srp__srp-word-` + indx.toString();
    return await element;
  }

  async getloginPage() {
    testId = new BasePage(this.world).byTestId;
    await page.bringToFront();
    await page.reload();
    await page.click(this.mainBtn);
    await page.click(this.mainBtn);
    await page.click(testId + this.acceptMetricsBtn);
  }

  async importMetamaskAccount(secretPhrase: Array<string>, password: string) {
    await this.fillSecretPhrase(secretPhrase);
    await page.fill(this.newPasswordField, password);
    await page.fill(this.confirmPasswordField, password);
    await page.locator(this.checkboxTermsUsage).click({ force: true });
    await page.bringToFront();
    await page.click(this.importBtn);
    await page.click(this.succeedBtn);
  }

  private async fillSecretPhrase(walletPhrase: Array<string>) {
    for (let i = 0; i < walletPhrase.length; i++) {
      const secretWord: string = walletPhrase[i].toString();
      const codePhraseField: object = await this.getCodePhraseField(i);
      await page.locator(codePhraseField).fill(secretWord);
    }
  }

  async authorizeInMetamaskExtension(secretPhrase: Array<string>, password: string) {
    const helper = await new Helper(this.world);
    const wallet_password = await helper.decrypt(wallet.password);
    page = this.world.page;

    if (metamaskWelcomeUrl === undefined) {
      await this.getMetamaskExtensionUrl();
      await page.goto(metamaskWelcomeUrl);
      await page.reload();
      await page.bringToFront();
      await this.getloginPage();
      await this.importMetamaskAccount(secretPhrase, password);
    } else {
      await page.goto(metamaskWelcomeUrl);
      if (logoutTrigger && (await page.$(this.unlockPasswordField)) !== null) {
        await page.locator(this.unlockPasswordField).fill(wallet_password);
        await page.locator(this.confirmUnlockBtn).click();
      }
    }
    logoutTrigger = false;
  }

  async operateTransaction(triggeredElement: string) {
    //change network
    try {
      await this.switchNetwork();
    } finally {
      await setTimeout(config.minimalTimeout.timeout);
      await this.click(this.continueBtn);

      const popUpContext = await this.catchPopUpByClick(`//span[contains(text(),'${triggeredElement}')]`);
      await setTimeout(config.minimalTimeout.timeout);
      await popUpContext?.setViewportSize(config.popUpWindowSize);
      await popUpContext?.click(this.confirmTransaction);
    }
  }

  async catchPopUpByClick(element: string) {
    testId = new BasePage(this.world).byTestId;
    const helper = await new Helper(this.world);
    const [popUp] = await Promise.all([
      this.world.context?.waitForEvent("page"),
      await helper.checkElementVisible(element),
      await this.world.page?.locator(element).first().click(),
      await setTimeout(config.defaultTimeout.timeout),
      await this.isFeeAlert(element),
    ]);
    return popUp;
  }

  async isFeeAlert(element: string) {
    const helper = new Helper(this.world);
    const mainPage = new MainPage(this.world);
    const feeAlert = await helper.checkElementVisible(this.feeChangerAlert);
    if (feeAlert) {
      await helper.checkElementVisible(mainPage.confirmFeeChangeButton);
      await this.click(mainPage.confirmFeeChangeButton);
      await this.catchPopUpByClick(element);
    }
  }

  async catchPopUp() {
    const [popUp] = await Promise.all([this.world.context?.waitForEvent("page")]);
    return popUp;
  }

  async switchNetwork() {
    const switchNetworkBtnSelector = "//div[@class='transaction-footer-row']//button";
    const switchNetworkBtnElement: any = await this.world.page?.locator(switchNetworkBtnSelector);
    //check that switchNetworkBtnSelector is switcher network button
    const buttonText = await switchNetworkBtnElement.innerText();
    const result = buttonText.includes("Change wallet network");
    if ((await switchNetworkBtnElement.isEnabled()) && result) {
      const popUpContext = await this.catchPopUpByClick(switchNetworkBtnSelector);
      await popUpContext?.setViewportSize(config.popUpWindowSize);
      if (!depositTag) {
        await popUpContext?.click(this.confirmBtn);
      }
      await popUpContext?.click(this.confirmBtn);
    }
  }

  private async getMetamaskExtensionUrl() {
    await page.goto(Extension.allExtensionsUrl);
    await page.locator(this.extensionDetailsBtn).click();
    let extractedId: any = await page.url();
    extractedId = await extractedId.match("\\=(.*)")[1];
    metamaskHomeUrl = Extension.specifiedExtensionUrl + extractedId + Extension.metamaskHomeHtml;
    metamaskWelcomeUrl = metamaskHomeUrl + Extension.metamaskInitialize;
  }

  private async processTransaction(context: any, actionType: string) {
    await context?.setViewportSize(config.popUpWindowSize);
    await context?.bringToFront();
    if (actionType === "confirm") {
      await this.selectAggressiveFee(context);
      await context?.click(this.confirmTransaction, config.increasedTimeout);
    } else if (actionType === "reject") {
      await context?.click(this.declineBtn, config.increasedTimeout);
    } else {
      console.error("Incorrect actionType value: it should be only confirm or reject");
    }
  }

  async selectAggressiveFee(context: any) {
    await context?.click(this.feeTypes, config.increasedTimeout);
    await context?.click(this.feeChangerBtn, config.increasedTimeout);
    const aggressiveFeeVisibility = await context?.locator(this.aggressiveFee).isVisible(config.defaultTimeout);
    if (aggressiveFeeVisibility) {
      await context?.click(this.aggressiveFee, config.increasedTimeout);
    }
    await context?.click(this.saveFeeBtn, config.increasedTimeout);
  }

  async logout() {
    const page = await this.world.context?.newPage();
    await page?.goto(metamaskWelcomeUrl);
    await page?.waitForLoadState("domcontentloaded");

    if (logoutTrigger === false || logoutTrigger === undefined || (await page?.$(this.unlockPasswordField)) === null) {
      if (await page?.locator(this.popOverMenuCloseBtn).isVisible(config.defaultTimeout)) {
        await page?.locator(this.popOverMenuCloseBtn).first().click(config.defaultTimeout);
      }
      if (await page?.locator(this.headerIcon).first().isVisible(config.defaultTimeout)) {
        await page?.locator(this.headerIcon).first().click();
        await page?.locator(this.logoutBtn).first().click();
      }
    }
    return (logoutTrigger = true);
  }

  async isLogout() {
    return logoutTrigger;
  }
}
