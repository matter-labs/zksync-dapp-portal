import { getEnsAvatar, getEnsName } from "@wagmi/core";

import { wagmiConfig } from "@/data/wagmi";

export const useEnsStore = defineStore("ens", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);

  const ensName = ref<string | null>(null);
  const ensAvatar = ref<string | null>(null);

  const fetchEnsData = async () => {
    ensName.value = null;
    ensAvatar.value = null;

    if (!account.value.address) {
      return;
    }

    const initialAddress = account.value.address;
    const name = await getEnsName(wagmiConfig, { address: account.value.address, chainId: 1 });
    if (account.value.address === initialAddress) {
      ensName.value = name;
    } else {
      return;
    }
    if (name) {
      const avatar = await getEnsAvatar(wagmiConfig, { name, chainId: 1 }).catch(() => null);
      if (account.value.address === initialAddress) {
        ensAvatar.value = avatar;
      }
    }
  };

  fetchEnsData();

  onboardStore.subscribeOnAccountChange(() => {
    fetchEnsData();
  });

  return {
    name: computed(() => ensName.value),
    avatar: computed(() => ensAvatar.value),
  };
});
