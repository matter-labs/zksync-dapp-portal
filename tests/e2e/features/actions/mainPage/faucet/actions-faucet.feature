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
    Then Element with "class" "default-button variant-primary destination-item-button" should be "invisible"
    Then Element with "class" "content-block-container faucet-notification" should be "invisible"
    