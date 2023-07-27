import { BasePage } from "./base.page";

import type { ICustomWorld } from "../support/custom-world";
let selector: string;

export class ContactsPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get sendBtnModal() {
    return "//*[@class='modal-card']//a[contains(@href, '/transaction/send?address=')]";
  }

  get contactsPageContent() {
    return "//*[@class='app-layout-main']";
  }

  get editBtnModal() {
    return "//*[@class='buttons-line-group']//button[1]";
  }

  get removeBtnModal() {
    return "//*[text()='Remove']";
  }

  get areYouSureRemoveBtnModal() {
    return "//*[text()='Are you sure?']";
  }

  get savedContact() {
    return "your-account";
  }

  get modalCard() {
    return "//*[@class='modal-card']";
  }

  get headerTextModal() {
    return `${this.modalCard}//div[text()='Add contact']`;
  }

  async contactNameModal(contactName: string) {
    return `${this.modalCard}//div[text()='${contactName}']`;
  }

  async addressModal(address: string) {
    return `${this.modalCard}//div[text()='${address}']`;
  }

  async contactItem(contactName: string) {
    return `${this.contactsPageContent}//div[text()='${contactName}']`;
  }

  async fillContactFields(inputFieldName: string, text: string) {
    if (inputFieldName == "Name of the contact" || inputFieldName == "Ethereum address") {
      selector = `//*[@placeholder="${inputFieldName}"]`;
    } else {
      return console.error("An incorrect value of the input field has been provided");
    }
    await this.world.page?.fill(selector, text);
  }

  async pressSendBtnModal() {
    await this.click(this.sendBtnModal);
  }

  async pressEditBtnModal() {
    await this.click(this.editBtnModal);
  }

  async pressRemoveBtnModal() {
    await this.click(this.removeBtnModal);
  }

  async pressAreYouSureRemoveBtnModal() {
    await this.click(this.areYouSureRemoveBtnModal);
  }

  async clickOnSavedContact() {
    await this.click(this.savedContact, true);
  }
}
