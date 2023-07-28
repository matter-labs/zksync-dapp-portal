@artifacts @regression @depositPage @tokens
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1436 @tokens @mainnet
  Scenario:  Check search functionality for Choose Tokens (with results)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    When I fill the element of "testId" with "search_tokens" value by "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
    Then Element with "text" "USDC" should be "visible"


  @id1564 @tokens @mainnet
  Scenario:  Check search functionality for Choose Tokens (no results)
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "testId" with "your-account" value
    Then I click by "testId" with "token-dropDown" value
    When I fill the element of "testId" with "search_tokens" value by "0x3355df6D4c9C303574Fd0e3914dE96A5a83aaf4"
    Then Element with "testId" value "warning_modal" should contain 'No tokens was found for "0x3355df6D4c9C303574Fd0e3914dE96A5a83aaf4"' text
    Then Element with "partial text" "Make sure you are using correct zkSync network" should be "visible"
