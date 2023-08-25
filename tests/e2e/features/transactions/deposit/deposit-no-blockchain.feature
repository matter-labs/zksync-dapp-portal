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
    
  @id1427 
  Scenario: Where to add funds - Receive - [WF] Check for Mistakes
    Given I go to page "/transaction/zksync/era/deposit/"
    When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "0x8f0f44583aQ6908f7f933cd6f0aae382ac3fd8f6" text
    Then Element with "text" "Please enter a valid Ethereum address" should be "visible"  
    When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "0x8f0f44583a6908f7f933cd6f0aae382ac3fd8f6" text
    Then Element with "text" "Please enter a valid Ethereum address" should be "visible" 
    When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "0x8f0f44583a116908f7f933cd6f0aae382ac3fd8f6" text
    Then Element with "text" "Please enter a valid Ethereum address" should be "visible"  
    When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "0x8f0f44583a$6908f7f933cd6f0aae382ac3fd8f6" text
    Then Element with "text" "Please enter a valid Ethereum address" should be "visible"  
    When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "0x8f0F33583a56908F7F933cd6F0AaA382aC3fd8f6" text
    Then Element with "text" "Please enter a valid Ethereum address" should be "visible"
    Then Element with "data-testid" "your-account" should be "visible"
    When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "1231231231212312312314235346454756745635345345345399" text 
    Then Element with "placeholder" "Address or ENS or contact name" should have "12312312312123123123142353464547567456353453453453" "value"
