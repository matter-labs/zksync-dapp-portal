@contactsPage @artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


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
    When I fill the input field contains "placeholder" type "Name of the contact" value with "My second contact" text
    When I fill the input field contains "placeholder" type "Ethereum address" value with "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" text
    When I click on the Save contact button
    When I close modal card
    Then Element with "text" "My second contact" should be "visible"
    Then Element with "text" "0x26A4c5...C37" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    #Then Element with "partial href" "/transaction" should be "visible"


  @id1392 @contacts
  Scenario Outline: Check error for the <An incorrect address value> wrong account address on the Contacts page
    Given I am on the Main page
    When I go to page "/contacts"
    When I click by text "Add contact"
    When I fill the input field contains "placeholder" type "Name of the contact" value with "Test" text
    When I fill the input field contains "placeholder" type "Ethereum address" value with "<An incorrect address value>" text
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
    When I fill the input field contains "placeholder" type "Name of the contact" value with "My second contact" text
    When I fill the input field contains "placeholder" type "Ethereum address" value with "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" text
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