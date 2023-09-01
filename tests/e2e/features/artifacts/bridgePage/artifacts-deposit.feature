@bridge @bridgePage @regression @smoke @artifacts @richWallet @deposit
Feature: Bridge

  Background:
    Given Connect Metamask extension with login action

    @id756
    Scenario: Check the Bridge artifacts on Deposit (Testnet)
      Given I go to page "/bridge?network=era-goerli"
      Then Element with "text" "Bridge" should be "visible"
      Then Element with "text" "Deposit" should be "visible"
      Then Element with "text" "Withdraw" should be "visible"
      Then Element with "text" "From" should be "visible"
      Then Element with "text" "Ethereum Goerli Testnet" should be "visible"
      Then Element with "class" "account-button" should be "visible"
      Then Element with "class" "account-button" should be "clickable"
      Then Element with "testId" "token-dropDown" should be "visible"
      Then Element with "testId" "token-dropDown" should be "clickable"
      Then Element with "partial string" "Balance:" should be "visible"
      Then Element with "id" "amount-input" should be "visible"
      Then Element with "id" "amount-input" should be "clickable"
      Then Element with "text" " Max " should be "visible"
      Then Element with "text" " Max " should be "clickable"
      #Block
      Then Element with "text" "Your zkSync Era Testnet account" should be "visible"
      Then Element with "text" "Your zkSync Era Testnet account" should be "clickable"
      Then Element with "text" "0x2CF4...75d" should be "visible"
      Then Element with "text" "0x2CF4...75d" should be "clickable"
      Then Element with "class" "address-avatar address-card-avatar" should be "visible"
      Then Element with "partial src" "eth.svg" should be "visible"
      #Fee block
      Then Element with "testId" "fee-amount" should be "visible"
      Then Element with "partial string" "$" should be "visible"
      Then Element with "class" "circle" should be "enabled"
      Then Element with "text" "ETH" should be "visible"
      Then Element with "type" "submit" should be "visible"
      # Bottom block part
      When I confirm the network switching
      Then Element with "partial string" "Arriving in ~15 minutes" should be "visible"
      Then Element with "type" "submit" should be "visible"
      Then Element with "partial string" " Continue " should be "visible"

    @id1611
    Scenario: Check the editing recipient address in Bridge (Deposit)
      Given I go to page "/bridge?network=era-goerli"
      When I click by text "Deposit"
      When I click by "text" with "Your zkSync Era Testnet account" value
      Then Element with "text" "Bridge to" should be "visible"
      When I fill the input field contains "placeholder" type "Address or ENS or contact name" value with "0x52B6d10d7d865B3d4103f8809AA3521288568f46" text
      When I click by text "0x52B6...f46"
      Then Element with "text" "zkSync Era Testnet address" should be "visible"
      Then Element with "text" "0x52B6...f46" should be "visible"

    @id1598
    Scenario: Check the Bridge artifacts on Deposit: a wallet is not connected
        Given I'm logged out
        Given I go to page "/bridge?network=era-goerli"
        Then Element with "text" "Bridge" should be "visible"
        When I click by text "Deposit"
        Then Element with "text" " Connect wallet " should be "visible"
        Then Element with "text" " Connect wallet " should be "clickable"
        Then Element with "testId" "token-dropDown" should be "visible"
        Then Element with "testId" "token-dropDown" should be "clickable"
        Then Element with "text" "Connect wallet to see balance" should be "visible"
        Then Element with "placeholder" "0" should be "visible"
        Then Element with "xpath" "//*[contains(@class,'solid') and text()=' Connect wallet ']" should be "visible"
        Then Element with "xpath" "//*[contains(@class,'solid') and text()=' Connect wallet ']" should be "clickable"
        