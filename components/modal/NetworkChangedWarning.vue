<template>
  <CommonModal v-model:opened="modalOpened" title="Network switched" @after-leave="afterModalLeave">
    <p class="leading-normal">
      The selected network has been automatically changed
      <span v-if="lastSelectedNetwork"
        >from <span class="font-medium">{{ lastSelectedNetwork.name }}</span>
      </span>
      to
      <span class="font-medium">{{ selectedNetwork.name }}</span> since your last use of zkSync Portal.
    </p>
    <TypographyCategoryLabel class="-mb-2.5">Optional settings</TypographyCategoryLabel>
    <CommonCheckbox v-model="doNotSwitchNetwork">Do not switch network automatically</CommonCheckbox>
    <CommonCheckbox v-model="warningDisabled" class="mt-1">Do not show this warning</CommonCheckbox>
    <div class="mt-4 flex flex-col items-center">
      <CommonButtonTopLink
        v-if="lastSelectedNetwork"
        as="a"
        :href="getNetworkUrl(lastSelectedNetwork, route.fullPath)"
        @click="setCheckboxValues"
      >
        Return to {{ lastSelectedNetwork?.name }}
      </CommonButtonTopLink>
      <CommonButton variant="primary" class="w-full" @click="closeModal">
        Continue on {{ selectedNetwork.name }}
      </CommonButton>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
const networkStore = useNetworkStore();
const {
  selectedNetwork,
  networkChangedWarning,
  networkChangedWarningDisabled,
  lastSelectedNetwork,
  networkUsesLocalStorage,
} = storeToRefs(networkStore);

const route = useRoute();

const modalOpened = ref(networkChangedWarning.value);
watch(networkChangedWarning, (val) => {
  modalOpened.value = val;
});

const doNotSwitchNetwork = ref(networkUsesLocalStorage.value);
watch(networkUsesLocalStorage, (val) => {
  doNotSwitchNetwork.value = val;
});
const warningDisabled = ref(networkChangedWarningDisabled.value);
watch(networkChangedWarningDisabled, (val) => {
  warningDisabled.value = val;
});

const setCheckboxValues = () => {
  networkUsesLocalStorage.value = doNotSwitchNetwork.value;
  networkChangedWarningDisabled.value = warningDisabled.value;
};
const closeModal = () => {
  modalOpened.value = false;
};
const afterModalLeave = () => {
  networkStore.resetNetworkChangeWarning();
  setCheckboxValues();
};
</script>
