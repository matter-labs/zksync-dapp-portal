import { BasePage } from "./base.page";

import type { ICustomWorld } from "../support/custom-world";
let selector: string;
export class ContactsPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  async fill(inputFieldName: string, text: string) {
    if (inputFieldName === "Address or ENS or contact name" || inputFieldName === "Ethereum address") {
      selector = await this.returnElementByType("placeholder", inputFieldName);
    } else {
      console.error("An incorrect value of the input field has been provided");
    }
    await this.fill(selector, text);
  }
}
