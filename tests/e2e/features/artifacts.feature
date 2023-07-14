@artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

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

  @id1534 @header
  Scenario: Check artifacts on the Header
    Given I am on the Main page
    Then Element with "href" "/" should be "visible"
    Then Element with "href" "/" should be "clickable"
    Then Element with "aria-label" "Medium Blog" should be "visible"
    Then Element with "aria-label" "Medium Blog" should be "clickable"
    Then Element with "aria-label" "Discord Community" should be "visible"
    Then Element with "aria-label" "Discord Community" should be "clickable"
    Then Element with "aria-label" "Telegram Support" should be "visible"
    Then Element with "aria-label" "Telegram Support" should be "clickable"
    Then Element with "aria-label" "Twitter Community" should be "visible"
    Then Element with "aria-label" "Twitter Community" should be "clickable"
    Then Element with "aria-label" "Email" should be "visible"
    Then Element with "aria-label" "Email" should be "clickable"

  @id1428 @header
  Scenario: Check artifacts on the Receive page
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/receive"
    Then Element with "text" "Receive" should be "visible"
    Then Element with "text" "Official bridge" should be "visible"
    Then Element with "text" "Add funds using official bridge" should be "visible"
    Then Element with "href" "/transaction/zksync/era/deposit" should be "visible"
    Then Element with "href" "/transaction/zksync/era/deposit" should be "clickable"
    Then Element with "text" "View address" should be "visible"
    Then Element with "text" "Receive from another account" should be "visible"
    Then Element with "href" "/transaction/zksync/era/receive-address" should be "visible"
    Then Element with "href" "/transaction/zksync/era/receive-address" should be "clickable"
    Then Element with "text" "Receive test tokens" should be "visible"
    Then Element with "text" "Use official faucet to get test tokens" should be "visible"
    Then Element with "href" "/transaction/zksync/era/faucet" should be "visible"
    Then Element with "href" "/transaction/zksync/era/faucet" should be "clickable"
    Then Element with "text" "Top-up with cash" should be "visible"
    Then Element with "text" "Ramp" should be "visible"
    Then Element with "href" "https://ramp.network/buy/" should be "visible"
    Then Element with "href" "https://ramp.network/buy/" should be "clickable"
    Then Element with "text" "Top-up from another network" should be "visible"
    Then Element with "text" "Layerswap" should be "visible"
    Then Element with "href" "https://www.layerswap.io/?destNetwork=ZKSYNCERA_MAINNET" should be "visible"
    Then Element with "text" "Orbiter" should be "visible"
    Then Element with "href" "https://www.orbiter.finance/?dest=zkSync%20Era" should be "clickable"

  @id1352 @header
  Scenario: Check artifacts on the Receive Address (QR) page
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/receive-address"
    Then Element with "text" "Receive" should be "visible"
    Then Element with "class" "qr-code-container" should be "visible"
    Then Element with "text" "0x586607...975" should be "visible"
    Then Element with "text" "Scan to copy address" should be "visible"
    Then Element with "text" "Copy" should be "visible"
    Then Element with "text" "Copy" should be "clickable"
    Then Element with "text" " Please transfer funds to this address using " should be "visible"
    Then Element with "text" "zkSync Era∎ Goerli" should be "visible"
    Then Element with "text" " to successfully receive them " should be "visible"

  @id1389 @contacts
  Scenario: Check artifacts on the Contacts page
    Given I am on the Main page
    When I go to page "/contacts"
    Then Element with "xpath" "//h1[text()='Contacts']" should be "visible"
    Then Element with "text" "Add contact" should be "visible"
    Then Element with "text" "Add contact" should be "clickable"
    Then Element with "partial class" "small-input-container" should be "visible"
    Then Element with "placeholder" "Address or ENS or contact name" should be "visible"
    #add new contact
    Given I click by "text" with "Add contact" value
    When I fill the "Name of the contact" input field on the Contacts page with "My second contact" text
    When I fill the "Ethereum address" input field on the Contacts page with "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" text
    When I click on the Save contact button
    When I close modal card
    Then Element with "text" "My second contact" should be "visible"
    Then Element with "text" "0x26A4c5...C37" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Element with "partial href" "/transaction" should be "visible"


  @id1392 @contacts
  Scenario Outline: Check error for the <An incorrect address value> wrong account address on the Contacts page
    Given I am on the Main page
    When I go to page "/contacts"
    When I click by text "Add contact"
    When I fill the "Name of the contact" input field on the Contacts page with "Test" text
    When I fill the "Ethereum address" input field on the Contacts page with "<An incorrect address value>" text
    Then I click by text "Save contact"
    Then Element with "text" "Valid 0x Ethereum address required" should be "visible"
    Then Element with "partial class" "has-error" should be "visible"

    Examples:
      | An incorrect address value                  |
      | 0x52B6d10d7d865B3d4103f8809AA3521288568f4   |
      | 0x52B6d10d7d865B3d4103f8809AA3521288568f412 |
      | 0x52B6d10d7d865B3d4103f88!09AA3521288568f46 |
      | 123dvdf98234sddfsd                          |

    @id1405 @contacts
    Scenario: Check artifacts on the Contacts page
      Given I am on the Main page
      When I go to page "/contacts"
      #add new contact
      Given I click by "text" with "Add contact" value
      When I fill the "Name of the contact" input field on the Contacts page with "My second contact" text
      When I fill the "Ethereum address" input field on the Contacts page with "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" text
      When I click on the Save contact button
      When I close modal card
      #check the UI artifacts
      When I click by text "My second contact"
      #check the UI artifacts
      Then Modal card element with the "//*[contains(@class,'address-avatar-img')]" xpath should be "visible"
      Then Modal card element with the "//div[text()='My second contact']" xpath should be "visible"
      Then Modal card element with the "//div[text()='My second contact']" xpath should be "visible"
      Then Modal card element with the "//div[text()='Information']" xpath should be "visible"
      Then Modal card element with the "//div[text()='Address']" xpath should be "visible"
      Then Modal card element with the "//div[text()='0x26A4c5...C37']" xpath should be "visible"
      Then Modal card element with the "//div[text()='Actions']" xpath should be "visible"
      Then Modal card element with the "//*[text()='Send']" xpath should be "visible"
      Then Modal card element with the "//*[text()='Send']" xpath should be "clickable"
      Then Modal card element with the "//*[text()='Edit']" xpath should be "visible"
      Then Modal card element with the "//*[text()='Edit']" xpath should be "clickable"
      Then Modal card element with the "//*[text()='Remove']" xpath should be "visible"
      Then Modal card element with the "//*[text()='Remove']" xpath should be "clickable"
      
