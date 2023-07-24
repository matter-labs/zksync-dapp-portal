@navigation @mainPage @authorized @smoke

Feature: Navigation on the Main Page

  Background:
    Given Connect Metamask extension with login action

  @id1288
  Scenario Outline: Check Navigation for the "Assets" links
    Given I am on the Main page
    When I click by text "<Button name>"
    Then Current page have "<url>" address


    Examples:
      | Button name       | url                                                                          |
      | Receive           | /transaction/zksync/era/receive                                              |
      | Send              | /transaction/zksync/era                                                      |
      | ETH               | /transaction/zksync/era?token=0x000000000000000000000000000000000000800A     |
      | DAI               | /transaction/zksync/era?token=0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b     |
      | LINK              | /transaction/zksync/era?token=0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78     |
      | USDC              | /transaction/zksync/era?token=0x0faF6df7054946141266420b43783387A78d82A9     |
      | wBTC              | /transaction/zksync/era?token=0x0BfcE1D53451B4a8175DD94e6e029F7d8a701e9c     |
      | View all          | /balances                                                                    |
      