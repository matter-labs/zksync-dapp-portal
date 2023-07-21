@artifacts @regression @depositPage @tokens
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1435:I @tokens
  Scenario: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"

  @id1435:I @tokens
  Scenario Outline: Check artifacts on tokens dropdown on Deposit page (Testnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "<TokenName>" should be "visible"
    Then Element with "src" "<img>" should be "visible"
    Then Element with "text" "<TokenAddress>" should be "visible"

    Examples:
      | TokenName | TokenAddress   | img                                                                                                                                   |
      | ETH       | 0x000000...00A | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/eth.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615  |
      | DAI       | 0x3e7676...D4b | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/dai.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615  |
      | LINK      | 0x406091...c78 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/link.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615 |
      | USDC      | 0x0faF6d...2A9 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/usdc.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615 |
      | wBTC      | 0x0BfcE1...e9c | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/wbtc.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615 |

  @id1435:II @tokens
  Scenario: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"

  @id1435:III @tokens
  Scenario Outline: Check artifacts on tokens dropdown on Deposit page (Mainnet)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "<TokenName>" should be "visible"
    Then Element with "src" "<img>" should be "visible"
    Then Element with "text" "<TokenAddress>" should be "visible"
    Examples:
      | TokenName | TokenAddress   | img                                                                                                                                                                                                                                              |
      | ETH       | 0x000000...00A | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/eth.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615                                                                                                             |
      | USDC      | 0x3355df...af4 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/usdc.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615                                                                                                            |
      | MUTE      | 0x0e97C7...d42 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/mute.svg?alt=media&token=91b36efd-93fe-4e05-86dd-b97890f5f137                                                                                                            |
      | COMBO     | 0xc2B13B...8E3 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/combo.svg?alt=media&token=beb166a2-a1bf-4935-9a7f-60219174feec                                                                                                           |
      | PERP      | 0x42c1c5...601 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/perp.svg?alt=media&token=03fa3dd9-123d-4a42-9885-6ae8e982a596                                                                                                            |
      | LUSD      | 0x503234...115 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/lusd.svg?alt=media&token=0bafb7c1-d75a-4cc0-8d2c-a966ba5229ce                                                                                                            |
      | DVF       | 0xBbD1bA...716 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/dvf.svg?alt=media&token=2b99f719-6730-4a6e-8e98-7eadb4222010                                                                                                             |
      | WOO       | 0x9E22D7...159 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/woo.svg?alt=media&token=e7e86642-a227-4bd5-8237-3e5c538146d6                                                                                                             |
      | xcRMRK    | 0x6F1A89...545 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/xcrmrk.svg?alt=media&token=5571f6c7-94e2-4a4e-9178-21c3f85b1114                                                                                                          |
      | DERI      | 0x140D5b...803 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/deri.svg?alt=media&token=f9373638-b7d7-4e5f-aeeb-52e0429d20d7                                                                                                            |
      | DEXTF     | 0x9929bC...e41 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/dextf.svg?alt=media&token=1793cf4c-6933-42c0-a4a3-20ddbc7db753                                                                                                           |
      | GOVI      | 0xD63eF5...044 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/govi.svg?alt=media&token=82358649-c6cb-4f3e-ba13-fbb70d1d801f                                                                                                            |
      | 1INCH     | 0x3f0B8B...e59 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/1inch.svg?alt=media&token=4e354096-c9d5-4c7a-9da1-1ecfc715278f                                                                                                           |
      | SIS       | 0xdd9f72...827 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/sis.svg?alt=media&token=6e0275e9-3766-4b00-86d2-6057f16263fb                                                                                                             |
      | LQTY      | 0xf755cF...401 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/lqty.svg?alt=media&token=97cdbfff-eff5-443c-952b-c922464d988f                                                                                                            |
      | PEPE      | 0xFD282F...c71 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/pepe.svg?alt=media&token=f0368359-659a-46bc-a7b9-c419f9150fcd                                                                                                            |
      | rETH      | 0x32Fd44...806 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/reth.svg?alt=media&token=05c2bfe7-2967-4db1-9e0d-bbd49cace416                                                                                                            |
      | RPL       | 0x1CF855...5BC | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/rpl.svg?alt=media&token=d00177fb-503a-45fe-bd50-dea7a4b7c32e                                                                                                             |
      | UFI       | 0xa0C1BC...dAE | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/ufi.svg?alt=media&token=1e2c543a-e2ff-4598-8722-f6fc9556b62d                                                                                                             |
      | cbETH     | 0x75Af29...ED5 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/cbeth.svg?alt=media&token=e4bf7157-cc82-4300-aa6f-8d0a0dc044f7                                                                                                           |
      | RAISE     | 0x3D79F1...46f | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/raise.svg?alt=media&token=79740de5-ac54-437b-a982-aec0a5b62361                                                                                                           |
      | LSD       | 0x458A2E...bD4 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/lsd.svg?alt=media&token=8f20e143-4862-457e-9d7c-36da9676845f                                                                                                             |
      | ETHx      | 0x668cc2...39c | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/ethx.svg?alt=media&token=362fe1c5-afb4-47cf-b766-c27aa11bde89&_gl=1*148cy0l*_ga*MTQ3NTc0NTE3Ni4xNjg2MDM4NzMy*_ga_CW55HF8NVT*MTY4NjYzODQ4Ny4xMy4xLjE2ODY2Mzg1NTguMC4wLjA. |
      | WBTC      | 0xBBeB51...011 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/wbtc.svg?alt=media&token=502e8eee-d36a-4460-a97b-dad3e387cddd                                                                                                            |
      | KNC       | 0x6ee46C...3e6 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/wbtc.svg?alt=media&token=502e8eee-d36a-4460-a97b-dad3e387cddd                                                                                                            |
      | BEL       | 0xB83CFB...2D9 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/bel.png?alt=media&token=f8bbcfc2-6037-4626-870b-6a3b6630554b                                                                                                             |
      | ZZ        | 0x1ab721...184 | https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/zz.png?alt=media&token=dc866379-92a9-4d85-9173-dad0076046b1                                                                                                              |

  @id1564 @id1436 @tokens
  Scenario:  Check search functionality for Choose Tokens
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    Then I fill the "data-testid=search_tokens" input field by "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
    Then Element with "text" "USDC" should be "visible"
    Then I fill the "data-testid=search_tokens" input field by "0xd35CCeEAD182dcee0F148EbaC9447DAas2c4D449c4"
    #Then Element with "partial text" "No tokens was found for" should be "visible"
    #Then Element with "partial text" "0xd35CCeEAD182dcee0F148EbaC9447DAas2c4D449c4" should be "visible"
    Then Element with "partial text" "Make sure you are using correct zkSync network" should be "visible"

