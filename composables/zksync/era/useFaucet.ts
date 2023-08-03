import { computed, ref } from "vue";

import { useStorage } from "@vueuse/core";
import { $fetch, FetchError } from "ohmyfetch";

import type { EraNetwork } from "@/data/networks";
import type { ComputedRef } from "vue";

export default (receiverAddress: ComputedRef<string | undefined>, eraNetwork: ComputedRef<EraNetwork>) => {
  const success = ref(false);
  const data = {
    turnstileToken: "",
  };
  const storageFaucetUsedTime = useStorage<{ [networkKey: string]: string | undefined }>("faucet-used-time", {});
  const faucetUsedTime = computed<string | undefined>({
    get: () => {
      if (receiverAddress.value && typeof storageFaucetUsedTime.value[eraNetwork.value.key] === "string") {
        return storageFaucetUsedTime.value[eraNetwork.value.key];
      }
      return undefined;
    },
    set: (timestamp: string | undefined) => {
      storageFaucetUsedTime.value[eraNetwork.value.key] = timestamp;
    },
  });
  const faucetAvailableTime = computed(() => {
    if (!faucetUsedTime.value) return undefined;
    const date = new Date(faucetUsedTime.value);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  });

  const { inProgress, error, execute, reset } = usePromise(
    async () => {
      try {
        if (!eraNetwork.value.faucetUrl) throw new Error("Faucet is not available for this network");

        success.value = false;
        await $fetch(eraNetwork.value.faucetUrl, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: {
            receiverAddress: receiverAddress.value,
            "cf-turnstile-response": data.turnstileToken,
          },
        });
        faucetUsedTime.value = new Date().toISOString();
        success.value = true;
      } catch (err) {
        if (err instanceof FetchError) {
          if (typeof err.data === "string") {
            if (err.data.includes("address has already received money for the last 24 hours")) {
              throw new Error("You can only request test tokens once every 24 hours.");
            } else if (err.data.includes("faucet is empty")) {
              throw new Error("At the moment faucet is empty. Please try again later.");
            }
            throw new Error(err.data.replace(/^Error: /, ""));
          } else if (typeof err.data?.response === "string") {
            if (err.data.response.includes("Turnstile widget validation failed")) {
              throw new Error(
                "We were not able to validate that you're a human. Please reload the page and try again."
              );
            }
            throw new Error(err.data.response.replace(/^Error: /, ""));
          }
        }
        throw err;
      }
    },
    { cache: false }
  );

  const requestTestTokens = (turnstileToken: string) => {
    data.turnstileToken = turnstileToken;
    return execute();
  };
  return {
    faucetAvailableTime,
    success,
    inProgress,
    error,
    requestTestTokens,
    reset: () => {
      reset();
      success.value = false;
    },
  };
};
