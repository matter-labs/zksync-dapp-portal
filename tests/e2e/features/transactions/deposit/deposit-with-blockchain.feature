@deposit @regression @transactions @blockchain
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action

  @id1418
  Scenario: Make a deposit in ETH
    Given I am on the Main page
    Given I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    Then Element with "id" "amount-input" should have "" "value"
    Then Element with "testId" "fee-amount" should be "visible"
    Then Fee should have "$" value
    Then Fee should have "ETH" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Add funds to zkSync Era Testnet" button
    Then Message "Transaction submitted" should be visible
    
  # It takes ~2m40.775s
  @id1295 @resetAllowance 
  Scenario: Make a deposit with approving an allowance
    Given I reset allowance
    Given I go to the main page
    Given I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    Then Element with "testId" "fee-amount" should be "visible"
    When I choose "DAI" as token and insert "0.0000000001" as amount
    Then I "handle" transaction after clicking "Approve allowance" button
    When I "confirm" transaction after clicking "Add funds to zkSync Era Testnet" button
    Then Message "Transaction submitted" should be visible
