@artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1332 @emptyWallet
  Scenario: Check artifacts for an empty wallet
    Given I click by "text" with "zkSync Era∎" value
    Then A wallet should be "empty"
    Then Message " You don't have any balances on " should be visible
    Then Message "zkSync Era∎ Goerli" should be visible
    Then Message " Proceed to " should be visible
    Then Message "Add funds" should be visible
    Then Message " page to add balance to your account " should be visible
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "visible"
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "clickable"
    Then Element with "href and text" "'/balances' and 'View all'" should be "visible"
    Then Element with "href and text" "'/balances' and 'View all'" should be "clickable"

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
    Then Element with "text" "Home" should be "clickable"
    Then Element with "href" "/payments" should be "visible"
    Then Element with "href" "/payments" should be "clickable"
    Then Element with "text" "Payments" should be "clickable"
    Then Element with "href" "/contacts" should be "visible"
    Then Element with "href" "/contacts" should be "clickable"
    Then Element with "text" "Contacts" should be "clickable"
    Then Element with "testId" "network-switcher" should be "visible"
    Then Element with "testId" "network-switcher" should be "clickable"

  @id1379
  Scenario: Check artifacts on the Networks switcher
    Given I click by "testId" with "network-switcher" value
    Then Message "Change network" should be visible
    Then Element with "href" "/?network=mainnet" should be "visible"
    Then Element with "href" "/?network=mainnet" should be "clickable"
    Then Element with "text" "Mainnet" should be "visible"
    Then Element with "href" "/?network=goerli" should be "visible"
    Then Element with "href" "/?network=goerli" should be "clickable"
    Then Element with "text" "Goerli Testnet" should be "visible"