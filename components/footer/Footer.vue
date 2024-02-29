<template>
  <footer class="footer">
    <div>
      <CommonButtonLabel v-if="showAddNetworkButton" @click="addNetworkToWallet()">
        Add {{ eraNetwork.name }} to your wallet
      </CommonButtonLabel>
    </div>
    <div class="links-container">
      <CommonButtonLabel as="a" href="https://zksync.io/terms" target="_blank" class="footer-link">
        Terms of Service
      </CommonButtonLabel>
      <CommonButtonLabel as="a" href="https://zksync.io/privacy" target="_blank" class="footer-link">
        Privacy Policy
      </CommonButtonLabel>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const eraWalletStore = useZkSyncWalletStore();
const { isCorrectNetworkSet } = storeToRefs(eraWalletStore);
const { isConnected, connectorName } = storeToRefs(useOnboardStore());
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const addNetworkToWallet = async () => {
  await eraWalletStore.setCorrectNetwork();
};

const showAddNetworkButton = computed(() => {
  return isConnected.value && !isCorrectNetworkSet.value && connectorName.value !== "WalletConnect";
});
</script>

<style lang="scss" scoped>
.footer {
  @apply flex flex-col items-center justify-between gap-x-8 gap-y-4 px-4 py-8 sm:flex-row;

  .links-container {
    @apply flex w-max flex-wrap items-center justify-center gap-x-8 gap-y-4 whitespace-nowrap;
  }
}
</style>
