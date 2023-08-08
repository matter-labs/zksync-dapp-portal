@bridge @bridgePage @regression @smoke @artifacts @richWallet
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

  @id1602
  Scenario: Check the Account Dropdown Artifacts on the Bridge Page
    Given I go to page "/bridge?network=era-goerli"
    #click on the account dropdown
    When I click by partial text "..."
    Then Modal card element with the "//*[contains(@class, 'address-avatar')]" xpath should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Modal card element with the "//*[contains(text(),'0x2CF4...75d')]" xpath should be "visible"
    Then Modal card element with the "//div[text()='zkSync Era Testnet']" xpath should be "visible"
    Then Modal card element with the "//div[text()='Bridge network']" xpath should be "visible"
    Then Element with "text" "View on Explorer" should be "visible"
    Then Element with "text" "View on Explorer" should be "clickable"
    Then Element with "text" "Logout" should be "visible"
    Then Element with "text" "Logout" should be "clickable"
    Then Modal card element with the "//button[@class='copy-button']" xpath should be "visible"
    Then Modal card element with the "//button[@class='copy-button']" xpath should be "clickable"

  @id1603
  Scenario: Check the Network Switcher Artifacts on the Bridge Page
    Given I go to page "/bridge?network=era-goerli"
    #click on the account dropdown
    When I click by partial text "..."
    Then Element with "text" "Bridge network" should be "visible"
    Then I click by text "Bridge network"
    Then Modal card element with the "//*[text()='zkSync Era Testnet']" xpath should be "visible"
    Then Modal card element with the "//*[text()='zkSync Era Mainnet']" xpath should be "visible"


  @id1604:I
  Scenario: Check the View on Explorer Artifacts on the Bridge Page (Testnet)
    Given I go to page "/bridge?network=era-goerli"
    #click on the account dropdown
    When I click by partial text "..."
    Then Element with "text" "View on Explorer" should be "visible"
    When I click by text "View on Explorer"
    Then Modal card element with the "//*[text()='View on explorer']" xpath should be "visible"
    Then Modal card element with the "//button[@data-testid='close-button']" xpath should be "visible"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Modal card element with the "//*[text()='zkSync Era Testnet']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg?v=1']" xpath should be "visible"
    Then Modal card element with the "//*[text()='Ethereum Goerli Testnet']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/ethereum.svg?v=1']" xpath should be "visible"

  @id1604:II
  Scenario: Check the View on Explorer Artifacts on the Bridge Page (Mainnet)
    Given I go to page "/bridge?network=era-mainnet"
    #click on the account dropdown
    When I click by partial text "..."
    Then Element with "text" "View on Explorer" should be "visible"
    When I click by text "View on Explorer"
    Then Modal card element with the "//*[text()='View on explorer']" xpath should be "visible"
    Then Modal card element with the "//button[@data-testid='close-button']" xpath should be "visible"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Modal card element with the "//*[text()='zkSync Era Mainnet']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg?v=1']" xpath should be "visible"
    Then Modal card element with the "//*[text()='Ethereum Mainnet']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/ethereum.svg?v=1']" xpath should be "visible"

  @id1597
  Scenario: Check the Bridge artifacts on Withdraw (Testnet)
    Given I go to page "/bridge?network=era-goerli"
    When I click by text "Withdraw"
    Then Element with "text" "Bridge" should be "visible"
    Then Element with "text" "From" should be "visible"
    Then Element with "text" "zkSync Era Testnet" should be "visible"
    Then Element with "testId" "token-dropDown" should be "visible"
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then Element with "id" "amount-input" should be "visible"
    Then Element with "id" "amount-input" should be "clickable"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "text" " Max " should be "visible"
    Then Element with "text" " Max " should be "clickable"
    #Block To:
    Then Element with "text" "Your Ethereum Goerli Testnet account" should be "visible"
    Then Element with "text" "Your Ethereum Goerli Testnet account" should be "clickable"
    Then Element with "text" "0x2CF4...75d" should be "visible"
    Then Element with "text" "0x2CF4...75d" should be "clickable"
    Then Element with "class" "address-avatar address-card-avatar" should be "visible"
    Then Element with "partial src" "ethereum.svg" should be "visible"
    #Edit button
    Then Element with "partial class" "button-with-img-icon" should be "visible"
    #Fee block
    Then Element with "testId" "fee-amount" should be "visible"
    Then Element with "partial string" "$" should be "visible"
    Then Element with "class" "circle" should be "enabled"
    Then Element with "text" "ETH" should be "visible"
    Then Element with "type" "submit" should be "visible"

  @id1613
  Scenario: Check the Bridge To artifacts on Withdraw (Testnet)
    Given I go to page "/bridge?network=era-goerli"
    When I click by text "Withdraw"
    When I click by "text" with "Your Ethereum Goerli Testnet account" value
    Then Element with "text" "Bridge to" should be "visible"
    #Back button
    Then Element with "class" "arrow-icon" should be "visible"
    Then Element with "class" "arrow-icon" should be "clickable"
    #Search field
    Then Element with "class" "small-input-field" should be "visible"
    Then Element with "placeholder" "Address or ENS or contact name" should be "visible"
    Then Element with "partial class" "small-input-icon" should be "visible"
    Then Element with "text" "0x2CF4...75d" should be "visible"
    Then Element with "text" "0x2CF4...75d" should be "clickable"
    #Warning text
    Then Element with "partial text" "When withdrawing to an exchange account, please make sure that your exchange supports transfers from smart contracts. Otherwise, this can result in" should be "visible"
    Then Element with "text" "loss of funds" should be "visible"

  @id1599
  Scenario: Check the Bridge artifacts on Withdraw: a wallet is not connected
    Given I'm logged out
    Given I go to page "/bridge?network=era-goerli"
    Then Element with "text" "Bridge" should be "visible"
    When I click by text "Withdraw"
    Then Element with "text" " Connect wallet " should be "visible"
    Then Element with "text" " Connect wallet " should be "clickable"
    Then Element with "testId" "token-dropDown" should be "visible"
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then Element with "text" "Connect wallet to see balance" should be "visible"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "partial class and text" "0" should be "visible"
    Then Element with "xpath" "//*[contains(@class,'solid') and text()=' Connect wallet ']" should be "visible"
    Then Element with "xpath" "//*[contains(@class,'solid') and text()=' Connect wallet ']" should be "clickable"