@deposit @regression @transactions @noblockchain
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action


  @id1539 
  Scenario: Deposit - Receive - [Transaction] insufficient funds > max balance
    Given I am on the Main page
    When I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "100000000" as amount
    When Element with "partial class" "has-error" should be "visible"
    When Element with "text" " Max amount is " should be "visible"
    When I confirm the network switching
    When Element with "text" " Continue " should be "disabled" 
    When I save Max Balance Error Value 
    When I click on the underlined Max amount number
    Then Max amount is set to the input field
    Then Element with "partial class" "has-error" should be "invisible"  
    