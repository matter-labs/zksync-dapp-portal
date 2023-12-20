<template>
  <CommonButtonLineWithImg as="div" class="address-card-loader">
    <template #image>
      <CommonContentLoader class="address-avatar-img" />
    </template>
    <template #default>
      <CommonButtonLineBodyInfo class="text-left">
        <template #label>
          <CommonContentLoader :length="36" />
        </template>
        <template #underline>
          <CommonContentLoader :length="26" />
        </template>
      </CommonButtonLineBodyInfo>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.address-card-loader {
  @apply pointer-events-none select-none;
  .address-avatar-img {
    @apply block aspect-square h-full w-full rounded-full;
  }
}
</style>
