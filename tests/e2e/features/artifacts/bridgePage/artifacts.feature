@bridge @bridgePage @regression @smoke @artifacts
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

  @id1602
  Scenario: Check the Account Dropdown Artifacts on the Bridge Page
    Given I go to page "/bridge"
    #click on the account dropdown
    When I click by partial text "..."
    Then Modal card element with the "//*[contains(@class, 'address-avatar')]" xpath should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Modal card element with the "//*[contains(text(),'0xa439...046')]" xpath should be "visible"
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
    Given I go to page "/bridge"
    #click on the account dropdown
    When I click by partial text "..."
    Then Element with "text" "Bridge network" should be "visible"
    Then I click by text "Bridge network"
    Then Modal card element with the "//*[text()='zkSync Era Testnet']" xpath should be "visible"
    Then Modal card element with the "//*[text()='zkSync Era Mainnet']" xpath should be "visible"


  @id1604:I
  Scenario: Check the View on Explorer Artifacts on the Bridge Page (Testnet)
    Given I go to page "/bridge"
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