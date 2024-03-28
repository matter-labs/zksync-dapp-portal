<template>
  <CommonButtonUnderlineText :opened="opened">
    Confirm this transaction in your {{ walletName }} wallet
  </CommonButtonUnderlineText>
</template>

<script lang="ts" setup>
defineProps({
  opened: {
    type: Boolean,
    required: true,
  },
});

const { walletName } = storeToRefs(useOnboardStore());
</script>
