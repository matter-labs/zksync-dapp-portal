@upperNavigationMenu @artifacts @regression @mainPage
Feature: Artifacts - Upper Navigation Menu

  Background:
    Given Connect Metamask extension with login action

  @id1530
  Scenario: Check artifacts on the Upper navigation menu (Build)
    Given I am on the Main page
    When I hover the "text" element with " Build " value
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html' and 'Quickstart'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html' and 'Quickstart'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/' and 'Documentation'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/' and 'Documentation'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/api.html' and 'Web3 API'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/api.html' and 'Web3 API'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/building-on-zksync/contracts/contract-deployment.html' and 'Contract deployment'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/building-on-zksync/contracts/contract-deployment.html' and 'Contract deployment'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/developer-guides/bridging/bridging-asset.html' and 'Bridging assets'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/developer-guides/bridging/bridging-asset.html' and 'Bridging assets'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/tutorials/custom-aa-tutorial.html' and 'Account abstraction'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/tutorials/custom-aa-tutorial.html' and 'Account abstraction'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/tutorials/custom-paymaster-tutorial.html' and 'Building custom Paymasters'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/tutorials/custom-paymaster-tutorial.html' and 'Building custom Paymasters'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/tutorials/cross-chain-tutorial.html' and 'Cross-chain governance'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/tutorials/cross-chain-tutorial.html' and 'Cross-chain governance'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/js' and 'Javascript SDK'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/js' and 'Javascript SDK'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/hardhat' and 'Hardhat plugins'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/hardhat' and 'Hardhat plugins'" should be "clickable"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/tools/zksync-cli/' and 'zkSync Era CLI'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/api/tools/zksync-cli/' and 'zkSync Era CLI'" should be "clickable"
    Then Element with "partial text" "Guides" should be "visible"
    Then Element with "partial text" "Tools" should be "visible"

  @id1529
  Scenario: Check artifacts on the Upper navigation menu (Learn)
    Given I am on the Main page
    When I hover the "text" element with " Learn " value
    Then Element with "href and text" "'https://zksync.io/ethos' and 'Freedom is our mission'" should be "visible"
    Then Element with "href and text" "'https://zksync.io/ethos' and 'Freedom is our mission'" should be "clickable"
    Then Element with "href and text" "'https://zksync.io/hyperscalability' and 'Hyperscalibility'" should be "visible"
    Then Element with "href and text" "'https://zksync.io/hyperscalability' and 'Hyperscalibility'" should be "clickable"
    Then Element with "href and text" "'https://zksync.io/security' and 'Security'" should be "visible"
    Then Element with "href and text" "'https://zksync.io/security' and 'Security'" should be "clickable"
    Then Element with "href and text" "'https://zksync.io/ux' and 'Game-changing UX'" should be "visible"
    Then Element with "href and text" "'https://zksync.io/ux' and 'Game-changing UX'" should be "clickable"

  @id1531
  Scenario: Check artifacts on the Upper navigation menu (Network)
    Given I am on the Main page
    When I hover the "text" element with " Network " value
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/fundamentals/zkSync.html' and 'Intro to zkSync Era'" should be "visible"
    Then Element with "href and text" "'https://era.zksync.io/docs/dev/fundamentals/zkSync.html' and 'Intro to zkSync Era'" should be "clickable"
    Then Element with "href and text" "'https://portal.zksync.io/' and 'Wallet Portal'" should be "visible"
    Then Element with "href and text" "'https://portal.zksync.io/' and 'Wallet Portal'" should be "clickable"
    Then Element with "href and text" "'https://explorer.zksync.io/' and 'Block Explorer'" should be "visible"
    Then Element with "href and text" "'https://explorer.zksync.io/' and 'Block Explorer'" should be "clickable"
    Then Element with "href and text" "'https://docs.zksync.io/userdocs/intro/' and 'Intro to zkSync Lite'" should be "visible"
    Then Element with "href and text" "'https://docs.zksync.io/userdocs/intro/' and 'Intro to zkSync Lite'" should be "clickable"
    Then Element with "href and text" "'https://lite.zksync.io/' and 'Wallet Portal'" should be "visible"
    Then Element with "href and text" "'https://lite.zksync.io/' and 'Wallet Portal'" should be "clickable"
    Then Element with "href and text" "'https://zkscan.io/' and 'Block Explorer'" should be "visible"
    Then Element with "href and text" "'https://zkscan.io/' and 'Block Explorer'" should be "clickable"
    Then Element with "href and text" "'https://ecosystem.zksync.io/' and 'Explore the Ecosystem'" should be "visible"
    Then Element with "href and text" "'https://ecosystem.zksync.io/' and 'Explore the Ecosystem'" should be "clickable"
    Then Element with "href and text" "'https://matterlabs.notion.site/zkSync-Brand-Resources-750bb7b1f3d14ebe9f539a86901c4a1c/' and 'Brand assets'" should be "visible"
    Then Element with "href and text" "'https://matterlabs.notion.site/zkSync-Brand-Resources-750bb7b1f3d14ebe9f539a86901c4a1c/' and 'Brand assets'" should be "clickable"
    Then Element with "partial text" "zkSync Era (v2)" should be "visible"
    Then Element with "partial text" "zkSync Lite (v1)" should be "visible"
    Then Element with "partial text" "zkSync Lite (v1)" should be "visible"