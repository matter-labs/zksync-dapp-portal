export enum Extension {
  specifiedExtensionUrl = "chrome-extension://",
  allExtensionsUrl = "chrome://extensions/",
  metamaskHomeHtml = "/home.html",
  metamaskInitialize = "#initialize/welcome",
  metamaskAdvSettings = "#settings/advanced",
  metamaskNetworkSettings = "#settings/networks",
}

export enum MetamaskWallet {
  mainWalletPassword = "Metamask1231",
  // depositWallet = "0x45E9a7CF8aA8e22801551c8b90E3447aC4359d92",
  // withdrawWallet = "0xd9d2d6d204b9227d98a54fd3e4390d2156a36df4",
  mainWallet = "0x586607935E1462ab762F438E0A7b2968A4158975",
  secondWallet = "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37",
  emptyWallet = "0xa9654a6f77bd36ac77201fe5e16afa97f53a4bdf",
}

export enum NetworkSwitcher {
  zkSyncEraGoerli = "/?network=era-goerli",
  zkSyncEraMainnet = "/?network=era-mainnet",
}

export enum Routes {
  withdraw = "/transaction/zksync/era/withdraw",
  deposit = "/transaction/zksync/era/deposit",
}
