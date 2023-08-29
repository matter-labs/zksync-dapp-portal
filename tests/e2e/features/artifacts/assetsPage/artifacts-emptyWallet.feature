@artifacts @regression @assetsPage @emptyWallet @various
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1332
  Scenario: Check artifacts for an empty wallet
    Then A wallet should be "empty"
    Then Message " You don't have any balances on " should be visible
    Then Message "zkSync Era Testnet" should be visible
    Then Message " Proceed to " should be visible
    Then Message "Add funds" should be visible
    Then Message " page to add balance to your account " should be visible
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "visible"
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "clickable"
    Then Element with "href and text" "'/balances' and 'View all'" should be "visible"
    Then Element with "href and text" "'/balances' and 'View all'" should be "clickable"

  @id1641 @id1642 @id1643 @id1644 @id1645 @id1646 @tokens @emptyWallet
  Scenario Outline: Check artifacts on tokens dropdown on Deposit/Withdraw/Transfer page for Empty Wallet
    Given I go to page "/transaction/zksync/era/<transaction>/?network=era-<network>&address=0x47BCD42B8545c23031E9918c3D823Be4100D4e87"
    Then I click by "testId" with "token-dropDown" value
    Then Element with "text" "Choose token" should be "visible"
    Then Element with "text" "Zero balances" should be "visible"
    Then Element with "class" "token-balance-amount" should be "visible"
    Then Element with "text" "0" should be "visible"

    Examples:
      | network | transaction |
      | mainnet | deposit     |
      | goerli  | deposit     |
      | mainnet | send        |
      | goerli  | send        |
      | mainnet | withdraw    |
      | goerli  | withdraw    |

  @id1678
  Scenario: Check "Insufficient balance" warning message (Zero token balance) (Bridge)
    Then A wallet should be "empty"
    When I go to page "/bridge?network=era-goerli"
    When I click by text "Withdraw"
    When I choose "ETH" as token and insert "1000" as amount
    Then Message " Insufficient balance " should be visible
    #Error state
    Then Element with "partial class" "has-error" should be "visible"
    Then Element with "partial class" "amount-input-error" should be "visible"
