@loginPage @artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1363 @loginPage
  Scenario: Check artifacts on the Login page
    Given I'm logged out
    Then Element with "text" "Connect your Ethereum wallet to zkSync Portal" should be "visible"
    Then Element with "testId" "network-switcher" should be "visible"
    Then Element with "title" "zkSync Portal GitHub page" should be "visible"