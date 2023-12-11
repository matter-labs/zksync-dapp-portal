@artifacts @regression @swapPage @swap @various
Feature: Artifacts - UI - Swap

  Background:
    Given Connect Metamask extension with login action

  @id1413
  Scenario: Check artifacts for the Swap page
    Given I go to page "/transactions/?network=era-goerli"
    When I click by text "Swap"
    Then Element with "text" "Swap tokens" should be "visible"
    Then Element with "xpath" "//*[@class='arrow-icon']" should be "visible"
    Then Element with "xpath" "//*[@class='arrow-icon']" should be "clickable"
    Then Element with "partial href and text" "'https://app.mute.io/swap' and 'Mute.io'" should be "visible"
    Then Element with "partial href and text" "'https://app.mute.io/swap' and 'Mute.io'" should be "clickable"
    Then Element with "partial src" "/img/mute.svg" should be "visible"
    Then Element with "partial src" "/img/mute.svg" should be "clickable"
    Then Element with "partial href and text" "'https://app.mav.xyz/?chain=324' and 'Maverick Protocol'" should be "visible"
    Then Element with "partial href and text" "'https://app.mav.xyz/?chain=324' and 'Maverick Protocol'" should be "clickable"
    Then Element with "partial src" "/img/maverick-protocol.svg" should be "visible"
    Then Element with "partial src" "/img/maverick-protocol.svg" should be "clickable"
    Then Element with "partial href and text" "'https://zksync.izumi.finance/swap' and 'iZiSwap'" should be "visible"
    Then Element with "partial href and text" "'https://zksync.izumi.finance/swap' and 'iZiSwap'" should be "clickable"
    Then Element with "partial src" "/img/izumi.svg" should be "visible"
    Then Element with "partial src" "/img/izumi.svg" should be "clickable"
    Then Element with "partial href and text" "'https://app.velocore.xyz/swap' and 'Velocore'" should be "visible"
    Then Element with "partial href and text" "'https://app.velocore.xyz/swap' and 'Velocore'" should be "clickable"
    Then Element with "partial src" "/img/velocore.svg" should be "visible"
    Then Element with "partial src" "/img/velocore.svg" should be "clickable"
    Then Element with "partial href and text" "'https://swap-zksync.spacefi.io/#/swap' and 'SpaceFi'" should be "visible"
    Then Element with "partial href and text" "'https://swap-zksync.spacefi.io/#/swap' and 'SpaceFi'" should be "clickable"
    Then Element with "partial src" "/img/spacefi.svg" should be "visible"
    Then Element with "partial src" "/img/spacefi.svg" should be "clickable"
    Then Element with "partial href and text" "'https://dapp.ezkalibur.com/' and 'eZKalibur'" should be "visible"
    Then Element with "partial href and text" "'https://dapp.ezkalibur.com/' and 'eZKalibur'" should be "clickable"
    Then Element with "partial src" "/img/ezkalibur.svg" should be "visible"
    Then Element with "partial src" "/img/ezkalibur.svg" should be "clickable"
    Then Element with "partial href and text" "'https://app.vesync.finance/swap' and 'veSync'" should be "visible"
    Then Element with "partial href and text" "'https://app.vesync.finance/swap' and 'veSync'" should be "clickable"
    Then Element with "partial src" "/img/vesync.svg" should be "visible"
    Then Element with "partial src" "/img/vesync.svg" should be "clickable"