@deposit @regression @transactions @resetAllowance
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action


  # It takes ~2m40.775s
  #@id1295 @id1437 @id1494 @id1446 @id1439
  #Scenario: Make a deposit with approving an allowance
    #Given I reset allowance
    #Given I go to the main page
    #Given I go to "Deposit" transaction section
    #When I click by "text" with "Your account" value
    #Then Element with "testId" "fee-amount" should be "visible"
    #When I choose "DAI" as token and insert "0.0000000001" as amount
    #Then I "confirm" transaction after clicking "Approve allowance" button
    # start 1446
    #Then Modal card element with the "//*[text()='Approving allowance']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='Allowance']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='0.0000000001']" xpath should be "visible"
    #Then Modal card element with the "//*[@alt='DAI token icon']" xpath should be "visible"
    #Then Modal card element with the "//*[@title='DAI']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='Approved amount']" xpath should be "visible"
    #Then Modal card element with the "//*[@class='line-button-with-img-icon']" xpath should be "visible"
    #Then Modal card element with the "//*[@class='line-button-with-img-icon']" xpath should be "clickable"
    #Then Modal card element with the "//*[text()=' Please wait until ']" xpath should be "visible"
    #Then Modal card element with the "//*[text()=' allowance transaction for ']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='zkSync Era Testnet']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='Ethereum Goerli Testnet']" xpath should be "visible"
    #Then Modal card element with the "//*[contains(text(),'Track status')]" xpath should be "visible"
    #Then Modal card element with the "//*[contains(text(),'Track status')]" xpath should be "clickable"
    ### end 1446
    # start of 1439
    #Then Modal card element with the "//*[text()='Allowance approved']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='Allowance']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='0.0000000001']" xpath should be "visible"
    #Then Modal card element with the "//*[@alt='DAI token icon']" xpath should be "visible"
    #Then Modal card element with the "//*[@title='DAI']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='Approved amount']" xpath should be "visible"
    #Then Modal card element with the "//*[@class='line-button-with-img-icon']" xpath should be "visible"
    #Then Modal card element with the "//*[@class='line-button-with-img-icon']" xpath should be "clickable"
    #Then Modal card element with the "//*[text()=' Allowance for ']" xpath should be "visible"
    #Then Modal card element with the "//*[text()=' is successfully approved for ']" xpath should be "visible"
    #Then Modal card element with the "//*[text()='zkSync Era Testnet']" xpath should be "visible"
    #Then Modal card element with the "//*[text()=' network. You can now proceed with the deposit ']" xpath should be "visible"
    ### end of 1439
    #Then I approve allowance after clicking "Approve allowance" button
    #When I "confirm" transaction after clicking "Add funds to zkSync Era Testnet" button
    #Then Modal card element with the "//*[contains(text(),'Track status')]" xpath should be "visible"
    #Then Modal card element with the "//*[contains(text(),'Track status')]" xpath should be "clickable"
    #Then Message "Transaction submitted" should be visible
    # start of id1494
    #Given I go to the main page
   # Given I go to "Deposit" transaction section
   # When I click by "text" with "Your account" value
   # Then Element with "testId" "fee-amount" should be "visible"
    #When I choose "DAI" as token and insert "1" as amount
    #Then Element with "partial class" "alert-container" should be "visible"
    #Then Element with "partial text" "Your current allowance for" should be "visible"
    #Then Element with "text" "DAI" should be "visible"
    #Then Element with "partial text" "Depositing more than that will require you to approve a new allowance." should be "visible"
    #Then Element with "partial text" "Learn more" should be "visible"
    #Then Element with "partial text" "Learn more" should be "clickable"
    ### end of id1494
  