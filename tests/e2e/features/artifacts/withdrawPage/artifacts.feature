@withdraw @regression @artifacts @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

  @id1382
  Scenario: Withdraw - Send - Artifacts
    When I go to "Withdraw" transaction section
    When I click by "text" with "Your account" value
    When I confirm the network switching
    Then Element with "text" "Send to" should be "visible"
    # 0x5aA876bC32BC76EFf5124b19744B5B3C38b35537 - 2nd wallet address
    Then Element with "text" "0xa439ba06dA84AFc566Ee710Ba12541A73e3a1046" should be "visible"
    Then Element with "class" "amount-input-field" should be "visible"
    Then Element with "class" "amount-input-field" should be "clickable"
    Then Element with "alt" "ETH token icon" should be "visible"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "class" "break-all" should be "visible"
    Then Element with "data-testid" "token-dropDown" should be "visible"
    Then Element with "data-testid" "token-dropDown" should be "clickable"
    Then Element with "class" "amount-input-max-button" should be "visible"
    Then Element with "class" "amount-input-max-button" should be "clickable"
    Then Element with "text" " Continue " should be "disabled"
    Then Element with "text" " Continue " should be "visible"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Then Element with "text" " Continue " should be "clickable"

  @id1395
  Scenario: Withdraw - Confirm transaction modal - Artifacts
    Given I am on the Main page
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I confirm the network switching
    When I choose "ETH" as token and insert "0.0001" as amount
    When I click by text " Continue "
    Then Element with "text" "Confirm transaction" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"
    Then Element with "text" "Your zkSync Era Testnet account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0xa439...046']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='ETH token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x000000...00A']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[@src='https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/eth.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615']" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class,'fee-details-container') and //span[contains(text(),'Fee')]]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class,'fee-details-container') and //span[contains(text(),'Total to pay')]]" xpath should be "visible"
    Then Modal card element with the "//*[text()=' Arriving in ~24 hours ']" xpath should be "visible"
    Then Modal card element with the "//*[text()=' Arriving in ~24 hours ']" xpath should be "clickable"
    Then Element with "text" "Send to Ethereum Goerli" should be "visible"
    Then Element with "text" "Send to Ethereum Goerli" should be "clickable"

  @id1644:I @tokens @testnet
  Scenario: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/withdraw/?network=era-goerli"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"
    Then Element with "class" "token-balance-amount" should be "visible"
    Then Element with "class" "token-balance-price" should be "visible"

  @id1644:II @tokens @testnet
  Scenario Outline: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/withdraw/?network=era-goerli"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "<TokenName>" should be "visible"
    Then Element with "partial src" "<img>" should be "visible"
    Then Element with "text" "<TokenAddress>" should be "visible"

    Examples:
      | TokenName | TokenAddress   | img      |
      | ETH       | 0x000000...00A | eth.svg  |
      | DAI       | 0x3e7676...D4b | dai.svg  |
      | LINK      | 0x406091...c78 | link.svg |
      | USDC      | 0x0faF6d...2A9 | usdc.svg |
      | wBTC      | 0x0BfcE1...e9c | wbtc.svg |

  @id1642:I @tokens @mainnet
  Scenario: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/withdraw/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"

  @id1642:II @tokens @mainnet
  Scenario Outline: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/withdraw/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "<TokenName>" should be "visible"
    Then Element with "text" "<TokenAddress>" should be "visible"
    Then Element with "partial src" "<img>" should be "visible"
    Examples:
      | TokenName | TokenAddress   | img        |
      | ETH       | 0x000000...00A | eth.svg    |
      | USDC      | 0x3355df...af4 | usdc.svg   |
      | MUTE      | 0x0e97C7...d42 | mute.svg   |
      | COMBO     | 0xc2B13B...8E3 | combo.svg  |
      | PERP      | 0x42c1c5...601 | perp.svg   |
      | LUSD      | 0x503234...115 | lusd.svg   |
      | DVF       | 0xBbD1bA...716 | dvf.svg    |
      | WOO       | 0x9E22D7...159 | woo.svg    |
      | xcRMRK    | 0x6F1A89...545 | xcrmrk.svg |
      | DERI      | 0x140D5b...803 | deri.svg   |
      | DEXTF     | 0x9929bC...e41 | dextf.svg  |
      | GOVI      | 0xD63eF5...044 | govi.svg   |
      | 1INCH     | 0x3f0B8B...e59 | 1inch.svg  |
      | SIS       | 0xdd9f72...827 | sis.svg    |
      | LQTY      | 0xf755cF...401 | lqty.svg   |
      | PEPE      | 0xFD282F...c71 | pepe.svg   |
      | rETH      | 0x32Fd44...806 | reth.svg   |
      | RPL       | 0x1CF855...5BC | rpl.svg    |
      | UFI       | 0xa0C1BC...dAE | ufi.svg    |
      | cbETH     | 0x75Af29...ED5 | cbeth.svg  |
      | RAISE     | 0x3D79F1...46f | raise.svg  |
      | LSD       | 0x458A2E...bD4 | lsd.svg    |
      | ETHx      | 0x668cc2...39c | ethx.svg   |
      | WBTC      | 0xBBeB51...011 | wbtc.svg   |
      | KNC       | 0x6ee46C...3e6 | wbtc.svg   |
      | BEL       | 0xB83CFB...2D9 | bel.png    |
      | ZZ        | 0x1ab721...184 | zz.png     |