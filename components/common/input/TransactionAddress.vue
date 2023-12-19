<template>
  <CommonContentBlock for="transaction-address-input" as="label">
    <div class="flex items-center gap-4">
      <div class="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <div class="font-bold">{{ label }}</div>
        <slot name="dropdown" />
      </div>
      <div v-if="defaultLabel" class="ml-auto text-right">
        <span class="font-bold">{{ inputVisible ? "To another account" : defaultLabel }}</span>
        <CommonButtonLabel variant="light" class="ml-1" @click="toggleCustomValue()">
          {{ inputVisible ? "Use my account" : "Change" }}
        </CommonButtonLabel>
      </div>
    </div>
    <CommonInputLine
      v-if="inputVisible"
      v-model.trim="inputted"
      :has-error="!!addressError"
      id="transaction-address-input"
      placeholder="Address or ENS"
      type="text"
      maxlength="42"
      spellcheck="false"
      autocomplete="off"
      class="mt-4 text-lg"
    />
    <CommonInputError>
      <transition v-bind="TransitionOpacity()">
        <span v-if="addressError">
          <template v-if="addressError === 'invalid_address'">Invalid Ethereum 0x address</template>
        </span>
      </transition>
    </CommonInputError>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";

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
  defaultLabel: {
    type: String,
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

const usingCustomValue = ref(false);
const toggleCustomValue = () => {
  usingCustomValue.value = !usingCustomValue.value;
  if (usingCustomValue.value) {
    nextTick(() => {
      const inputElement = document?.getElementById("transaction-address-input");
      inputElement?.focus?.();
    });
  } else {
    inputted.value = "";
  }
};

const inputVisible = computed(() => {
  return !props.defaultLabel || usingCustomValue.value || inputted.value;
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
