<template>
  <label
    class="flex w-full cursor-pointer items-center rounded-2xl bg-white px-3 py-2.5 outline-none ring-0 ring-primary-400 transition-colors focus-visible:ring-2 dark:bg-white/5 dark:hover:bg-white/10"
    tabindex="0"
    @keyup.enter="checked = !checked"
  >
    <div class="relative">
      <input v-model="checked" type="checkbox" class="sr-only" tabindex="-1" />
      <div
        class="flex h-6 w-6 items-center justify-center rounded-md border-2"
        :class="checked ? 'border-primary-400 bg-primary-400' : 'border-neutral-300 bg-white'"
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
