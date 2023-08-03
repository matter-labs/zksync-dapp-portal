<template>
  <ModalNetworkChangedWarning v-if="!isConnectingWallet" />
  <ModalWalletWarning />
  <ModalConnectingWalletError />

  <div class="bridge-layout dark">
    <Header />
    <main class="bridge-layout-main">
      <template v-if="step === 'select-address'">
        <CommonBackButton @click="step = 'bridge'" class="-mt-6" />
        <SelectAddress title="Bridge to" own-address-displayed @selected="selectAddress">
          <template #after-address>
            <CommonAlert v-if="route.name === 'bridge'" variant="warning" :icon="ExclamationCircleIcon" class="mt-2">
              <p>
                Please make sure the destination address is supported on zkSync Era network. Transfers to unsupported
                addresses may result in the permanent
                <span class="text-red-500">loss of funds</span>
              </p>
            </CommonAlert>
            <CommonAlert
              v-else-if="route.name === 'bridge-withdraw'"
              variant="warning"
              :icon="ExclamationCircleIcon"
              class="mt-2"
            >
              <p>
                When withdrawing to an exchange account, please make sure that your exchange supports transfers from
                smart contracts. Otherwise, this can result in
                <span class="text-red-500">loss of funds</span>
              </p>
            </CommonAlert>
          </template>
        </SelectAddress>
      </template>

      <div class="flex h-full flex-col" :class="{ hidden: step !== 'bridge' }">
        <BridgeNavigation />
        <NuxtPage :address="toAddress" @select-address="step = 'select-address'" />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { useRouteQuery } from "@vueuse/router";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import useColorMode from "@/composables/useColorMode";

import { useHead, useRoute } from "#app";
import { bridge as bridgeMeta } from "@/data/meta";
import { eraNetworks } from "@/data/networks";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { checksumAddress } from "@/utils/formatters";
import { findNetworkWithSameL1, getNetworkUrl } from "@/utils/helpers";
import SelectAddress from "@/views/SelectAddress.vue";

useHead({
  title: bridgeMeta.title,
  meta: [
    {
      property: "og:title",
      content: bridgeMeta.title,
    },
    {
      property: "og:site_name",
      content: bridgeMeta.title,
    },
    {
      name: "description",
      content: bridgeMeta.description,
    },
    {
      property: "og:description",
      content: bridgeMeta.description,
    },
  ],
});

const route = useRoute();

useColorMode().switchColorMode("dark");

const networkStore = useNetworkStore();
const { account, isConnectingWallet } = storeToRefs(useOnboardStore());
const { l1Network, version } = storeToRefs(networkStore);
if (version.value !== "era") {
  const newNetwork = (l1Network.value && findNetworkWithSameL1(l1Network.value, eraNetworks)) || eraNetworks[0];
  window.location.href = getNetworkUrl(newNetwork, route.fullPath);
}

const step = ref<"bridge" | "select-address">("bridge");

const queryAddress = useRouteQuery<string | undefined>("address", undefined, {
  transform: String,
  mode: "replace",
});
const address = computed(() => {
  if (queryAddress.value && isAddress(queryAddress.value)) {
    return checksumAddress(queryAddress.value);
  }
  return undefined;
});
const toAddress = computed(() => {
  if (!address.value) return account.value.address;
  return address.value;
});

const selectAddress = (newAddress: string) => {
  if (newAddress === account.value.address) {
    queryAddress.value = undefined;
  } else {
    queryAddress.value = newAddress;
  }
  step.value = "bridge";
};
</script>

<style lang="scss" scoped>
.bridge-layout {
  @apply relative grid grid-cols-1 grid-rows-[max-content_1fr];
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-areas:
    "header header header header"
    "menu menu menu menu";

  .bridge-layout-main {
    @apply mx-auto my-auto flex h-full w-11/12 max-w-[500px] flex-col py-4;
    @media screen and (min-width: 640px) and (min-height: 720px) {
      @apply max-h-[575px];
    }
  }
}
</style>
