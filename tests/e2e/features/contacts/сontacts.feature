@contacts @regression @actions
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
    When I fill the element of "placeholder" with "Address or ENS or contact name" value by "SameAddress"
    When I fill the element of "placeholder" with "Ethereum address" value by "clipboard"
    When I click on the Save contact button
    Then Element with "text" "Can't add own account to contacts" should be "visible"


  @id1390  @id1407
  Scenario: Check the adding a new contact
    Given I am on the Main page
    Given I click by "text" with "Contacts" value
    Given I click by "text" with "Add contact" value
    When I fill the element of "placeholder" with "Name of the contact" value by "Testo"
    When I fill the element of "placeholder" with "Ethereum address" value by "0x038fA18b8a7708112e086C777B2107042174E541"
    When I click on the Save contact button
    Then Element with "text" "Send" should be "visible"
    Then Element with "text" "Send" should be "clickable"
    When I click the Send button modal on the Contacts page
    Then Current page have "/transaction/send?address=0x038fA18b8a7708112e086C777B2107042174E541" address
    Given I go to page "/contacts"
    Then Element with "text" "Testo" should be "visible"
    Then Element with "text" "Testo" should be "clickable"
#    @id1407
    When I go to page "/contacts"
    When I click by text "Testo"
    Then Element with "text" "Edit" should be "visible"
    Then Element with "text" "Edit" should be "clickable"
    When I click on the Edit contact button
    Then Element with "text" "Edit contact" should be "visible"
    Then Element with "text" "Name of the contact" should be "visible"
    Then Element with "text" "Ethereum address" should be "visible"
    Then Element with "text" "Save contact" should be "visible"
    Then Element with "text" "Save contact" should be "clickable"
    When I fill the element of "placeholder" with "Name of the contact" value by "Test1"
    When I fill the element of "placeholder" with "Ethereum address" value by "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37"
    When I click on the Save contact button
    Then The "Test1" contact name is visible on the modal window within the Contacts page
    Then Element with "xpath" "//*[@class='info-content']//*[text()='0x26A4c5...C37']" should be "visible"
