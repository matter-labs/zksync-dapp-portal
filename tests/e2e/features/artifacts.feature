@artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1332 @emptyWallet
  Scenario: Check artifacts for an empty wallet
    # Given I click by "text" with "zkSync Era∎" value
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

  @id1315
  Scenario: Check artifacts on a Menu address
    Then Element with "partial class" "account-name" should be "visible"
    Then Element with "partial class" "account-name" should be "clickable"
    Given I click by "partial class" with "account-name" value
    Then Element with "text" " View on explorer " should be "visible"
    Then Element with "text" " View on explorer " should be "clickable"
    Then Element with "text" " Logout " should be "visible"
    Then Element with "text" " Logout " should be "clickable"
    Then Element with "xpath" "//*[@class='copy-button' and @role='none']" should be "visible"
    Then Element with "xpath" "//*[@class='copy-button' and @role='none']" should be "clickable"

  @id1302
  Scenario: Check artifacts on a Menu items
    Then Element with "href" "/" should be "visible"
    Then Element with "href" "/" should be "clickable"
    Then Element with "href" "/payments" should be "visible"
    Then Element with "href" "/payments" should be "clickable"
    Then Element with "text" "Transactions" should be "clickable"
    Then Element with "href" "/contacts" should be "visible"
    Then Element with "href" "/contacts" should be "clickable"
    Then Element with "text" "Contacts" should be "clickable"
    Then Element with "testId" "network-switcher" should be "visible"
    Then Element with "testId" "network-switcher" should be "clickable"

  @id1379
  Scenario: Check artifacts on the Networks switcher
    Given I click by "testId" with "network-switcher" value
    Then Message "Change network" should be visible
    Then Element with "href" "/?network=mainnet" should be "visible"
    Then Element with "href" "/?network=mainnet" should be "clickable"
    Then Element with "text" "zkSync Era Mainnet" should be "visible"
    Then Element with "href" "/?network=goerli" should be "visible"
    Then Element with "href" "/?network=goerli" should be "clickable"
    Then Element with "text" "zkSync Era Goerli Testnet" should be "visible"

  @id1363 @loginPage
  Scenario: Check artifacts on the Login page
    Given I'm logged out
    Then Element with "text" "Connect your Ethereum wallet to zkSync Portal" should be "visible"
    Then Element with "testId" "network-switcher" should be "visible"
    Then Element with "title" "zkSync Portal GitHub page" should be "visible"

  @id1409
  Scenario: Check artifacts on the View on Explorer menu
    Given I click by "class" with "account-name-container" value
    Given I click by "text" with " View on explorer " value
    Then Element with "text" "View on explorer" should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "testId" "close-button" should be "clickable"
    Then Element with "text" "Selected network" should be "visible"
    Then Element with "text" "Other networks" should be "visible"
    Then Element with "text" "zkSync Era∎ Goerli" should be "visible"
    Then Element with "text" "zkSync Era∎ Goerli" should be "clickable"
    Then Element with "text" "zkSync Lite Goerli" should be "visible"
    Then Element with "text" "Ethereum Goerli" should be "visible"
    Then Element with "text" "Ethereum Goerli" should be "clickable"
    Then Element with "src" "/img/era.svg" should be "visible"
    Then Element with "src" "/img/era.svg" should be "clickable"
    Then Element with "src" "/img/zksync-lite.svg" should be "visible"
    Then Element with "src" "/img/zksync-lite.svg" should be "clickable"
    Then Element with "src" "/img/ethereum.svg" should be "visible"
    Then Element with "src" "/img/ethereum.svg" should be "clickable"

  @id1393
  Scenario: Check artifacts on the Contact modal window
    Given I am on the Main page
    Given I click by "text" with "Contacts" value
    When I click by "text" with "Add contact" value
    Then Element with "xpath" "//*[@class='modal-card']//div[text()='Add contact']" should be "visible"
    Then Element with "testId" "close-button" should be "visible"
    Then Element with "text" "Name of the contact" should be "visible"
    Then Element with "text" "Ethereum address" should be "visible"
    Then Element with "text" "Save contact" should be "visible"
    Then Element with "text" "Save contact" should be "clickable"

  @id1336 @deposit
  Scenario: Check artifacts on the Add fund to page - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit"
    When I click by "testId" with "your-account" value
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

  @id1398 @deposit
  Scenario: Check artifacts on the Confirm transaction modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    When I choose "USDC" as token and insert "0.00001" as amount
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Confirm transaction" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"

  @id1438 @deposit
  Scenario: Check artifacts on the Approve allowance modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    When I choose "USDC" as token and insert "0.00001" as amount
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Allowance" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0x5866...975']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='USDC token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x0faF6d...2A9']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[text()='Approving allowance for deposit']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg']" xpath should be "visible"
    Then Element with "partial text" " Allowance lets you safely authorize the deposit process to access a specific amount of your tokens. No funds will be deducted after signing, except for " should be "visible"
    Then Element with "partial text" "Learn more" should be "visible"
    Then Element with "partial text" "Learn more" should be "clickable"
    Then Element with "partial text" "Approve allowance" should be "visible"
    Then Element with "partial text" "Approve allowance" should be "clickable"

