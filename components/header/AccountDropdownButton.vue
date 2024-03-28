<template>
  <CommonButtonDropdown>
    <template #left-icon>
      <AddressAvatar :address="account.address!" class="h-full w-full" />
    </template>
    <span ref="addressEl">{{ shortenAddress(account.address!) }}</span>
  </CommonButtonDropdown>
</template>

<script lang="ts" setup>
const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);
</script>
