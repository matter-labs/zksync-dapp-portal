import { computed, ref } from "vue";

import { useStorage } from "@vueuse/core";
import { /* $fetch, */ FetchError } from "ohmyfetch";

import type { Ref } from "vue";

/* const FAUCET_API_URL = "https://testnet2-faucet.zksync.dev/ask_money"; */

export default (receiverAddress: Ref<string | undefined>) => {
  const success = ref(false);
  const data = {
    turnstileToken: "",
  };
  const storageFaucetUsedTime = useStorage<{ [receiverAddress: string]: string | undefined }>("faucet-used-time", {});
  const faucetUsedTime = computed<string | undefined>({
    get: () => {
      if (receiverAddress.value && typeof storageFaucetUsedTime.value[receiverAddress.value] === "string") {
        return storageFaucetUsedTime.value[receiverAddress.value];
      }
      return undefined;
    },
    set: (timestamp: string | undefined) => {
      if (!receiverAddress.value) return undefined;
      storageFaucetUsedTime.value[receiverAddress.value] = timestamp;
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
        success.value = false;
        /* await $fetch(FAUCET_API_URL, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: {
            receiverAddress: receiverAddress.value,
            "cf-turnstile-response": data.turnstileToken,
          },
        }); */
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
