@artifacts @regression @depositPage
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1438 @deposit
  Scenario: Check artifacts on the Approve allowance modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    When I choose "DAI" as token and insert "6" as amount
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Allowance" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0xa439...046']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='DAI token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x3e7676...D4b']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[text()='Approving allowance for deposit']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg?v=1']" xpath should be "visible"
    Then Element with "partial text" " Allowance lets you safely authorize the deposit process to access a specific amount of your tokens. No funds will be deducted after signing, except for " should be "visible"
    Then Element with "partial text" "Learn more" should be "visible"
    Then Element with "partial text" "Learn more" should be "clickable"
    Then Element with "partial text" "Approve allowance" should be "visible"
    Then Element with "partial text" "Approve allowance" should be "clickable"

  @id1398 @deposit
  Scenario: Check artifacts on the Confirm transaction modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I choose "ETH" as token and insert "0.0001" as amount
    When I confirm the network switching
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Confirm transaction" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"


  @id1336 @deposit
  Scenario: Check artifacts on the Add fund to page - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    Then Element with "text" "Add funds to" should be "visible"
    Then Element with "id" "amount-input" should be "visible"
    Then Element with "text" " Balance: " should be "visible"
    Then Element with "class" "break-all" should be "visible"
    Then Element with "text" " Max " should be "visible"
    Then Element with "text" " Max " should be "clickable"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "testId" "token-dropDown" should be "visible"
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then Element with "testId" "fee-amount" should be "visible"
    Then Fee should have "$" value
    Then Fee should have "ETH" value
    Then Element with "text" " Continue " should be "visible"

  @id1641:I @tokens @testnet
  Scenario: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"
    Then Element with "class" "token-balance-amount" should be "visible"
    Then Element with "class" "token-balance-price" should be "visible"

  @id1641:II @tokens @testnet
  Scenario Outline: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
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

  @id1643:I @tokens @mainnet
  Scenario: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"

  @id1643:II @tokens @mainnet
  Scenario Outline: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
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