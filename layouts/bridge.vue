<template>
  <ModalNetworkChangedWarning v-if="!isConnectingWallet" />
  <ModalWalletWarning />

  <div class="bridge-layout dark">
    <Header />
    <main class="bridge-layout-main">
      <template v-if="step === 'select-address'">
        <CommonBackButton @click="step = 'bridge'" class="-mt-6" />
        <SelectAddress title="Bridge to" @selected="selectAddress">
          <template #after-address>
            <CommonAlert variant="warning" :icon="ExclamationCircleIcon" class="mt-2">
              <p>
                Please make sure the destination address is supported on zkSync Era network. Transfers to unsupported
                addresses may result in the permanent
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
import { storeToRefs } from "pinia";

import { useHead } from "#app";
import { useOnboardStore } from "@/store/onboard";
import SelectAddress from "@/views/SelectAddress.vue";

const meta = {
  title: "zkSync Era Bridge | Transfer funds between zkSync Era Network and Ethereum Mainnet",
  description:
    "With the zkSync Era Bridge you can easily transfer funds between Ethereum Mainnet and zkSync Era Network. Enjoy faster, cheaper and more efficient transactions with the future proof zkEVM scaling Ethereum's security and values.",
};
useHead({
  title: "zkSync Era Bridge | Transfer funds between zkSync Era Network and Ethereum Mainnet",
  meta: [
    {
      name: "og:title",
      content: meta.title,
    },
    {
      name: "description",
      content: meta.description,
    },
    {
      name: "og:description",
      content: meta.description,
    },
  ],
});

const { account, isConnectingWallet } = storeToRefs(useOnboardStore());

const step = ref<"bridge" | "select-address">("bridge");
const address = ref("");
const toAddress = computed(() => {
  if (!address.value) return account.value.address;
  return address.value;
});

const selectAddress = (newAddress: string) => {
  address.value = newAddress;
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
      @apply max-h-[545px];
    }
  }
}
</style>
