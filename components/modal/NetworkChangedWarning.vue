<template>
  <CommonModal
    v-model:opened="modalOpened"
    title="Network switched"
    @after-leave="networkStore.resetNetworkChangeWarning"
  >
    <p class="leading-normal">
      The selected network has been automatically changed
      <span v-if="lastSelectedNetwork"
        >from <span class="font-medium">{{ lastSelectedNetwork.name }}</span>
      </span>
      to
      <span class="font-medium">{{ selectedNetwork.name }}</span> since your last use of zkSync Portal.
    </p>
    <div class="mt-10 flex flex-col items-center">
      <CommonButtonTopLink v-if="lastSelectedNetwork" as="a" :href="getNetworkUrl(lastSelectedNetwork, route.fullPath)">
        Return to {{ lastSelectedNetwork?.name }}
      </CommonButtonTopLink>
      <CommonButton variant="primary-solid" @click="closeModal">Continue on {{ selectedNetwork.name }}</CommonButton>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import { storeToRefs } from "pinia";

import { useRoute } from "#app";
import { useNetworkStore } from "@/store/network";
import { getNetworkUrl } from "@/utils/helpers";

const networkStore = useNetworkStore();
const { selectedNetwork, networkChangedWarning, lastSelectedNetwork } = storeToRefs(networkStore);

const route = useRoute();

const modalOpened = ref(networkChangedWarning.value);
watch(networkChangedWarning, (val) => {
  modalOpened.value = val;
});

const closeModal = () => {
  modalOpened.value = false;
};
</script>
