<template>
  <CommonHeightTransition :opened="visible">
    <CommonContentBlock v-bind="$attrs">
      <button class="mb-2.5 flex w-full items-center justify-between" @click="opened = !opened">
        <span class="align-middle">
          {{ label }}
          <transition v-bind="TransitionAlertScaleInOutTransition">
            <span
              v-if="activeTransactions"
              class="-my-1 inline-block h-max w-auto rounded-full bg-primary-300 p-0.5 px-2 text-sm"
            >
              {{ activeTransactions }}
            </span>
          </transition>
        </span>
        <ChevronDownIcon class="h-4 w-4 transition-transform" :class="{ '-rotate-180': opened }" />
      </button>
      <CommonHeightTransition :tabindex="-1" class="-mx-3 -mb-3" :opened="opened">
        <slot v-bind="{ opened }" />
      </CommonHeightTransition>
    </CommonContentBlock>
  </CommonHeightTransition>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { ref } from "vue";

import { ChevronDownIcon } from "@heroicons/vue/24/outline";

defineProps({
  visible: {
    type: Boolean,
  },
  label: {
    type: String,
    required: true,
  },
  activeTransactions: {
    type: Number,
  },
});

const opened = ref(false);
</script>

<style lang="scss" scoped></style>
