@menuItems @artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1315
  Scenario: Check artifacts on a Menu address
    Then Element with "partial class" "account-name" should be "visible"
    Then Element with "partial class" "account-name" should be "clickable"
    Given I click by "partial class" with "account-name" value
    Then Element with "text" " View on explorer " should be "visible"
    Then Element with "text" " View on explorer " should be "clickable"
    Then Element with "text" " Logout " should be "visible"
    Then Element with "text" " Logout " should be "clickable"
    Then Element with "xpath" "//*[@class='copy-button' and @role='none']" should be "visible"
    Then Element with "xpath" "//*[@class='copy-button' and @role='none']" should be "clickable"

  @id1302
  Scenario: Check artifacts on a Menu items
    Then Element with "href" "/" should be "visible"
    Then Element with "href" "/" should be "clickable"
    Then Element with "href" "/transactions" should be "visible"
    Then Element with "href" "/transactions" should be "clickable"
    Then Element with "text" "Transactions" should be "clickable"
    Then Element with "href" "/contacts" should be "visible"
    Then Element with "href" "/contacts" should be "clickable"
    Then Element with "text" "Contacts" should be "clickable"
    Then Element with "testId" "network-switcher" should be "visible"
    Then Element with "testId" "network-switcher" should be "clickable"


  @id1379
  Scenario: Check artifacts on the Networks switcher
    #Given I click by "testId" with "network-switcher" value
    Given I click by "partial class" with "network-switch" value
    Then Message "Change network" should be visible
    Then Element with "text" "zkSync Era∎" should be "visible"
    Then Element with "text" " Preferred network " should be "visible"
    Then Element with "text" "zkSync Era Mainnet" should be "visible"
    Then Element with "text" "zkSync Era Testnet" should be "visible"
    Then Element with "text" "zkSync Lite" should be "visible"
    Then Element with "text" "zkSync Lite Mainnet" should be "visible"
    Then Element with "text" "zkSync Lite Goerli" should be "visible"

  @id1409:I
  Scenario: Check artifacts on the View on Explorer menu for Mainnet
    Given I go to page '/?network=era-mainnet'
    Given I click by "partial class" with "main-account-button" value
    Given I click by "text" with " View on explorer " value
    Then Element with "text" "zkSync Era Mainnet" should be "visible"
    Then Element with "text" "Ethereum Mainnet" should be "visible"
    Then Element with "text" "View on explorer" should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Element with "src" "/img/era.svg" should be "visible"
    Then Element with "src" "/img/era.svg" should be "clickable"
    Then Element with "src" "/img/ethereum.svg" should be "visible"
    Then Element with "src" "/img/ethereum.svg" should be "clickable"

  @id1409:II
  Scenario: Check artifacts on the View on Explorer menu for Era Testnet
    Given I go to page '/?network=era-goerli'
    Given I click by "partial class" with "main-account-button" value
    Given I click by "text" with " View on explorer " value
    Then Element with "text" "zkSync Era Testnet" should be "visible"
    Then Element with "text" "Ethereum Goerli Testnet" should be "visible"
    Then Element with "text" "View on explorer" should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Element with "src" "/img/era.svg" should be "visible"
    Then Element with "src" "/img/era.svg" should be "clickable"
    Then Element with "src" "/img/ethereum.svg" should be "visible"
    Then Element with "src" "/img/ethereum.svg" should be "clickable"

  @id1581:I
  Scenario: Check artifacts on the View on Explorer menu for Lite Mainnet
    Given I go to page '/?network=lite-mainnet'
    Given I click by "partial class" with "main-account-button" value
    Given I click by "text" with " View on explorer " value
    Then Element with "text" "zkSync Lite Mainnet" should be "visible"
    Then Element with "text" "Ethereum Mainnet" should be "visible"
    Then Element with "text" "View on explorer" should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Element with "src" "/img/zksync-lite.svg" should be "visible"
    Then Element with "src" "/img/zksync-lite.svg" should be "clickable"
    Then Element with "src" "/img/ethereum.svg" should be "visible"
    Then Element with "src" "/img/ethereum.svg" should be "clickable"

  @id1581:II
  Scenario: Check artifacts on the View on Explorer menu for Lite Goerli
    Given I go to page '/?network=lite-goerli'
    Given I click by "partial class" with "main-account-button" value
    Given I click by "text" with " View on explorer " value
    Then Element with "text" "zkSync Lite Goerli" should be "visible"
    Then Element with "text" "Ethereum Goerli Testnet" should be "visible"
    Then Element with "text" "View on explorer" should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Element with "src" "/img/zksync-lite.svg" should be "visible"
    Then Element with "src" "/img/zksync-lite.svg" should be "clickable"
    Then Element with "src" "/img/ethereum.svg" should be "visible"
    Then Element with "src" "/img/ethereum.svg" should be "clickable"
