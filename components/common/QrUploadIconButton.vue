<template>
  <label class="qr-upload-icon-button">
    <QrCodeIcon class="aspect-square h-full w-auto" aria-hidden="true" />
    <CommonQrAddressInput id="transaction-qr-address-input" @selected="emit('decoded-address', $event)" />
  </label>
</template>

<script lang="ts" setup>
import { QrCodeIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits<{
  (eventName: "decoded-address", address: string): void;
}>();
</script>

<style lang="scss" scoped>
.qr-upload-icon-button {
  @apply aspect-square scale-125 cursor-pointer rounded p-0.5 transition-colors hover:bg-gray-300;
  @apply dark:hover:bg-neutral-700;
}
</style>
