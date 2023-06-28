import { useStorage } from "@vueuse/core";
import { getAddress, isAddress } from "ethers/lib/utils";
import { defineStore, storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

export type Version = "lite" | "era";

export const usePreferencesStore = defineStore("preferences", () => {
  const { account } = storeToRefs(useOnboardStore());

  const version = useStorage<Version>("version", "era");

  const previousTransactionAddress = useStorage<{ [userAddress: string]: string }>("last-transaction-address", {});

  return {
    version,

    previousTransactionAddress: computed({
      get: () => {
        if (!account.value.address) {
          return undefined;
        }
        const lastAddress = previousTransactionAddress.value[account.value.address];
        if (isAddress(lastAddress)) {
          return getAddress(lastAddress) as string;
        }
        return undefined;
      },
      set: (address?: string) => {
        if (!account.value.address || !address) {
          return;
        }
        address = getAddress(address);
        if (address === account.value.address) {
          return;
        }
        previousTransactionAddress.value[account.value.address] = address;
      },
    }),
  };
});
