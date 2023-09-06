<template>
  <Popover class="header-dropdown-popover" v-slot="{ open }">
    <div class="button-container" @mouseover="toggleMenu(open, true)">
      <PopoverButton
        ref="button"
        class="popover-toggle-button"
        :class="[!open ? '' : 'opacity-70']"
        aria-label="Toggle menu list"
      >
        <slot />
      </PopoverButton>
      <div @mouseover="toggleMenu(open, true)" class="link-btn">
        <slot name="linkBtn" />
      </div>
      <PopoverPanel class="popover-panel" @mouseleave="toggleMenu(open, false)">
        <slot name="items" />
      </PopoverPanel>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const props = defineProps({
  onHover: {
    type: Boolean,
    default: false,
  },
});

const button = ref<{ $el?: HTMLButtonElement } | null>(null);
function toggleMenu(isOpened: boolean, open: boolean) {
  if (!props.onHover || !button.value?.$el) {
    return;
  }
  if ((open && !isOpened) || (!open && isOpened)) {
    button.value.$el.click();
  }
  if (!open && isOpened) {
    button.value.$el.blur();
  }
}
</script>

<style lang="scss">
.header-dropdown-popover {
  @apply w-max;

  .popover-toggle-button {
    @apply text-base outline-none ring-0;
  }
  .popover-panel {
    @apply absolute left-1/2 top-[4.5rem] z-20 w-[700px] -translate-x-1/2 transform cursor-default rounded-lg bg-gray/10 text-left shadow-lg backdrop-blur-xl dark:bg-neutral-950/60;

    > * {
      @apply block px-6 py-4 text-base;
    }
  }
  .link-btn {
    @apply inline;
  }
  .button-container {
    @apply flex h-full cursor-pointer items-center px-4;
  }
}
</style>
