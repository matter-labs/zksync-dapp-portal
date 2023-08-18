/* eslint-disable @typescript-eslint/no-explicit-any */
import { setTimeout } from "timers/promises";

import { BasePage } from "./base.page";
import { MetamaskPage } from "./metamask.page";
import { MainPage } from "../pages/main.page";
import { config } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";

let metamaskPage: any;
let result: any;
let selector: string;

export class ExternalPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  // selectors for revoke
  get networkSelectorsListForRevoke() {
    return "//*[@id='react-select-address-chain-select-live-region']";
  }

  async revokeButton(value: string) {
    return `//button[contains(text(), '${value}')]`;
  }

  async checkNetworkForRevoke(network: string) {
    const selector = `${this.networkSelectorsListForRevoke}/..//img[@alt='${network}']`;
    result = await this.world.page?.locator(selector).first().isVisible();
    return result;
  }

  async buttonOfModalCard(buttonText: string) {
    const mainPage = new MainPage(this.world);
    return `${mainPage.modalCard}//button[contains(., '${buttonText}')]`;
  }

  async clickByMenuWalletButton() {
    selector = "//button/div[contains(text(), '0x')]";
    await this.world.page?.waitForSelector(selector);
    await this.world.page?.locator(selector).first().click(config.defaultTimeout);
  }

  async revokeAllowance() {
    metamaskPage = await new MetamaskPage(this.world);
    console.log("going to take wallet address");
    const currentWalletAddress = await metamaskPage.getCurrentWalletAddress();
    console.log("Wallet address is " + currentWalletAddress);
    const networkChainId = "?chainId=5"; // Goerli
    const revokeGoerliUrl = "https://revoke.cash/address/" + currentWalletAddress + networkChainId;
    const networkForRevokeIsSelected = await this.checkNetworkForRevoke("Goerli");
    if (!networkForRevokeIsSelected) {
      console.log("going to take insert revoke adress");
      await this.goTo(revokeGoerliUrl);
    }
    console.log("Im on the revoke page");
    await setTimeout(config.defaultTimeout.timeout);
    selector = await this.revokeButton("Switch Network");
    const switchNetworkIsVisible = await this.world.page?.locator(selector).isVisible();
    if (switchNetworkIsVisible) {
      const popUpContext = await metamaskPage.catchPopUpByClick(selector);
      await popUpContext?.setViewportSize(config.popUpWindowSize);
      await popUpContext?.click(metamaskPage.switchNetworkButton);
    }

    await setTimeout(config.defaultTimeout.timeout);
    selector = await this.revokeButton("Revoke");
    const revokeButtonIsVisible = await this.world.page?.locator(selector).isVisible();
    if (revokeButtonIsVisible) {
      const popUpContext = await metamaskPage.catchPopUpByClick(selector);
      await popUpContext?.setViewportSize(config.popUpWindowSize);
      await popUpContext?.click(metamaskPage.confirmTransaction);
      await this.revokeAllowance();
    }

    selector = await this.revokeButton("Revoking");
    let revokingButtonIsVisible = await this.world.page?.locator(selector).isVisible();
    if (revokingButtonIsVisible) {
      do {
        await setTimeout(3 * 1000);
        revokingButtonIsVisible = await this.world.page?.locator(selector).isVisible();
      } while (revokingButtonIsVisible);
    }
  }
}
