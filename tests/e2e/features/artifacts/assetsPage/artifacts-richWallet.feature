@artifacts @regression @assetsPage @richWallet
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

    @id1342
    Scenario: Check artifacts for rich wallet on Assets page
      When I am on the Main page
      Then A wallet should be "fullfilled"
      Then Element with "text" "ETH" should be "visible"
      Then Element with "partial src" "eth.svg" should be "visible"
      Then Element with "text" "0x000000...00A" should be "visible"
      Then Element with "text" "Ether" should be "visible"
      Then Element with "class" "token-balance-amount" should be "visible"
      Then Element with "class" "token-balance-price" should be "visible"
      Then Element with "class" "line-button-with-img-icon" should be "visible"
      Then Element with "text" "View all" should be "visible"
