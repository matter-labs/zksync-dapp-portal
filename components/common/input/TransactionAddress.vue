<template>
  <CommonInputContainer for="transaction-address-input">
    <div class="font-bold">{{ label }}</div>
    <CommonInputLine
      :has-error="!!addressError"
      id="transaction-address-input"
      class="mt-4 text-lg"
      v-model.trim="inputted"
      placeholder="Address or ENS"
      type="text"
      maxlength="42"
      spellcheck="false"
      autocomplete="off"
    />
    <CommonInputError>
      <transition v-bind="TransitionOpacity()">
        <span v-if="addressError">
          <template v-if="addressError === 'invalid_address'">Invalid Ethereum 0x address</template>
        </span>
      </transition>
    </CommonInputError>
  </CommonInputContainer>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";

import { isAddress } from "viem";

/* import useEns from "@/composables/useEnsName"; */

const props = defineProps({
  label: {
    type: String,
    default: "Receiver",
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (eventName: "update:error", error?: string): void;
  (eventName: "update:modelValue", amount: string): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const isAddressValid = computed(() => isAddress(inputted.value));
const addressError = computed(() => {
  if (inputted.value && !isAddressValid.value) {
    return "invalid_address";
  }
  return undefined;
});
watch(
  addressError,
  (value) => {
    emit("update:error", value);
  },
  { immediate: true }
);
/* const { address: ensAddress, inProgress: ensParseInProgress, error: ensParseError, parseEns } = useEns(inputted); */
</script>
