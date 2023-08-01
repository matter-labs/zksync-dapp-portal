@redirection @regression @sendPage @authorized @smoke

Feature: External Redirection on the Send Page

  Background:
    Given Connect Metamask extension with login action

  @id1649
  Scenario Outline: Check redirection for the "Send" page links
    Given I go to page "/transaction/zksync/era/?network=era-goerli"
    When I click by text "<Service name>"
    Then New page has "<url>" address

    Examples:
      | Service name    | url                                                                   |
      | Layerswap       | https://www.layerswap.io/app?sourceExchangeName=ZKSYNCERA_MAINNET     |
      | Orbiter         | https://www.orbiter.finance/?source=zkSync%20Era&dest=Ethereum        |
      