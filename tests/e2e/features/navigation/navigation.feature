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
    Given I go to page "/transactions/?network=era-goerli"
    When I click by "<Selector type>" with "<Selector value>" value
    Then Current page have "<url>" address

    Examples:
      | Selector type | Selector value               | url                        |
      | xpath         | //a[text()='View all']       | /transactions/all              |
      | xpath         | //a[text()='Send']           | /transaction/zksync/era    |

  @id1492:II
  Scenario: Check navigation for the Transactions page
    Given I go to page "/transactions/?network=era-goerli"
    When I click by "<Selector type>" with "<Selector value>" value
    Then New page has "<url>" partial address

    Examples:
      | Selector type | Selector value              | url                                     |
      | class         | line-button-with-img-icon   | https://goerli.explorer.zksync.io/tx    |

  @id1430:I
  Scenario Outline: Check Navigation for the "Send" page links
    Given I am on the Main page
    When I click by text "Send"
    When I click by text "<Button name>"
    Then Current page have "<url>" address

    Examples:
      | Button name         | url                                     |
      | zkSync Era Testnet  | /transaction/zksync/era/send            |
      | Ethereum Goerli     | /transaction/zksync/era/withdraw        |
      | zkSync Lite Goerli  | /transaction/zksync/era/send-lite       |

  @id1430:II
  Scenario Outline: Check Navigation for the "Where to Send" page links
    Given I am on the Main page
    When I click by text "Send"
    When I click by text "Official bridge"
    When I click by text "I understand the risks of losing funds"
    When I click on the "Proceed" button
    Then Current page have "/transaction/zksync/era/withdraw" address

  @id1638
  Scenario Outline: Check Redirection for the "Out of funds" Faucet links
    Given I go to page "/transaction/zksync/era/faucet/?network=era-goerli"
    When I click by text "<Button name>"
    Then New page has "<url>" address

    Examples:
      | Button name                                   | url                                                   |
      | following the instructions from our docs      | https://era.zksync.io/docs/tools/testing/             |
      | Chainstack faucet                             | https://faucet.chainstack.com/zksync-testnet-faucet   |
      | QuickNode faucet                              | https://faucet.quicknode.com/ethereum/goerli          |
      | PoW faucet                                    | https://goerli-faucet.pk910.de/                       |

  @1489:I @mainnet
  Scenario Outline: Check navigation from networks dropdown
    When I go to page "/?network=era-mainnet"
    When I click by "text" with "Era Mainnet" value
    # Check visual presence of the network options
    Then Element with "text" "<Network name>" should be "visible"
    # Check URL changes
    Then I click by text "<Network name>"
    Then Current page have "<Network URL>" address
    Examples:
      | Network name        | Network URL            |
      | zkSync Era Testnet  | /?network=era-goerli   |
      | zkSync Lite Goerli  | /?network=lite-goerli  |

  @1489:II @testnet
  Scenario Outline: Check navigation from networks dropdown
    When I go to page "/?network=era-goerli"
    When I click by "text" with "Era Testnet" value
    # Check visual presence of the network options
    Then Element with "text" "<Network name>" should be "visible"
    # Check URL changes
    Then I click by text "<Network name>"
    Then Current page have "<Network URL>" address
    Examples:
      | Network name        | Network URL            |
      | zkSync Era Mainnet  | /?network=era-mainnet  |
      | zkSync Lite Mainnet | /?network=lite-mainnet |