@deposit @regression @transactions @blockchain
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action

  @id785 @id1609 @id1607
  Scenario: Make a deposit on Bridge (Deposit)
    Given I go to page "/bridge?network=era-goerli"
    When I click by text "Deposit"
    Then Element with "id" "amount-input" should have "" "value"
    Then Element with "testId" "fee-amount" should be "visible"
    Then Fee "should" have "$" value
    Then Fee "should" have "ETH" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Add funds to zkSync Era Testnet" button
    Then Message "Transaction submitted" should be visible
    Then Element with "partial href" "https://goerli.etherscan.io/tx/" should be "clickable"
    #id1607 Check "Transaction submitted" pop up Artifacts
    Then Element with "partial class" "progress-plane-animation" should be "visible"
    Then Element with "class" "button-line-body-info-underline" should be "visible"
    #Token icon
    Then Element with "text" "Deposit" should be "visible"
    Then Element with "partial text" "0.0000000001" should be "visible"
    Then Modal card element with the "//*[contains(@src, 'eth.svg')]" xpath should be "visible"
    Then Modal card element with the "//*[text()='ETH']" xpath should be "visible"
    Then Modal card element with the "//*[text()='<$0.01']" xpath should be "visible"
    Then Arrow element for "Deposit" external link should be "visible"
    Then Arrow element for "Deposit" external link should be "clickable"
    Then Element with "text" " Your funds will be available on " should be "visible"
    Then Element with "text" "zkSync Era Testnet" should be "visible"
    Then Element with "text" " after the transaction is committed on " should be "visible"
    Then Element with "text" "Ethereum Goerli Testnet" should be "visible"
    Then Element with "text" " and then processed on " should be "visible"
    Then Element with "text" "zkSync Era Testnet" should be "visible"
    Then Element with "text" ". You are free to close this page. " should be "clickable"
    Then Element with "text" " Track status " should be "clickable"
    Then Element with "text" " Make another transaction " should be "visible"
    Then Element with "text" " Explore ecosystem " should be "visible"
    #id1609 Check "Explore ecosystem" button   
    Then I click by "text" with " Explore ecosystem " value
    Then New page has "https://zksync.dappradar.com/" address
    