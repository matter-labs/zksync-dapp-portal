@artifacts @regression @transferPage
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1646:I @tokens @testnet
  Scenario: Check artifacts on tokens dropdown on Transfer page (Testnet)
    Given I go to page "/transaction/zksync/era/send?network=era-goerli&address=0x47BCD42B8545c23031E9918c3D823Be4100D4e87"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"
    Then Element with "class" "token-balance-amount" should be "visible"
    Then Element with "class" "token-balance-price" should be "visible"

  @id1646:II @tokens @testnet
  Scenario Outline: Check artifacts on tokens dropdown on Transfer page (Testnet)
    Given I go to page "/transaction/zksync/era/send?network=era-goerli&address=0x47BCD42B8545c23031E9918c3D823Be4100D4e87"
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


  @id1645 @tokens @mainnet
  Scenario: Check artifacts on tokens dropdown on Transfer page (Mainnet)
    Given I go to page "/transaction/zksync/era/send?network=era-mainnet&address=0x47BCD42B8545c23031E9918c3D823Be4100D4e87"
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "placeholder" "Symbol or address" should be "visible"
    Then Element with "class" "token-balance-amount" should be "visible"
    #ETH
    Then Element with "text" "ETH" should be "visible"
    Then Element with "text" "0x000000...00A" should be "visible"
    Then Element with "partial src" "eth.svg" should be "visible"
    #USDC
    Then Element with "text" "USDC" should be "visible"
    Then Element with "text" "0x3355df...af4" should be "visible"
    Then Element with "partial src" "usdc.svg" should be "visible"
    #MUTE
    Then Element with "text" "MUTE" should be "visible"
    Then Element with "text" "0x0e97C7...d42" should be "visible"
    Then Element with "partial src" "mute.svg" should be "visible"
    #COMBO
    Then Element with "text" "COMBO" should be "visible"
    Then Element with "text" "0xc2B13B...8E3" should be "visible"
    Then Element with "partial src" "combo.svg" should be "visible"
    #PERP
    Then Element with "text" "PERP" should be "visible"
    Then Element with "text" "0x42c1c5...601" should be "visible"
    Then Element with "partial src" "perp.svg" should be "visible"
    #LUSD
    Then Element with "text" "LUSD" should be "visible"
    Then Element with "text" "0x503234...115" should be "visible"
    Then Element with "partial src" "lusd.svg" should be "visible"
    #DVF
    Then Element with "text" "DVF" should be "visible"
    Then Element with "text" "0xBbD1bA...716" should be "visible"
    Then Element with "partial src" "dvf.svg" should be "visible"
    #WOO
    Then Element with "text" "WOO" should be "visible"
    Then Element with "text" "0x9E22D7...159" should be "visible"
    Then Element with "partial src" "woo.svg" should be "visible"
    #xcRMRK
    Then Element with "text" "xcRMRK" should be "visible"
    Then Element with "text" "0x6F1A89...545" should be "visible"
    Then Element with "partial src" "xcrmrk.svg" should be "visible"
    #DERI
    Then Element with "text" "DERI" should be "visible"
    Then Element with "text" "0x140D5b...803" should be "visible"
    Then Element with "partial src" "deri.svg" should be "visible"
    #DEXTF
    Then Element with "text" "DEXTF" should be "visible"
    Then Element with "text" "0x9929bC...e41" should be "visible"
    Then Element with "partial src" "dextf.svg" should be "visible"
    #GOVI
    Then Element with "text" "GOVI" should be "visible"
    Then Element with "text" "0xD63eF5...044" should be "visible"
    Then Element with "partial src" "govi.svg" should be "visible"
    #1INCH
    Then Element with "text" "1INCH" should be "visible"
    Then Element with "text" "0x3f0B8B...e59" should be "visible"
    Then Element with "partial src" "1inch.svg" should be "visible"
    #SIS
    Then Element with "text" "SIS" should be "visible"
    Then Element with "text" "0xdd9f72...827" should be "visible"
    Then Element with "partial src" "sis.svg" should be "visible"
    #LQTY
    Then Element with "text" "LQTY" should be "visible"
    Then Element with "text" "0xf755cF...401" should be "visible"
    Then Element with "partial src" "lqty.svg" should be "visible"
    #PEPE
    Then Element with "text" "PEPE" should be "visible"
    Then Element with "text" "0xFD282F...c71" should be "visible"
    Then Element with "partial src" "pepe.svg" should be "visible"
    #rETH
    Then Element with "text" "rETH" should be "visible"
    Then Element with "text" "0x32Fd44...806" should be "visible"
    Then Element with "partial src" "reth.svg" should be "visible"
    #RPL
    Then Element with "text" "RPL" should be "visible"
    Then Element with "text" "0x1CF855...5BC" should be "visible"
    Then Element with "partial src" "rpl.svg" should be "visible"
    #UFI
    Then Element with "text" "UFI" should be "visible"
    Then Element with "text" "0xa0C1BC...dAE" should be "visible"
    Then Element with "partial src" "ufi.svg" should be "visible"
    #cbETH
    Then Element with "text" "cbETH" should be "visible"
    Then Element with "text" "0x75Af29...ED5" should be "visible"
    Then Element with "partial src" "cbeth.svg" should be "visible"
    #RAISE
    Then Element with "text" "RAISE" should be "visible"
    Then Element with "text" "0x3D79F1...46f" should be "visible"
    Then Element with "partial src" "raise.svg" should be "visible"
    #LSD
    Then Element with "text" "LSD" should be "visible"
    Then Element with "text" "0x458A2E...bD4" should be "visible"
    Then Element with "partial src" "lsd.svg" should be "visible"
    #ETHx
    Then Element with "text" "ETHx" should be "visible"
    Then Element with "text" "0x668cc2...39c" should be "visible"
    Then Element with "partial src" "ethx.svg" should be "visible"
    #WBTC
    Then Element with "text" "WBTC" should be "visible"
    Then Element with "text" "0xBBeB51...011" should be "visible"
    Then Element with "partial src" "wbtc.svg" should be "visible"
    #KNC
    Then Element with "text" "KNC" should be "visible"
    Then Element with "text" "0x6ee46C...3e6" should be "visible"
    Then Element with "partial src" "wbtc.svg" should be "visible"
    #BEL
    Then Element with "text" "BEL" should be "visible"
    Then Element with "text" "0xB83CFB...2D9" should be "visible"
    Then Element with "partial src" "bel.png" should be "visible"
    #ZZ
    Then Element with "text" "ZZ" should be "visible"
    Then Element with "text" "0x1ab721...184" should be "visible"
    Then Element with "partial src" "zz.png" should be "visible"

  @id1537 @id1404
  Scenario: Check artifacts on Transaction submitted pop up/Transaction completed pop up (Transfer)
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/send?network=era-goerli&address=0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to zkSync Era Testnet" button
    #Transaction submitted pop up - id1537
    Then Message "Transaction submitted" should be visible
    Then Submitted transaction animation should be visible
    Then Element with "text" " Track status " should be "visible"
    #Transaction completed pop up - id1404
    Then Message "Transaction completed" should be visible
    Then The Green success mark should be visible
    Then Element with "text" "Send" should be "visible"
    #Time of tx
    Then Element with "class" "button-line-body-info-underline" should be "visible"
    Then Element with "text" "0.0000000001" should be "visible"
    Then Modal card element with the "//*[text()='ETH']" xpath should be "visible"
    #Token icon
    Then Modal card element with the "//*[contains(@src, 'eth.svg')]" xpath should be "visible"
    Then Modal card element with the "//*[text()='<$0.01']" xpath should be "visible"
    Then Arrow element for "Transfer" external link should be "visible"
    Then Arrow element for "Transfer" external link should be "clickable"
    Then Element with "text" " Your funds should now be available at the " should be "visible"
    Then Element with "text" "destination address" should be "visible"
    Then Element with "text" "destination address" should be "clickable"
    Then Element with "text" " Make another transaction " should be "visible"
    Then Element with "text" " Go to Assets page " should be "visible"

  @id1364 @id1343  @transfer
  Scenario: Check artifacts on the Send to page - Transfer
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/send/?address=0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d"
    Then Element with "text" "Send to" should be "visible"
    Then Element with "text" "0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d" should be "visible"
    Then Element with "testId" "token-dropDown" should be "visible"
    Then Element with "testId" "token-dropDown" should be "clickable"
    #Balance
    Then Element with "text" " Balance: " should be "visible"
    Then Element with "class" "break-all" should be "visible"
    #Max button
    Then Element with "partial text" "Max" should be "visible"
    Then Element with "partial text" "Max" should be "clickable"
    #Value field
    Then Element with "id" "amount-input" should be "visible"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "testId" "fee-amount" should be "visible"
    Then Fee "should" have "$" value
    Then Fee "should" have "ETH" value
    Then Circle timer for fee updating should be visible
    When I confirm the network switching
    Then Element with "text" " Continue " should be "visible"

  @id1566 @Transfer
  Scenario: Check artifacts on the Confirm transaction modal - Transfer
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/send/?address=0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d"
    When I choose "ETH" as token and insert "0.0001" as amount
    When I confirm the network switching
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Confirm transaction" should be "visible"
    Then Element with "text" "Your zkSync Era Testnet account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0x2CF4...75d']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='ETH token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x000000...00A']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[contains(@src, 'eth.svg')]" xpath should be "visible"
    #"Fee:" block
    Then Modal card element with the "//*[contains(text(),'Fee:')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, 'my-2')]//button[contains(., '$')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, 'my-2')]//button[contains(., 'of')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, 'my-2')]//*[contains(@src, 'eth.svg')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, 'my-2')]//button[contains(., 'ETH')]" xpath should be "visible"
    #"Total to pay:" block
    Then Modal card element with the "//*[contains(text(),'Total to pay:')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, '-my-0.5')]//button[contains(., '$')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, '-my-0.5')]//button[contains(., 'of')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, '-my-0.5')]//*[contains(@src, 'eth.svg')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class, '-my-0.5')]//button[contains(., 'ETH')]" xpath should be "visible"
    Then Element with "text" "Send to zkSync Era Testnet" should be "visible"
    Then Element with "text" "Send to zkSync Era Testnet" should be "clickable"

  @id1286 @transfer
  Scenario: Check max button functionality
    When I go to page "/transaction/zksync/era/send/?address=0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d&network=era-goerli"
    Then I confirm the network switching
      #Max button is displayed
    Then Element with "partial text" "Max" should be "visible"
    Then Element with "partial text" "Max" should be "clickable"
       # Check hover tooltip
    Then Element with "partial title" "Your max amount is" should be "visible"
       #Get the Max input value (Step to receive max value for comparison)
    When I choose "ETH" as token and insert "100000000" as amount
    When I save Max Balance Error Value
    Then Max amount is set to the input field
        # Verify "Max" button is highlighted after clicking on it
    Then I click by "text" with " Max " value
    Then Element with "partial class" "is-max" should be "visible"

  @id1538 @transfer
  Scenario: Check Transaction submitted window redirection links
    When I go to page "/transaction/zksync/era/send/?address=0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d"
    # Fill all the required fields for tx and to see Submitted window
    Then I choose "ETH" as token and insert "0.00000001" as amount
    When I "confirm" transaction after clicking "Send to zkSync Era Testnet" button
    #Links check
    Then Element with "href" "https://goerli.explorer.zksync.io/address/0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d" should be "clickable"
    Then I click by "href" with "https://goerli.explorer.zksync.io/address/0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d" value
    Then New page has "goerli.explorer.zksync.io/address/0x2CF4F78917A16C9584AeB5d4c5bD2713d724C75d" partial address
    # Check Block Explorer link
    Then Element with "partial href" "https://goerli.explorer.zksync.io/tx/" should be "clickable"
    Then I click by "partial href" with "https://goerli.explorer.zksync.io/tx/" value
    Then New page has "https://goerli.explorer.zksync.io/tx/" partial address
    # Check Make another transaction
    Then Element with "partial href" "/transaction/zksync/era" should be "clickable"
    Then I click by "partial href" with "/transaction/zksync/era" value
    Then New page has "/transaction/zksync/era" partial address
    # Check Go to Assets page
    Then Element with "href" "/" should be "clickable"
    Then I click by "href" with "/" value
    Then New page has "/" partial address
