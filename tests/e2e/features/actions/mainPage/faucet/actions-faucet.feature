@action @smoke @regression @faucet @emptyWallet
Feature: Faucet

  Background:
    Given Connect Metamask extension with login action

  @id1550 @mainnet
  Scenario: Check Faucet NOT available on Mainnet
    Given A wallet should be "empty"
    When I go to page "/?network=era-mainnet"
    Then Element with "text" "Not enough tokens?" should be "invisible"
    Then Element with "text" "Use official zkSync Era faucet" should be "invisible"
    Then Element with "text" " Get free test tokens " should be "invisible"

  @id1635
  Scenario: Check Out of funds Faucet page
    Given A wallet should be "empty"
    When I go to page "/transaction/zksync/era/faucet/?network=era-goerli"
    Then Faucet tokens animation should be visible
    Then Element with "text" "Out of funds" should be "visible"
    Then Element with "text" "out of funds currently" should be "visible"
    Then Element with "text" ". If you want to test your app, consider testing it locally with access to rich wallets " should be "visible"
    Then Element with "text" "following the instructions from our docs" should be "visible"
    Then Element with "partial text" "You can also request Goerli ETH from one of the following third party faucets:" should be "visible"
    Then Element with "partial text" "You can also request Goerli ETH from one of the following third party faucets:" should be "visible"
    Then Element with "text" "Chainstack faucet" should be "visible"
    Then Element with "text" "Chainstack faucet" should be "clickable"
    Then Element with "text" "QuickNode faucet" should be "visible"
    Then Element with "text" "QuickNode faucet" should be "clickable"
    Then Element with "text" "PoW faucet" should be "visible"
    Then Element with "text" "PoW faucet" should be "clickable"

    