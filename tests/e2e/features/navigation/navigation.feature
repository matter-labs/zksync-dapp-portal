@navigation @regression
Feature: Navigation

  Background:
    Given Connect Metamask extension with login action

  @id1546 @emptyWallet @various
  Scenario: Check navigation for the Faucet page (empty wallet)
    Given I am on the Main page
    When I click by text " Get free test tokens "
    Then Current page have "/transaction/zksync/era/faucet" address

  @id1547
  Scenario: Check navigation for the Faucet page (fulfilled wallet)
    Given I am on the Main page
    When I click by "xpath" with "//a[text()='Receive']" value
    Then Element with "text" "Receive test tokens" should be "visible"
    Then Element with "text" "Receive test tokens" should be "clickable"
    Then Element with "text" "Use official faucet to get test tokens" should be "visible"
    When I click by text "Receive test tokens"
    Then Current page have "/transaction/zksync/era/faucet" address

  @id1543
  Scenario: Check navigation for the 404 page
    Given I go to page "/a"
    When I click by text "Back to Portal"
    Then Current page have "/" address
