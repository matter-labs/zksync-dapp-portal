<template>
  <div class="fee-details-container">
    <span>{{ label }}</span>
    <div class="flex flex-col items-end xs:flex-row xs:items-center">
      <div class="flex items-center" data-testid="fee-amount">
        <template v-if="loading">
          <CommonContentLoader :length="30" />
        </template>
        <component
          type="button"
          :is="canDisplayFeeAsFiat ? 'button' : 'span'"
          v-else-if="feeToken && feeAmount"
          v-tooltip="canDisplayFeeAsFiat ? 'Click to toggle how amount is displayed' : ''"
          class="flex items-center"
          :class="{ 'cursor-pointer': canDisplayFeeAsFiat }"
          @click="displayFeeAsFiat = !displayFeeAsFiat"
        >
          <transition
            enter-active-class="transition transform ease-in duration-50"
            enter-from-class="-translate-y-1.5 opacity-0"
            enter-to-class="translate-y-0"
            leave-active-class="transition transform ease-in duration-50"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1.5 opacity-0"
            mode="out-in"
          >
            <span v-if="canDisplayFeeAsFiat && displayFeeAsFiat">
              <template v-if="feeToken.price === 'loading'">
                <CommonContentLoader :length="15" />
              </template>
              <template v-else>{{ totalPrice }}</template>
              of
            </span>
            <span v-else class="break-all">{{ parseTokenAmount(feeAmount, feeToken.decimals) }}</span>
          </transition>
          <TokenImage class="ml-1 mr-0.5 h-5 w-5" v-bind="feeToken" />
          <span class="font-medium">{{ feeToken.symbol }}</span>
        </component>
        <template v-else>Unknown fee</template>
        <CommonCircleLoader
          v-if="updateDuration"
          v-tooltip="`Updating fee every ${Math.ceil(updateDuration / 1000)} seconds`"
          :duration="updateDuration"
          :active="!loading"
          class="ml-1.5 cursor-help"
          @finished="emit('update')"
        />
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import type { Token } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { formatTokenPrice, parseTokenAmount } from "@/utils/formatters";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  feeAmount: {
    type: String as PropType<BigNumberish>,
  },
  feeToken: {
    type: Object as PropType<Token>,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  updateDuration: {
    type: Number,
  },
});

const emit = defineEmits<{
  (eventName: "update"): void;
}>();

const displayFeeAsFiat = ref(true);
const canDisplayFeeAsFiat = computed(() => (props.feeToken?.price ? true : false));

const totalPrice = computed(() => {
  if (typeof props.feeToken?.price !== "number" || !props.feeAmount) {
    return "";
  }
  return formatTokenPrice(props.feeAmount, props.feeToken.decimals, props.feeToken.price);
});
</script>

<style lang="scss" scoped>
.fee-details-container {
  @apply flex items-center justify-between rounded-lg py-1.5 px-4 text-sm text-gray-secondary dark:text-neutral-400;
}
</style>
