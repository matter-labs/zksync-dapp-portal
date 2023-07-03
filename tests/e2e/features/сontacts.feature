@contacts @regression @contactsPage
Feature: Contacts

  Background:
    Given Connect Metamask extension with login action

  @id1391
  Scenario: Check the error for same account credential
    Given I click by "class" with "account-name-container" value
    Given I click on the Copy button
    Given Clipboard is not empty
    Given I go to page "/contacts"
    Given I click by "text" with "Add contact" value
    When I fill the "//*[@placeholder='Address or ENS or contact name']" input field by "SameAddress"
    When I fill the "//*[@placeholder='Ethereum address']" input field by "clipboard"
    When I click on the Save contact button
    Then Element with "text" "Can't add own account to contacts" should be "visible"


  @id1390
  Scenario: Check the adding a new contact
    Given I am on the Main page
    Given I go to page "/contacts"
    Given I click by "text" with "Add contact" value
    When I fill the "Address or ENS or contact name" input field on the Contacts page with "Test" text
    When I fill the "Ethereum address" input field on the Contacts page with "0x038fA18b8a7708112e086C777B2107042174E541" text
    When I click on the Save contact button
    Then Element with "text" "Send" should be "visible"
    Then Element with "text" "Send" should be "clickable"
    When I click by text "Send"
    Given The address includes "/transaction/send?address=0x038fA18b8a7708112e086C777B2107042174E541" a part route
    Given I go to page "/contacts"
    Then Element with "text" "Test" should be "visible"
    Then Element with "text" "Test" should be "clickable"