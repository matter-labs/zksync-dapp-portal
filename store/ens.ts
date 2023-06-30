import { computed } from "vue";

import { fetchEnsAvatar, fetchEnsName } from "@wagmi/core";
import { defineStore, storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

export const useEnsStore = defineStore("ens", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);

  const ensName = ref<string | null>(null);
  const ensAvatar = ref<string | null>(null);

  const fetchName = async () => {
    return;
    ensName.value = null;
    ensAvatar.value = null;

    if (!account.value.address) {
      return;
    }

    const initialAddress = account.value.address;
    const [name, avatar] = await Promise.all([
      fetchEnsName({ address: account.value.address, chainId: 1 }),
      fetchEnsAvatar({ address: account.value.address, chainId: 1 }),
    ]);
    if (account.value.address === initialAddress) {
      ensName.value = name;
      ensAvatar.value = avatar;
    }
  };

  fetchName();

  onboardStore.subscribeOnAccountChange(() => {
    fetchName();
  });

  return {
    name: computed(() => ensName.value),
    avatar: computed(() => ensAvatar.value),
  };
});
