import { useMemoize } from "@vueuse/core";
import { $fetch } from "ofetch";

/* Returns void if address screening was successful */
/* Fails if address screening was unsuccessful */
const validateAddress = useMemoize(async (address: string) => {
  const runtimeConfig = useRuntimeConfig();
  if (!runtimeConfig.public.screeningApiUrl) {
    return;
  }
  const url = new URL(runtimeConfig.public.screeningApiUrl);
  url.searchParams.append("address", address);
  const response = await $fetch(url.toString()).catch(() => ({ result: true }));
  if (!response.result) {
    throw new Error("We were unable to process this transaction...");
  }
});

export default () => {
  return {
    validateAddress,
  };
};
