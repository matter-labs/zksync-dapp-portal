@artifacts @regression @assets
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1332 @emptyWallet
  Scenario: Check artifacts for an empty wallet
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