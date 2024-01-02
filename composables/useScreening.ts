/* import { $fetch } from "ofetch"; */
import { useMemoize } from "@vueuse/core";

/* Returns void if address screening was successful */
/* Fails if address screening was unsuccessful */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateAddress = useMemoize(async (address: string) => {
  /* const response = await $fetch(`${env.API_URL}/check-address/${address}`); */
  // TODO: remove mock
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // throw new Error("We were unable to process this transaction...");
});

export default () => {
  return {
    validateAddress,
  };
};
