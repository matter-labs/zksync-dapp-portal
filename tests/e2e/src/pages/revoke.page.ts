import { setTimeout } from "timers/promises";

import { Helper } from "../helpers/helper";
import { config } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";
import { address, MetamaskPage } from "./metamask.page";
import { BasePage } from "./base.page";

let metamaskPage: any;
let result: any;
let selector: string;
let argument: string;

export class RevokePage extends BasePage {
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

  get metamaskButton() {
    return "//button[contains(text(),'MetaMask')]";
  }

  get revokeURL() {
    return "https://revoke.cash/";
  }

  async revokeButton(value: string) {
    return `//button[contains(text(), '${value}')]`;
  }

  async login() {
    const basePage = new BasePage(this.world);
    metamaskPage = new MetamaskPage(this.world);
    const revokeUrl = this.revokeURL;
    selector = this.metamaskButton;
    argument = "next and confirm";
    await basePage.goTo(revokeUrl);
    await basePage.clickByText("Connect Wallet");
    await metamaskPage.operateTransaction(selector, argument);
  }

  async logout() {
    const basePage = new BasePage(this.world);
    await this.clickByMenuWalletButton();
    await basePage.clickByText("Disconnect");
  }

  async checkNetworkForRevoke(network: string) {
    const helper = await new Helper(this.world);
    const selector = `${this.networkSelectorsListForRevoke}/..//img[@alt='${network}']`;
    result = await helper.checkElementVisible(selector);
    return result;
  }

  async clickByMenuWalletButton() {
    selector = this.menuWalletButton;
    await this.click(selector);
  }

  async revokeAllowance() {
    metamaskPage = await new MetamaskPage(this.world);
    const helper = await new Helper(this.world);
    const networkChainId = "?chainId=5"; // Goerli
    const revokeGoerliUrl = "https://revoke.cash/address/" + address + networkChainId;
    argument = "networkSwitch";
    const networkForRevokeIsSelected = await this.checkNetworkForRevoke("Goerli");
    if (!networkForRevokeIsSelected) {
      await this.goTo(revokeGoerliUrl);
    }
    await setTimeout(config.defaultTimeout.timeout);
    selector = await this.revokeButton("Switch Network");
    const switchNetworkIsVisible = await helper.checkElementVisible(selector);
    if (switchNetworkIsVisible) {
      await metamaskPage.operateTransaction(selector, argument);
    }

    await setTimeout(config.defaultTimeout.timeout);
    argument = "confirm";
    selector = await this.revokeButton("Revoke");
    const revokeButtonIsVisible = await helper.checkElementVisible(selector);
    if (revokeButtonIsVisible) {
      await metamaskPage.operateTransaction(selector, argument);
      await this.revokeAllowance();
    }

    selector = await this.revokeButton("Revoking");
    const revokingButtonIsVisible = await helper.checkElementVisible(selector);
    if (revokingButtonIsVisible) {
      await helper.checkSelectorHidden(selector, config.increasedTimeout.timeout);
    }
  }
}
