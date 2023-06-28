import { ref } from "vue";

import { $fetch, FetchError } from "ohmyfetch";

const FAUCET_API_URL = "https://testnet2-faucet.zksync.dev/ask_money";

export default () => {
  const isRequestPending = ref(false);
  const isRequestFailed = ref(false);
  const success = ref(false);
  const errorMessage = ref<string>("");

  const requestTestTokens = async (address: string, turnstileToken: string) => {
    isRequestPending.value = true;
    isRequestFailed.value = false;
    success.value = false;

    try {
      await $fetch(FAUCET_API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: {
          receiverAddress: address,
          "cf-turnstile-response": turnstileToken,
        },
      });
      success.value = true;
    } catch (e: unknown) {
      if (e instanceof FetchError) {
        if (typeof e.data === "string" && e.data.includes("address has already received money for the last 24 hours")) {
          errorMessage.value = "already_received";
        } else if (typeof e.data === "string" && e.data.includes("faucet is empty")) {
          errorMessage.value = "faucet_is_empty";
        } else if (
          typeof e.data === "object" &&
          e.data.response &&
          e.data.response.includes("Turnstile widget validation failed")
        ) {
          errorMessage.value = "turnstile_validation_failed";
        } else {
          errorMessage.value = "unknown_error";
        }
      } else {
        errorMessage.value = formatError(e as Error)?.message ?? "";
      }
      isRequestFailed.value = true;
    } finally {
      isRequestPending.value = false;
    }
  };
  return {
    isRequestPending,
    isRequestFailed,
    success,
    errorMessage,
    requestTestTokens,
  };
};
