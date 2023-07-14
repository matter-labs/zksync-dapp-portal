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


  @id1390  @id1407
  Scenario: Check the adding a new contact
    Given I am on the Main page
    Given I click by "text" with "Contacts" value
    Given I click by "text" with "Add contact" value
    When I fill the "Name of the contact" input field on the Contacts page with "Test" text
    When I fill the "Ethereum address" input field on the Contacts page with "0x038fA18b8a7708112e086C777B2107042174E541" text
    When I click on the Save contact button
    Then Element with "text" "Send" should be "visible"
    Then Element with "text" "Send" should be "clickable"
    When I click the Send button modal on the Contacts page
    Then Current page have "/transaction/send?address=0x038fA18b8a7708112e086C777B2107042174E541" address
    Given I go to page "/contacts"
    Then Element with "text" "Test" should be "visible"
    Then Element with "text" "Test" should be "clickable"
#    @id1407
    When I go to page "/contacts"
    When I click on the First saved contact within the Contacts page
    Then Element with "text" "Edit" should be "visible"
    Then Element with "text" "Edit" should be "clickable"
    When I click on the Edit contact button
    Then Element with "text" "Edit contact" should be "visible"
    Then Element with "text" "Name of the contact" should be "visible"
    Then Element with "text" "Ethereum address" should be "visible"
    Then Element with "text" "Save contact" should be "visible"
    Then Element with "text" "Save contact" should be "clickable"
    When I fill the "Name of the contact" input field on the Contacts page with "Test1" text
    When I fill the "Ethereum address" input field on the Contacts page with "0x5aA876bC32BC76EFf5124b19744B5B3C38b35537" text
    When I click on the Save contact button
    Then The "Test1" contact name is visible on the modal window within the Contacts page
    Then Element with "xpath" "//*[@class='info-content']//*[text()='0x5aA876...537']" should be "visible"
