import { watch } from "vue";

import { useMemoize } from "@vueuse/core";
import { fetchEnsAddress } from "@wagmi/core";

import type { Ref } from "vue";

const getEnsAddress = useMemoize((name: string) => fetchEnsAddress({ name: name, chainId: 1 }));

export default (ensName: Ref<string>) => {
  const nameToAddress = ref<{ [name: string]: string }>({});
  const {
    inProgress,
    error,
    execute: parseEns,
  } = usePromise(
    async () => {
      const name = ensName.value;
      const result = await getEnsAddress(name);
      if (result) {
        nameToAddress.value[name] = result;
      }
    },
    { cache: false }
  );

  const isValidEnsFormat = computed(() => ensName.value.endsWith(".eth"));
  watch(
    ensName,
    async () => {
      if (isValidEnsFormat.value) {
        await parseEns();
      }
    },
    { immediate: true }
  );

  return {
    address: computed(() => nameToAddress.value[ensName.value]),
    isValidEnsFormat,
    inProgress,
    error,
    parseEns,
  };
};
