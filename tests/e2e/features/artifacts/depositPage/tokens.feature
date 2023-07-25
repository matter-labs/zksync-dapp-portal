@artifacts @regression @depositPage @tokens
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1435:I @tokens @testnet
  Scenario: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"

  @id1435:II @tokens @testnet
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

  @id1415:I @tokens @mainnet
  Scenario: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"

  @id1415:II @tokens @mainnet
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

  @id1436 @tokens @mainnet
  Scenario:  Check search functionality for Choose Tokens (with results)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then I fill the Tokens Search Field input by "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
    Then Element with "text" "USDC" should be "visible"


  @id1564 @tokens @mainnet
  Scenario:  Check search functionality for Choose Tokens (no results)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then I fill the Tokens Search Field input by "0x3355df6D4c9C30357240e3914dE96A5a83aaf4"
    Then Element with "partial text" "Make sure you are using correct zkSync network" should be "visible"
    Then Tokens search window has next 'No tokens was found for' text visible
    Then Tokens search window has next '0x3355df6D4c9C30357240e3914dE96A5a83aaf4' text visible
    