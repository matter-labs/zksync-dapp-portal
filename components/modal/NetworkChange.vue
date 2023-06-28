<template>
  <CommonModal v-bind="$attrs" title="Change network" @close="closeModal">
    <div class="mb-2 flex items-center justify-between gap-2">
      <DestinationLabel label="zkSync Era∎" :icon="IconsEra" />
      <div class="text-right text-sm leading-tight text-gray-secondary dark:text-neutral-400 md:text-base">
        Preferred network
      </div>
    </div>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-for="item in chains"
        :key="item.network"
        :label="`zkSync Era ${item.name}`"
        :icon="isNetworkSelected(item.network, 'era') ? CheckIcon : undefined"
        :icon-url="item.iconUrl"
        @click="buttonClicked(item, 'era')"
      >
        <template #image>
          <IconsEra class="aspect-square h-full w-full object-center p-2" />
        </template>
      </DestinationItem>
    </CommonCardWithLineButtons>

    <DestinationLabel label="zkSync Lite" :icon="IconsZkSyncLite" class="mb-2 mt-4" />
    <CommonCardWithLineButtons>
      <DestinationItem
        v-for="item in chains"
        :key="item.network"
        :label="`zkSync Lite ${item.name}`"
        :icon="isNetworkSelected(item.network, 'lite') ? CheckIcon : undefined"
        :icon-url="item.iconUrl"
        @click="buttonClicked(item, 'lite')"
      >
        <template #image>
          <IconsZkSyncLite class="aspect-square h-full w-full object-center p-2" />
        </template>
      </DestinationItem>
    </CommonCardWithLineButtons>
  </CommonModal>
</template>

<script lang="ts" setup>
import { CheckIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import IconsEra from "@/components/icons/Era.vue";
import IconsZkSyncLite from "@/components/icons/zkSyncLite.vue";

import type { ExtendedChain } from "@/store/network";
import type { Version } from "@/store/preferences";

import { useRoute, useRouter } from "#app";
import { chains, useNetworkStore } from "@/store/network";
import { usePreferencesStore } from "@/store/preferences";
import { getNetworkUrl, replaceVersionInString } from "@/utils/helpers";

const emit = defineEmits<{
  (eventName: "update:opened", state: boolean): void;
}>();

const route = useRoute();
const router = useRouter();

const { version: selectedZkSyncVersion } = storeToRefs(usePreferencesStore());
const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const isNetworkSelected = (network: string, version: Version) =>
  selectedEthereumNetwork.value.network === network && version === selectedZkSyncVersion.value;

const getRouteWithCurrentVersion = () => {
  try {
    const newRoute = router.resolve({
      name: replaceVersionInString(route.name?.toString() || "", selectedZkSyncVersion.value),
      query: route.query,
      params: route.params,
    });
    return newRoute.name ? newRoute : router.resolve({ name: "index" });
  } catch {
    return router.resolve({ name: "index" });
  }
};
const buttonClicked = (network: ExtendedChain, version: Version) => {
  if (isNetworkSelected(network.network, version)) {
    closeModal();
  } else if (version === selectedZkSyncVersion.value && selectedEthereumNetwork.value.network !== network.network) {
    window.location.href = getNetworkUrl(network, route.fullPath);
  } else if (version !== selectedZkSyncVersion.value && selectedEthereumNetwork.value.network === network.network) {
    selectedZkSyncVersion.value = version;
    router.push(getRouteWithCurrentVersion());
    closeModal();
  } else {
    selectedZkSyncVersion.value = version;
    window.location.href = getNetworkUrl(network, getRouteWithCurrentVersion().fullPath);
  }
};
const closeModal = () => emit("update:opened", false);
</script>
