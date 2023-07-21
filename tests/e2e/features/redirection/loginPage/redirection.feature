@redirection @regression @loginPage @authorized @smoke

Feature: External Redirection on the Login Page

  @id1541
  Scenario Outline: Check redirection for the "View on Explorer" links (zkSync Era∎)
    When I click by "<Selector type>" with "<Selector value>" value
    Then New page has "<url>" address

    Examples:
      | Selector type | Selector value            | url                                        |
      | title         | zkSync Portal GitHub page | https://github.com/matter-labs/dapp-portal |
      | id            | zk-sync-white-total       | https://zksync.io/                         |


