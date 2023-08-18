/* eslint-disable @typescript-eslint/no-explicit-any */
import { setTimeout } from "timers/promises";

import { BasePage } from "./base.page";
import { address, MetamaskPage } from "./metamask.page";
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

  get menuWalletButton() {
    return "//button/div[contains(text(), '0x')]";
  }

  async revokeButton(value: string) {
    return `//button[contains(text(), '${value}')]`;
  }

  async checkNetworkForRevoke(network: string) {
    const selector = `${this.networkSelectorsListForRevoke}/..//img[@alt='${network}']`;
    result = await this.world.page?.locator(selector).first().isVisible();
    return result;
  }

  async clickByMenuWalletButton() {
    selector = this.menuWalletButton;
    await this.world.page?.waitForSelector(selector);
    await this.world.page?.locator(selector).first().click(config.defaultTimeout);
  }

  async revokeAllowance() {
    metamaskPage = await new MetamaskPage(this.world);
    const networkChainId = "?chainId=5"; // Goerli
    const revokeGoerliUrl = "https://revoke.cash/address/" + address + networkChainId;
    const networkForRevokeIsSelected = await this.checkNetworkForRevoke("Goerli");
    if (!networkForRevokeIsSelected) {
      await this.goTo(revokeGoerliUrl);
    }
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
