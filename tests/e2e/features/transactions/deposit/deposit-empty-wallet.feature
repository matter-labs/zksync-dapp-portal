@deposit @regression @transactions @emptyWallet
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action


  @id1294 @emptyWallet @mainnet
  Scenario: Deposit - Receive - [Transaction] insufficient funds 0 balance
    Given I go to page "/transaction/zksync/era/deposit/?network=era-mainnet"
    When I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0" as amount
    When Element with "text" " Insufficient " should be "visible"
    Then Message "ETH" should be visible
    Then Message " balance on Ethereum Mainnet to cover the fee. We recommend having at least " should be visible
    Then Message " on Mainnet for deposit. " should be visible
    When I confirm the network switching
    Then Element with "text" " Continue " should be "disabled"

  @id1294 @emptyWallet @testnet
  Scenario: Deposit - Receive - [Transaction] insufficient funds 0 balance
    Given I am on the Main page
    When I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0" as amount
    When Element with "text" " Insufficient " should be "visible"
    Then Message "ETH" should be visible
    Then Message " balance on Ethereum Goerli Testnet to cover the fee. We recommend having at least " should be visible
    Then Message " on Goerli Testnet for deposit. " should be visible
    When I confirm the network switching
    Then Element with "text" " Continue " should be "disabled"

    