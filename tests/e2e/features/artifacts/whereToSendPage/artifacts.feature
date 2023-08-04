@artifacts @regression @whereToSendPage @emptyWallet @various
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action

  @id1560:I @testnet
  Scenario Outline: Check artifacts for an "Where to send" page (Testnet)
    Given I go to page "/transaction/zksync/era/?network=era-goerli"
    Then Element with "<Selector type>" "<Selector value>" should be "<Selector state>"

    Examples:
      | Selector type | Selector value                          | Selector state     |
      | text          | Where to send                           | visible            |
      | text          | zkSync Era Testnet                      | visible            |
      | text          | Send inside zkSync Era Testnet network  | visible            |
      | text          | zkSync Era Testnet                      | clickable          |
      | text          | Ethereum Goerli                         | visible            |
      | text          | Withdraw to Ethereum                    | visible            |
      | text          | Ethereum Goerli                         | clickable          |
      | text          | zkSync Lite Goerli                      | visible            |
      | text          | Send to zkSync Lite network             | visible            |
      | text          | zkSync Lite Goerli                      | clickable          |
      | text          | Send to exchange                        | visible            |
      | text          | Send to exchange using official bridge  | visible            |
      | text          | Official bridge                         | visible            |
      | text          | Official bridge                         | clickable          |
      | text          | Layerswap                               | visible            |
      | text          | Layerswap                               | clickable          |
      | text          | Orbiter                                 | visible            |
      | text          | Orbiter                                 | clickable          |
      | text          | Send to another network                 | visible            |
      | partial src   | /img/era.svg?v=1                        | visible            |
      | partial src   | /img/era.svg?v=1                        | clickable          |
      | partial src   | /img/ethereum.svg?v=1                   | visible            |
      | partial src   | /img/ethereum.svg?v=1                   | clickable          |
      | partial src   | /img/zksync-lite.svg?v=1                | visible            |
      | partial src   | /img/zksync-lite.svg?v=1                | clickable          |   
      | partial src   | /img/layerswap.svg?v=1                  | visible            |
      | partial src   | /img/layerswap.svg?v=1                  | clickable          |
      | partial src   | /img/orbiter.svg?v=1                    | visible            |
      | partial src   | /img/orbiter.svg?v=1                    | clickable          |             

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
 Scenario Outline: Check artifacts for an "Where to send" page (Mainnet)
    Given I go to page "/transaction/zksync/era/?network=era-mainnet"
    Then Element with "<Selector type>" "<Selector value>" should be "<Selector state>"

       Examples:
      | Selector type | Selector value                          | Selector state     |
      | text          | Where to send                           | visible            |
      | text          | zkSync Era Mainnet                      | visible            |
      | text          | Send inside zkSync Era Mainnet network  | visible            |
      | text          | zkSync Era Mainnet                      | clickable          |
      | text          | Ethereum Mainnet                        | visible            |
      | text          | Withdraw to Ethereum                    | visible            |
      | text          | Ethereum Mainnet                        | clickable          |
      | text          | zkSync Lite Mainnet                     | visible            |
      | text          | Send to zkSync Lite network             | visible            |
      | text          | zkSync Lite Mainnet                     | clickable          |
      | text          | Send to exchange                        | visible            |
      | text          | Send to exchange using official bridge  | visible            |
      | text          | Official bridge                         | visible            |
      | text          | Official bridge                         | clickable          |
      | text          | Layerswap                               | visible            |
      | text          | Layerswap                               | clickable          |
      | text          | Orbiter                                 | visible            |
      | text          | Orbiter                                 | clickable          |
      | text          | Send to another network                 | visible            |
      | partial src   | /img/era.svg?v=1                        | visible            |
      | partial src   | /img/era.svg?v=1                        | clickable          |
      | partial src   | /img/ethereum.svg?v=1                   | visible            |
      | partial src   | /img/ethereum.svg?v=1                   | clickable          |
      | partial src   | /img/zksync-lite.svg?v=1                | visible            |
      | partial src   | /img/zksync-lite.svg?v=1                | clickable          |   
      | partial src   | /img/layerswap.svg?v=1                  | visible            |
      | partial src   | /img/layerswap.svg?v=1                  | clickable          |
      | partial src   | /img/orbiter.svg?v=1                    | visible            |
      | partial src   | /img/orbiter.svg?v=1                    | clickable          |             

 @id1411:II @mainnet
 Scenario Outline: Check artifacts for an "Where to send" page (Mainnet)
    Given I go to page "/transaction/zksync/era/?network=era-mainnet"
    Then Arrow element for "<Link name>" external link should be "visible"
    Then Arrow element for "<Link name>" external link should be "clickable"

       Examples:
      | Link name   |
      | Layerswap   |
      | Orbiter     |

