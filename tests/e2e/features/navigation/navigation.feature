@navigation @regression
Feature: Navigation

  Background:
    Given Connect Metamask extension with login action

  @id1546 @emptyWallet @various
  Scenario: Check navigation for the Faucet page (empty wallet)
    Given I am on the Main page
    When I click by text " Get free test tokens "
    Then Current page have "/transaction/zksync/era/faucet" address

  @id1547
  Scenario: Check navigation for the Faucet page (fulfilled wallet)
    Given I am on the Main page
    When I click by "xpath" with "//a[text()='Receive']" value
    Then Element with "text" "Receive test tokens" should be "visible"
    Then Element with "text" "Receive test tokens" should be "clickable"
    Then Element with "text" "Use official faucet to get test tokens" should be "visible"
    When I click by text "Receive test tokens"
    Then Current page have "/transaction/zksync/era/faucet" address

  @id1543
  Scenario: Check navigation for the 404 page
    Given I go to page "/a"
    When I click by text "Back to Portal"
    Then Current page have "/" address

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

  @id1492:I
  Scenario: Check navigation for the Transactions page
    Given I go to page "/payments/?network=era-goerli"
    When I click by "<Selector type>" with "<Selector value>" value
    Then Current page have "<url>" address

    Examples:
      | Selector type | Selector value               | url                        |
      | xpath         | //a[text()='View all']       | /payments/all              |
      | xpath         | //a[text()='Send']           | /transaction/zksync/era    |

  @id1492:II
  Scenario: Check navigation for the Transactions page
    Given I go to page "/payments/?network=era-goerli"
    When I click by "<Selector type>" with "<Selector value>" value
    Then New page has "<url>" partial address

    Examples:
      | Selector type | Selector value              | url                                     |
      | class         | line-button-with-img-icon   | https://goerli.explorer.zksync.io/tx    |
      