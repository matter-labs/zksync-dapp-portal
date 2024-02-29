import { Helper } from "../helpers/helper";
import { config, wallet } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";
import { MetamaskPage } from "./metamask.page";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get notificationBtn() {
    return "//button[2]";
  }

  get loginBtn() {
    return `${this.byTestId}login-button`;
  }

  get mainTitle() {
    return "//h1[text()='zkSync Portal']";
  }

  async connectMetamask() {
    const helper = await new Helper(this.world);
    const loginStatus = await this.checkLoginStatus();
    const wallet_password = await helper.decrypt(wallet.password);

    if (!loginStatus) {
      const metamaskPage = await new MetamaskPage(this.world);

      await this.world.page?.waitForSelector(this.loginBtn);
      await this.world.page?.locator(this.loginBtn).click(config.increasedTimeout); // click a login button

      const popUp = await new MetamaskPage(this.world).catchPopUpByClick(":text('Browser Wallet')");
      await popUp?.locator(metamaskPage.unlockPasswordField).isVisible(config.defaultTimeout);
      await popUp?.setViewportSize(config.popUpWindowSize);
      const passwordFieldVisible = await popUp
        ?.locator(metamaskPage.unlockPasswordField)
        .isVisible(config.defaultTimeout);
      if (passwordFieldVisible) {
        await popUp?.locator(metamaskPage.unlockPasswordField).fill(wallet_password);
        await popUp?.locator(metamaskPage.confirmUnlockBtn).click();
      }
      await popUp?.waitForTimeout(700);

      if (popUp !== undefined) {
        try {
          await popUp?.locator(this.notificationBtn).click();
          await popUp?.locator(this.notificationBtn).click();

          if ((await popUp?.locator(this.notificationBtn)) !== undefined) {
            await popUp?.locator(this.notificationBtn).click(); // change network
          }
        } catch {
          return false;
        }
      }
    } else if (!(await this.actualNetworkIsGoerli())) {
      await this.world.page?.goto(config.BASE_URL + config.DAPP_NETWORK);
      await this.world.page?.waitForLoadState("load");
    }
  }

  async logout() {
    await this.world.page?.evaluate(() => window.localStorage.clear());
    await this.world.page?.waitForTimeout(500);
    await this.world.page?.reload();
    await this.world.page?.waitForURL(config.BASE_URL);
  }

  async checkLoginStatus() {
    let result = await this.world.page?.evaluate(() => window.localStorage["wagmi.wallet"]);

    if (result == '"injected"') {
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  async actualNetworkIsGoerli() {
    let result = await this.world.page?.evaluate(() => window.localStorage.lastSelectedEthereumNetwork);

    if (result == "goerli") {
      result = true;
    } else {
      result = false;
    }
    return result;
  }
}
