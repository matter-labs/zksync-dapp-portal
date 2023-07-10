<template>
  <label class="flex w-full cursor-pointer items-center rounded-2xl bg-white px-3 py-2.5 dark:bg-white/5">
    <div class="relative">
      <input type="checkbox" v-model="checked" class="sr-only" tabindex="-1" />
      <div
        class="flex h-6 w-6 items-center justify-center rounded-md border-2 border-gray-300 bg-white outline-none ring-primary-400 ring-offset-2 focus:ring-2"
        v-bind:class="{ 'bg-primary-600 border-primary-600': checked }"
        tabindex="0"
        @keyup.enter="checked = !checked"
      >
        <svg v-if="checked" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <div class="ml-3 text-sm font-medium leading-6">
      <slot />
    </div>
  </label>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits<{
  (eventName: "update:modelValue", value: boolean): void;
}>();

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});
</script>
