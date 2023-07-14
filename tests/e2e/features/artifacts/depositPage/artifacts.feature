@artifactsSuite1 @artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1438 @deposit
  Scenario: Check artifacts on the Approve allowance modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    When I choose "DAI" as token and insert "6" as amount
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Allowance" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0xa439...046']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='DAI token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x3e7676...D4b']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[text()='Approving allowance for deposit']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg']" xpath should be "visible"
    Then Element with "partial text" " Allowance lets you safely authorize the deposit process to access a specific amount of your tokens. No funds will be deducted after signing, except for " should be "visible"
    Then Element with "partial text" "Learn more" should be "visible"
    Then Element with "partial text" "Learn more" should be "clickable"
    Then Element with "partial text" "Approve allowance" should be "visible"
    Then Element with "partial text" "Approve allowance" should be "clickable"

  @id1398 @deposit
  Scenario: Check artifacts on the Confirm transaction modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I choose "ETH" as token and insert "0.0001" as amount
    When I confirm the network switching
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Confirm transaction" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"

  @id1336 @deposit
  Scenario: Check artifacts on the Add fund to page - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    Then Element with "text" "Add funds to" should be "visible"
    Then Element with "id" "amount-input" should be "visible"
    Then Element with "text" " Balance: " should be "visible"
    Then Element with "class" "break-all" should be "visible"
    Then Element with "text" " Max " should be "visible"
    Then Element with "text" " Max " should be "clickable"
    Then Element with "placeholder" "0" should be "visible"
    Then Element with "testId" "token-dropDown" should be "visible"
    Then Element with "testId" "token-dropDown" should be "clickable"
    Then Element with "testId" "fee-amount" should be "visible"
    Then Fee should have "$" value
    Then Fee should have "ETH" value
    Then Element with "text" " Continue " should be "visible"

  @id1332 @emptyWallet
  Scenario: Check artifacts for an empty wallet
    Then A wallet should be "empty"
    Then Message " You don't have any balances on " should be visible
    Then Message "zkSync Era∎ Goerli" should be visible
    Then Message " Proceed to " should be visible
    Then Message "Add funds" should be visible
    Then Message " page to add balance to your account " should be visible
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "visible"
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "clickable"
    Then Element with "href and text" "'/balances' and 'View all'" should be "visible"
    Then Element with "href and text" "'/balances' and 'View all'" should be "clickable"

