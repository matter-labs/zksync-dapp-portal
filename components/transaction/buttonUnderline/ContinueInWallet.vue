<template>
  <CommonButtonUnderlineText :opened="opened">Continue in your {{ walletName }} wallet</CommonButtonUnderlineText>
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
