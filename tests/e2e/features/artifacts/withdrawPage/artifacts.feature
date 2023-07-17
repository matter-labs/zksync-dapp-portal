@withdraw @regression @artifacts @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

  @id1382
  Scenario: Withdraw - Send - Artifacts
    When I go to "Withdraw" transaction section
    When I click by "text" with "Your account" value
    When I confirm the network switching
    Then Element with "text" "Send to" should be "visible"
    # 0x5aA876bC32BC76EFf5124b19744B5B3C38b35537 - 2nd wallet address
    Then Element with "text" "0xa439ba06dA84AFc566Ee710Ba12541A73e3a1046" should be "visible"
    Then Element with "class" "amount-input-field" should be "visible"
    Then Element with "class" "amount-input-field" should be "clickable"
    Then Element with "alt" "ETH token icon" should be "visible"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "class" "break-all" should be "visible"
    Then Element with "data-testid" "token-dropDown" should be "visible"
    Then Element with "data-testid" "token-dropDown" should be "clickable"
    Then Element with "class" "amount-input-max-button" should be "visible"
    Then Element with "class" "amount-input-max-button" should be "clickable"
    Then Element with "text" " Continue " should be "disabled"
    Then Element with "text" " Continue " should be "visible"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Then Element with "text" " Continue " should be "clickable"

  @id1395
  Scenario: Withdraw - Confirm transaction modal - Artifacts
    Given I am on the Main page
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I confirm the network switching
    When I choose "ETH" as token and insert "0.0001" as amount
    When I click by text " Continue "
    Then Element with "text" "Confirm transaction" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"
    Then Element with "text" "Your zkSync Era∎ Goerli account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0xa439...046']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='ETH token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x000000...00A']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg']" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class,'fee-details-container') and //span[contains(text(),'Fee')]]" xpath should be "visible"
    Then Modal card element with the "//*[contains(@class,'fee-details-container') and //span[contains(text(),'Total to pay')]]" xpath should be "visible"
    Then Modal card element with the "//*[text()=' Arriving in ~24 hours ']" xpath should be "visible"
    Then Modal card element with the "//*[text()=' Arriving in ~24 hours ']" xpath should be "clickable"
    Then Element with "text" "Send to Ethereum Goerli" should be "visible"
    Then Element with "text" "Send to Ethereum Goerli" should be "clickable"