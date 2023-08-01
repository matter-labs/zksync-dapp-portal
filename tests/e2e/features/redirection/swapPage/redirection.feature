@redirection @regression @swapPage @authorized @smoke

Feature: External Redirection on the Swap Page

  Background:
    Given Connect Metamask extension with login action

  @id1485
  Scenario Outline: Check redirection for the "Swap" page links
    Given I go to page "/payments/?network=era-goerli"
    When I click by text "Swap"
    When I click by text "<Swap name>"
    Then New page has "<url>" address

    Examples:
      | Swap name         | url                                   |
      | Mute.io           | https://app.mute.io/swap              |
      | Maverick Protocol | https://app.mav.xyz/?chain=324        |
      | Velocore          | https://app.velocore.xyz/swap         |
      | SpaceFi           | https://swap-zksync.spacefi.io/#/swap |
      | eZKalibur         | https://dapp.ezkalibur.com/           |
      | veSync            | https://app.vesync.finance/swap       |
      | iZiSwap           | https://zksync.izumi.finance/swap     |
      