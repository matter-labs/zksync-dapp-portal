<template>
  <component :is="as" class="small-input-container" :class="{ focused }">
    <div v-if="$slots.icon" class="small-input-icon-container">
      <slot name="icon" />
    </div>
    <input
      ref="inputElement"
      v-model="inputted"
      class="small-input-field"
      :placeholder="placeholder"
      :type="type"
      :maxlength="maxLength"
      spellcheck="false"
    />
    <transition v-bind="TransitionOpacity()" mode="out-in">
      <button v-if="inputted" class="small-input-clear-button" type="button" @click="inputted = ''">
        <XMarkIcon class="small-input-clear-button-icon" aria-hidden="true" />
      </button>
      <slot v-else name="right" />
    </transition>
  </component>
</template>

<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useFocus } from "@vueuse/core";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  maxLength: {
    type: Number,
    default: 50,
  },
  type: {
    type: String,
    default: "text",
  },
  autofocus: {
    type: [Boolean, String] as PropType<boolean | "desktop">,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string): void;
}>();

const inputElement = ref<HTMLInputElement | null>(null);
const { focused } = useFocus(inputElement, {
  initialValue: props.autofocus === true || (props.autofocus === "desktop" && isMobile() === false),
});

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<style lang="scss">
.small-input-container {
  @apply flex h-12 w-full items-center rounded-3xl bg-gray-input px-4 py-3 transition-colors dark:bg-neutral-900;
  &.focused,
  &:hover {
    @apply bg-gray-input-focus dark:bg-neutral-800;

    .small-input-clear-button {
      @apply bg-gray-400 dark:bg-neutral-500;
    }
  }

  .small-input-icon-container {
    @apply flex h-5 w-5 flex-none items-center justify-center text-gray-secondary dark:text-neutral-400;

    svg {
      @apply block aspect-square h-full w-full;
    }
  }
  .small-input-field {
    @apply mx-2 w-full truncate rounded-none border-none bg-transparent outline-none placeholder:text-gray-secondary dark:placeholder:text-neutral-400;
  }
  .small-input-clear-button {
    @apply block aspect-square h-6 w-6 self-end rounded-full bg-gray-300 p-1 transition-all dark:bg-neutral-800;
    &:hover {
      @apply bg-gray-500 dark:bg-neutral-600;
    }

    .small-input-clear-button-icon {
      @apply h-full w-full text-white;
    }
  }
}
</style>
