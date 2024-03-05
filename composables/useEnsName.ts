import { useMemoize } from "@vueuse/core";
import { getEnsAddress } from "@wagmi/core";

import { wagmiConfig } from "@/data/wagmi";

export default (ensName: Ref<string>) => {
  const fetchEnsAddress = useMemoize((name: string) => getEnsAddress(wagmiConfig, { name, chainId: 1 }));

  const nameToAddress = ref<{ [name: string]: string }>({});
  const {
    inProgress,
    error,
    execute: parseEns,
  } = usePromise(
    async () => {
      const name = ensName.value;
      const result = await fetchEnsAddress(name);
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
