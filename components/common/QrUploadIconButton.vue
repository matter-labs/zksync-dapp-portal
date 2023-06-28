<template>
  <label class="qr-upload-icon-button">
    <QrCodeIcon class="aspect-square h-full w-auto" aria-hidden="true" />
    <CommonQrAddressInput :id="id" @selected="emit('selected', $event)" />
  </label>
</template>

<script lang="ts" setup>
import { QrCodeIcon } from "@heroicons/vue/24/outline";

defineProps({
  id: {
    type: String,
  },
});

const emit = defineEmits<{
  (eventName: "selected", address: string): void;
}>();
</script>

<style lang="scss" scoped>
.qr-upload-icon-button {
  @apply aspect-square h-full w-auto scale-125 cursor-pointer rounded p-0.5 transition-colors hover:bg-gray-300;
  @apply dark:hover:bg-neutral-700;
}
</style>
