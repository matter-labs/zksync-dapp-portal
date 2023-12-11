@artifacts @regression @transactionsItems
Feature: Artifacts - UI - Transactions - Items

  Background:
    Given Connect Metamask extension with login action

  @id1488
  Scenario: Check artifacts for the Transaction items
    Given I go to page "/transactions/?network=era-goerli"
    Then Element with "xpath" "//a[text()='Send']" should be "visible"
    Then Element with "xpath" "//a[text()='Send']" should be "clickable"
    Then Element with "xpath" "//a[text()='Swap']" should be "visible"
    Then Element with "xpath" "//a[text()='Swap']" should be "clickable"
    Then Element with "href" "/transaction/zksync/era" should be "visible"
    Then Element with "href" "/transaction/zksync/era" should be "clickable"
    Then Element with "href" "/transaction/zksync/era/swap" should be "visible"
    Then Element with "href" "/transaction/zksync/era/swap" should be "clickable"
    Then Element with "href and text" "'/transactions/all' and 'View all'" should be "visible"
    Then Element with "text" "View all" should be "clickable"
    Then The list has the one of the expected type of transactions