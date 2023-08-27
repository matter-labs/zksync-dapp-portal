@deposit @regression @transactions @blockchain
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action

  @id1418 @id1396
  Scenario: Make a deposit in ETH
    Given I am on the Main page
    Given I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    Then Element with "id" "amount-input" should have "" "value"
    Then Element with "testId" "fee-amount" should be "visible"
    Then Fee "should" have "$" value
    Then Fee "should" have "ETH" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Add funds to zkSync Era Testnet" button
    Then Message "Transaction submitted" should be visible
    # id1396
    Then Element with "text" " Go to Assets page " should be "visible"
    Then Element with "text" " Go to Assets page " should be "clickable"
    When I click by "text" with " Go to Assets page " value
    Then I am on the Main page 
    
  @id1280
  Scenario: Deposit - Track status Link redirection
    Given I am on the Main page
    Given I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Add funds to zkSync Era Testnet" button
    Then Message "Transaction submitted" should be visible
    Then Modal card element with the "//*[contains(text(),'Track status')]" xpath should be "visible"
    Then Modal card element with the "//*[contains(text(),'Track status')]" xpath should be "clickable"
    When I click by the "//*[text()=' Track status ']" text element on the Modal card
    Then New page has "https://goerli.etherscan.io/tx/" partial address

  @id1394
  Scenario: Reject Deposit transaction
    Given I am on the Main page
    Given I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "reject" transaction after clicking "Add funds to zkSync Era Testnet" button
    Then Element with "text" "Add funds to zkSync Era Testnet" should be "visible"
    Then Element with "text" "Add funds to zkSync Era Testnet" should be "clickable"
