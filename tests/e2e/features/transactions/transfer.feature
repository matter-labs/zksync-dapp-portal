@transfer @regression @transactions 
Feature: Transfer

  Background:
    Given Connect Metamask extension with login action

  @id1321
  Scenario: Make a transfer in ETH
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/send?network=era-goerli&address=0x9CC8DC9c4d73fC5647A4eE78A2e8EC49D447AeB8"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to zkSync Era Testnet" button
    Then Message "Transaction submitted" should be visible
    Then Message "Transaction completed" should be visible
    Then Element with "text" "Send" should be "visible"
    Then Arrow element for "Transfer" external link should be "visible"
    Then Arrow element for "Transfer" external link should be "clickable"

  @id1276
  Scenario: Reject a transfer transaction
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/send?network=era-goerli&address=0x9CC8DC9c4d73fC5647A4eE78A2e8EC49D447AeB8"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "reject" transaction after clicking "Send to zkSync Era Testnet" button
    Then Element with "text" "Confirm transaction" should be "visible"

