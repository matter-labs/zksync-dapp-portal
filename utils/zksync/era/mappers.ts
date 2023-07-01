import { BigNumber } from "ethers";
import { BOOTLOADER_FORMAL_ADDRESS } from "zksync-web3/build/src/utils";

import type { ApiTransaction, TokenTransfer } from "@/store/zksync/era/transactionsHistory";
import type { Token } from "@/types";

import { ETH_L2_ADDRESS } from "@/utils/constants";
import { checksumAddress } from "@/utils/formatters";

function mapBalanceChange(tokenTransfer: TokenTransfer) {
  return {
    ...tokenTransfer,
    from: checksumAddress(tokenTransfer.from),
    fromNetwork: getTransactionNetworkOrigin(tokenTransfer, "from"),
    to: checksumAddress(tokenTransfer.to),
    toNetwork: getTransactionNetworkOrigin(tokenTransfer, "to"),
  };
}

type ExtendedTokenTransfer = ReturnType<typeof mapBalanceChange>;

function sumTokenTransfers(transfers: ExtendedTokenTransfer[], address: string): { [tokenAddress: string]: string } {
  const result: { [tokenAddress: string]: BigNumber } = {};

  for (const transfer of transfers) {
    const tokenAddress = transfer.tokenInfo.address;
    const amount = BigNumber.from(transfer.amount);

    if (transfer.to === address && transfer.toNetwork === "L2") {
      result[tokenAddress] = (result[tokenAddress] || BigNumber.from(0)).add(amount);
    } else if (transfer.from === address && transfer.fromNetwork === "L2") {
      result[tokenAddress] = (result[tokenAddress] || BigNumber.from(0)).sub(amount);
    }
  }

  return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, value.toString()]));
}

function getTransactionNetworkOrigin(transaction: TokenTransfer, sender: "from" | "to") {
  if (sender === "from") {
    return transaction.type === "deposit" ? "L1" : "L2";
  } else {
    return transaction.type === "withdrawal" ? "L1" : "L2";
  }
}

export function mapApiTransaction(transaction: ApiTransaction, tokens: Token[], userAddress: string) {
  function getTokenByAddress(tokenAddress: string) {
    return tokens.find((token) => token.address === tokenAddress);
  }

  const balanceChanges = transaction.balanceChanges
    .map(mapBalanceChange)
    .filter((e) => e.to === userAddress || e.from === userAddress)
    .sort((a, b) => {
      // Assign priority numbers depending on whether 'to' or 'from' fields contain BOOTLOADER_FORMAL_ADDRESS
      const getPriority = (balanceChange: TokenTransfer) => {
        if (balanceChange.to === BOOTLOADER_FORMAL_ADDRESS) return 2;
        if (balanceChange.from === BOOTLOADER_FORMAL_ADDRESS) return 3;
        return 1; // Transactions not involving BOOTLOADER_FORMAL_ADDRESS come first
      };

      return getPriority(a) - getPriority(b);
    });

  const balanceChangesByToken = sumTokenTransfers(balanceChanges, userAddress);
  const mainTransfer = balanceChanges[0] as ReturnType<typeof mapBalanceChange> | undefined;

  return {
    transactionHash: transaction.transactionHash,
    status: transaction.status,
    blockNumber: transaction.blockNumber,
    type: mainTransfer?.type,
    from: mainTransfer?.from ?? checksumAddress(transaction.initiatorAddress),
    fromNetwork: mainTransfer?.fromNetwork ?? "L2",
    to: mainTransfer?.to as string,
    toNetwork: mainTransfer?.toNetwork ?? "L2",
    token: mainTransfer?.tokenInfo?.address
      ? getTokenByAddress(checksumAddress(mainTransfer?.tokenInfo.address))
      : undefined,
    amount:
      mainTransfer?.type === "fee" ? balanceChangesByToken[mainTransfer?.tokenInfo?.address] : mainTransfer?.amount,
    feeToken: getTokenByAddress(ETH_L2_ADDRESS),
    feeAmount: transaction.fee,
    receivedAt: transaction.receivedAt,
  };
}
export type EraTransaction = ReturnType<typeof mapApiTransaction>;
