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
        v-for="item in eraNetworks.filter((e) => e.visible || isNetworkSelected(e))"
        :key="item.key"
        :label="item.name"
        :icon="isNetworkSelected(item) ? CheckIcon : undefined"
        @click="buttonClicked(item)"
      >
        <template #image>
          <IconsEra class="aspect-square h-full w-full object-center p-2" />
        </template>
      </DestinationItem>
    </CommonCardWithLineButtons>

    <DestinationLabel label="zkSync Lite" :icon="IconsZkSyncLite" class="mb-2 mt-4" />
    <CommonCardWithLineButtons>
      <DestinationItem
        v-for="item in zkSyncLiteNetworks.filter((e) => e.visible || isNetworkSelected(e))"
        :key="item.key"
        :label="item.name"
        :icon="isNetworkSelected(item) ? CheckIcon : undefined"
        @click="buttonClicked(item)"
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

import type { L2Network } from "@/store/network";
import type { Version } from "@/store/preferences";

import { useRoute, useRouter } from "#app";
import { eraNetworks, useNetworkStore, zkSyncLiteNetworks } from "@/store/network";
import { getNetworkUrl, replaceVersionInString } from "@/utils/helpers";
import { getVersionByNetwork } from "@/utils/helpers";

const emit = defineEmits<{
  (eventName: "update:opened", state: boolean): void;
}>();

const route = useRoute();
const router = useRouter();

const { selectedNetwork, selectedNetworkKey, version: selectedZkSyncVersion } = storeToRefs(useNetworkStore());
const isNetworkSelected = (network: L2Network) => selectedNetwork.value.key === network.key;

const getRouteByVersion = (version: Version) => {
  try {
    const newRoute = router.resolve({
      name: replaceVersionInString(route.name?.toString() || "", version),
      query: {
        ...route.query,
        network: undefined,
      },
      params: route.params,
    });
    return newRoute.name ? newRoute : router.resolve({ name: "index" });
  } catch {
    return router.resolve({ name: "index" });
  }
};
const buttonClicked = (network: L2Network) => {
  if (isNetworkSelected(network)) {
    return closeModal();
  }
  const version = getVersionByNetwork(network);
  if (
    version === selectedZkSyncVersion.value &&
    selectedNetwork.value.l1Network.network !== network.l1Network.network
  ) {
    window.location.href = getNetworkUrl(network, route.fullPath);
  } else if (
    version !== selectedZkSyncVersion.value &&
    selectedNetwork.value.l1Network.network === network.l1Network.network
  ) {
    selectedNetworkKey.value = network.key;
    router.push(getRouteByVersion(version));
    closeModal();
  } else {
    window.location.href = getNetworkUrl(network, getRouteByVersion(version).fullPath);
  }
};
const closeModal = () => emit("update:opened", false);
</script>
