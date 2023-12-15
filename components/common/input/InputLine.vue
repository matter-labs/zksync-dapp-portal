<template>
  <input v-model="inputted" class="input-line" :class="{ 'has-error': hasError }" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<style lang="scss" scoped>
.input-line {
  @apply block w-full overflow-hidden border-b-2 bg-transparent leading-snug outline-none transition placeholder:text-gray-secondary dark:placeholder:text-neutral-400;
  @apply border-neutral-800 hover:border-neutral-600 focus:border-white;
  &.has-error {
    @apply border-error-300;
  }
}
</style>
