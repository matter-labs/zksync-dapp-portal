@withdraw @regression @transactions @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

  @id1333 @id1434
  Scenario: Make a withdraw in ETH
    #first part - id1333
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli Testnet" button
    Then Message "Transaction submitted" should be visible
    #second part - id1434
#    Then Element with "xpath" "//*[@class='modal-card']//a[@href='/']" should be "clickable"
#    When I click by "xpath" with "//*[@class='modal-card']//a[@href='/']" value
#    Then Element with "xpath" "//h1[text()='Assets']" should be "visible"

  @id1274
  Scenario: Withdraw - Send - [Transaction] 0 funds
    # Given I click by "text" with "zkSync Era∎" value
    When I go to "Withdraw" transaction section
    When I click by "text" with "Your account" value
    When I insert "0" as amount
    When I confirm the network switching
    Then Element with "text" " Continue " should be "disabled"


  @id1290
  Scenario: Withdraw - Send - [Transaction] 0 funds
    When I go to "Withdraw" transaction section
    When I click by "text" with "Your account" value
    Then Element with "class" "amount-input-max-button" should be "clickable"
    When I click by "text" with " Max " value
    Then Element with "title" "Max amount is set" should be "visible"

  @id1554
  Scenario: Withdraw - Bridge - [Transaction] insufficient funds
    Given I am on the Main page
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "10000" as amount
    When I confirm the network switching
    Then Element with "partial class" "has-error" should be "enabled"
    Then Element with "text" " Max " should be "visible"
    Then Element with "text" " Max " should be "clickable"
    Then Element with "text" " Continue " should be "disabled"
    When I click by text " Max "
    Then Element with "partial class" "has-error" should be "invisible"

  @id1327
  Scenario: Withdraw - Bridge - [WF] Withdraw
    Given I am on the Main page
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I confirm the network switching
    When I choose "ETH" as token and insert "0.0001" as amount
    #check an available balance
    Then Element with "class" "break-all" should be "visible"
    When I click by text " Max "
    Then Element with "class" "amount-input-token" should be "visible"
    Then Element with "class" "amount-input-token" should be "clickable"


