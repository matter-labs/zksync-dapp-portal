@deposit @regression @redirection @resetAllowance
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action


  @deposit @id1493 @id1495 @id1496
  Scenario: Redirection - approving allowance modal
    Given I reset allowance
    Given I go to the main page
    Given I go to "Deposit" transaction section
    When I click by "text" with "Your account" value
    Then I confirm the network switching
    When I choose "DAI" as token and insert "0.001" as amount
    When I click by text " Continue "
    # modal card first link
    Then Element with "text" " Learn more " should be "clickable"
    When I click by "text" with " Learn more " value
    Then New page has "https://cryptotesters.com/blog/token-allowances" address
    # id1495 modal card approving allovance links
    When I "continue" transaction after clicking "Approve allowance" button
    Then Modal card element with the "//*[text()='Approving allowance']" xpath should be "visible"
    Then Element with "class" "line-button-with-img-icon" should be "clickable"
    When I click by "class" with "line-button-with-img-icon" value
    Then New page has "https://goerli.etherscan.io/tx" partial address
    #Then Element with "partial text" "Track status" should be "clickable"
    #When I click by "partial text" with "Track status" value
    #Then New page has "https://goerli.etherscan.io/tx" partial address
    # id1496 modal card approved allovance links
    #Then Modal card element with the "//*[text()='Allowance approved']" xpath should be "visible"
    #Then Element with "class" "line-button-with-img-icon" should be "clickable"
    #When I click by "class" with "line-button-with-img-icon" value
    #Then New page has "https://goerli.etherscan.io/tx" partial address
