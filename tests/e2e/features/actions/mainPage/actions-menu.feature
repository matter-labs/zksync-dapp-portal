@action @smoke @regression
Feature: Menu

  Background:
    Given Connect Metamask extension with login action

  @id1484
  Scenario: Check Logout
    Given I am on the Main page
    When I click by "partial class" with "account-name" value
    When I click by the "Logout" text element on the Menu
    Then Element with "text" "Connect your Ethereum wallet to zkSync Portal" should be "visible"
    Then Element with "testId" "network-switcher" should be "visible"
    Then Element with "title" "zkSync Portal GitHub page" should be "visible"

