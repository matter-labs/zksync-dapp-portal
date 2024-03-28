<template>
  <CommonModal v-model:opened="qrCodeModalOpened" title="QR Decoding Error">
    <CommonErrorBlock :retry-button="false">{{ qrDecodeErrorMessage }}</CommonErrorBlock>

    <CommonButton
      as="label"
      for="transaction-qr-address-input"
      variant="primary"
      class="mt-6 w-full"
      @click="qrCodeModalOpened = false"
    >
      Try again
    </CommonButton>
  </CommonModal>
  <CommonQrInput :id="id" class="sr-only" @decoded="onQrCodeDecoded" @error="onQrDecodeError" />
</template>

<script lang="ts" setup>
import { isAddress } from "ethers/lib/utils";

defineProps({
  id: {
    type: String,
  },
});

const emit = defineEmits<{
  (eventName: "decoded-address", address: string): void;
}>();

const qrDecodeErrorMessage = ref<string>();
const qrCodeModalOpened = ref(false);
const onQrDecodeError = (message: string) => {
  qrDecodeErrorMessage.value = message;
  qrCodeModalOpened.value = true;
};
const onQrCodeDecoded = (data: string) => {
  if (isAddress(data)) {
    emit("decoded-address", checksumAddress(data));
  } else {
    onQrDecodeError("QR code doesn't contain a valid ethereum address");
  }
};
</script>
