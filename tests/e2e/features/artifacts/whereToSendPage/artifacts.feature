@artifacts @regression @whereToSendPage @emptyWallet @various
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1560:I @testnet
  Scenario: Check artifacts for an "Where to send" page (Testnet)
    Given I go to page "/transaction/zksync/era/?network=era-goerli"
    Then Element with "text" "Where to send" should be "visible"
    #zkSync Era item
    Then Element with "text" "zkSync Era Testnet" should be "visible"
    Then Element with "text" "Send inside zkSync Era Testnet network" should be "visible"
    Then Element with "text" "zkSync Era Testnet" should be "clickable"
    Then Element with "partial src" "/img/era.svg" should be "visible"
    Then Element with "partial src" "/img/era.svg" should be "clickable"
    #Ethereum item
    Then Element with "text" "Ethereum Goerli Testnet" should be "visible"
    Then Element with "text" "Withdraw to Ethereum Goerli Testnet" should be "visible"
    Then Element with "text" "Ethereum Goerli Testnet" should be "clickable"
    Then Element with "partial src" "/img/ethereum.svg" should be "visible"
    Then Element with "partial src" "/img/ethereum.svg" should be "clickable"
    #zkSync Lite item
    Then Element with "text" "zkSync Lite Goerli" should be "visible"
    Then Element with "text" "Send to zkSync Lite network" should be "visible"
    Then Element with "text" "zkSync Lite Goerli" should be "clickable"
    Then Element with "partial src" "/img/zksync-lite.svg" should be "visible"
    Then Element with "partial src" "/img/zksync-lite.svg" should be "clickable"
    Then Element with "text" "Send to exchange" should be "visible"
    #Official bridge item
    Then Element with "text" "Official bridge" should be "visible"
    Then Element with "text" "Send to exchange using official bridge" should be "visible"
    Then Element with "text" "Official bridge" should be "clickable"
    Then Element with "text" "Send to another network" should be "visible"
    #Layerswap item
    Then Element with "text" "Layerswap" should be "visible"
    Then Element with "text" "Layerswap" should be "clickable"
    Then Element with "partial src" "/img/layerswap.svg" should be "visible"
    Then Element with "partial src" "/img/layerswap.svg" should be "clickable"

  @id1560:II @testnet
  Scenario Outline: Check artifacts for an "Where to send" page (Testnet)
    Given I go to page "/transaction/zksync/era/?network=era-goerli"
    Then Arrow element for "<Link name>" external link should be "visible"
    Then Arrow element for "<Link name>" external link should be "clickable"

       Examples:
      | Link name   |
      | Layerswap   |
      | Orbiter     |

 @id1411:I @mainnet
 Scenario: Check artifacts for an "Where to send" page (Mainnet)
    Given I go to page "/transaction/zksync/era/?network=era-mainnet"
    Then Element with "text" "Where to send" should be "visible"
    #zkSync Era item
    Then Element with "text" "zkSync Era Mainnet" should be "visible"
    Then Element with "text" "Send inside zkSync Era Mainnet network" should be "visible"
    Then Element with "text" "zkSync Era Mainnet" should be "clickable"
    Then Element with "partial src" "/img/era.svg" should be "visible"
    Then Element with "partial src" "/img/era.svg" should be "clickable"
    #Ethereum item
    Then Element with "text" "Ethereum Mainnet" should be "visible"
    Then Element with "text" "Withdraw to Ethereum Mainnet" should be "visible"
    Then Element with "text" "Ethereum Mainnet" should be "clickable"
    Then Element with "partial src" "/img/ethereum.svg" should be "visible"
    Then Element with "partial src" "/img/ethereum.svg" should be "clickable"
    #zkSync Lite item
    Then Element with "text" "zkSync Lite Mainnet" should be "visible"
    Then Element with "text" "Send to zkSync Lite network" should be "visible"
    Then Element with "text" "zkSync Lite Mainnet" should be "clickable"
    Then Element with "partial src" "/img/zksync-lite.svg" should be "visible"
    Then Element with "partial src" "/img/zksync-lite.svg" should be "clickable"
    Then Element with "text" "Send to exchange" should be "visible"
    #Official bridge item
    Then Element with "text" "Official bridge" should be "visible"
    Then Element with "text" "Send to exchange using official bridge" should be "visible"
    Then Element with "text" "Official bridge" should be "clickable"
    Then Element with "text" "Send to another network" should be "visible"
    #Layerswap item
    Then Element with "text" "Layerswap" should be "visible"
    Then Element with "text" "Layerswap" should be "clickable"
    Then Element with "partial src" "/img/layerswap.svg" should be "visible"
    Then Element with "partial src" "/img/layerswap.svg" should be "clickable"

 @id1411:II @mainnet
 Scenario Outline: Check artifacts for an "Where to send" page (Mainnet)
    Given I go to page "/transaction/zksync/era/?network=era-mainnet"
    Then Arrow element for "<Link name>" external link should be "visible"
    Then Arrow element for "<Link name>" external link should be "clickable"

       Examples:
      | Link name   |
      | Layerswap   |
      | Orbiter     |

