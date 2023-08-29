<template>
  <div>
    <TokenSelectDropdown
      v-model:opened="selectTokenModalOpened"
      v-model:token-address="selectedTokenAddress"
      :loading="loading"
      :tokens="tokens"
      :balances="balances"
    >
      <template #body-bottom v-if="$slots['token-dropdown-bottom']">
        <slot name="token-dropdown-bottom" />
      </template>
    </TokenSelectDropdown>
    <label for="amount-input" class="amount-input-container" :class="{ focused, loading, 'has-error': !!amountError }">
      <div class="amount-input-token">
        <CommonContentLoader v-if="loading" :length="14" />
        <template v-else-if="selectedToken">
          <button
            type="button"
            class="flex w-max items-center space-x-1.5"
            @click.prevent="selectTokenModalOpened = true"
            data-testid="token-dropDown"
          >
            <TokenImage class="-ml-0.5 h-5 w-5" v-bind="selectedToken" />
            <span class="inline-block">{{ selectedToken.symbol }}</span>
            <ChevronDownIcon class="h-4 w-4 text-gray-secondary dark:text-neutral-400" aria-hidden="true" />
          </button>
        </template>
      </div>
      <div class="amount-input-field-container">
        <input
          id="amount-input"
          ref="inputElement"
          v-model="inputted"
          class="amount-input-field"
          placeholder="0"
          type="text"
          maxlength="25"
          spellcheck="false"
          autocomplete="off"
          :style="{ width: `${inputWidth}px` }"
          @keyup.enter="emit('enter')"
        />
        <transition v-bind="TransitionOpacity(250, 150)">
          <button
            v-if="maxDecimalAmount && maxAmount !== '0'"
            type="button"
            class="amount-input-max-button"
            :class="{ 'is-max': isMaxAmount }"
            :title="isMaxAmount ? 'Max amount is set' : `Your max amount is ${maxDecimalAmount}`"
            @click.prevent="setMax"
          >
            Max
          </button>
        </transition>
      </div>
      <div class="amount-input-select-asset">
        <CommonContentLoader v-if="loading" :length="35" />
        <span v-else class="text-left leading-tight wrap-balance" @click="selectTokenModalOpened = true">
          <template v-if="tokenBalance">
            Balance:
            <span class="break-all" :title="formattedTokenBalance">
              {{
                typeof tokenBalance.price === "number"
                  ? removeSmallAmount(tokenBalance.amount, tokenBalance.decimals, tokenBalance.price)
                  : formattedTokenBalance
              }}
            </span>
          </template>
          <template v-else-if="!selectedToken">Select token</template>
          <template v-else>Connect wallet to see balance</template>
        </span>
      </div>
      <transition v-bind="TransitionOpacity()">
        <div v-if="amountError" class="amount-input-error">
          <template v-if="amountError === 'insufficient_balance' || maxDecimalAmount === '0'">
            Insufficient balance
          </template>
          <template v-else-if="amountError === 'exceeds_balance' && !maxAmount">Amount exceeds balance</template>
          <template v-else-if="amountError === 'exceeds_max_amount' || amountError === 'exceeds_balance'">
            Max amount is
            <button
              type="button"
              class="cursor-pointer font-medium underline underline-offset-2"
              @click.prevent="setMax"
            >
              {{ maxDecimalAmount }}
            </button>
          </template>
          <template v-else-if="amountError === 'exceeds_decimals'">
            Max decimal length for {{ selectedToken?.symbol }} is {{ selectedToken?.decimals }}
          </template>
        </div>
        <div v-else-if="inputted" class="amount-input-note">
          <template v-if="selectedToken?.price === 'loading'">
            <CommonContentLoader class="shadow-sm" :length="15" />
          </template>
          <template v-else>
            {{ totalAmountPrice }}
          </template>
        </div>
      </transition>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";

import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useFocus } from "@vueuse/core";
import { BigNumber } from "ethers";

import type { Token, TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { decimalToBigNumber, formatTokenPrice, parseTokenAmount } from "@/utils/formatters";
import { TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  tokens: {
    type: Array as PropType<Token[]>,
    default: () => [],
  },
  balances: {
    type: Array as PropType<TokenAmount[]>,
    default: () => [],
    required: true,
  },
  tokenAddress: {
    type: String,
  },
  maxAmount: {
    type: String as PropType<BigNumberish>,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "enter"): void;
  (eventName: "update:error", error?: string): void;
  (eventName: "update:modelValue", amount: string): void;
  (eventName: "update:tokenAddress", tokenAddress?: string): void;
}>();

const selectedTokenAddress = computed({
  get: () => props.tokenAddress,
  set: (value?: string) => emit("update:tokenAddress", value),
});
const selectedToken = computed(() => {
  const tokens = props.balances.length ? props.balances : props.tokens;
  if (!tokens) {
    return undefined;
  }
  return tokens.find((e) => e.address === props.tokenAddress);
});
const tokenBalance = computed(() => {
  if (!props.balances.length || !selectedToken.value) {
    return undefined;
  }
  return props.balances.find((e) => e.address === selectedToken.value?.address);
});
const formattedTokenBalance = computed(() => {
  if (!tokenBalance.value) {
    return undefined;
  }
  return parseTokenAmount(tokenBalance.value.amount, tokenBalance.value.decimals);
});
const selectTokenModalOpened = ref(false);

const inputElement = ref<HTMLInputElement | null>(null);
const { focused } = useFocus(inputElement, { initialValue: !!props.autofocus });
const inputWidth = ref(0);

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value.replace(/[^0-9.,]/g, "").replace(",", ".")),
});
watch([inputted, inputElement], () => {
  recalculateInputWidth();
});

const totalComputeAmount = computed(() => {
  try {
    if (!inputted.value || !selectedToken.value) {
      return BigNumber.from("0");
    }
    return decimalToBigNumber(inputted.value, selectedToken.value.decimals);
  } catch (error) {
    return BigNumber.from("0");
  }
});
const totalAmountPrice = computed(() => {
  if (!selectedToken.value || !selectedToken.value.price || selectedToken.value.price === "loading") {
    return "";
  }
  return formatTokenPrice(totalComputeAmount.value, selectedToken.value.decimals, selectedToken.value.price);
});
const maxDecimalAmount = computed(() => {
  if (!props.maxAmount || !selectedToken.value) {
    return;
  }
  return parseTokenAmount(props.maxAmount, selectedToken.value.decimals);
});
const isMaxAmount = computed(() => {
  if (!props.maxAmount) {
    return false;
  }
  return totalComputeAmount.value.eq(props.maxAmount);
});
const setMax = () => {
  if (!maxDecimalAmount.value) return;
  inputted.value = maxDecimalAmount.value;
};

const amountError = computed(() => {
  if (!selectedToken.value) {
    return;
  }
  if (tokenBalance.value && totalComputeAmount.value.gt(tokenBalance.value.amount)) {
    return "exceeds_balance";
  }
  if (props.maxAmount && totalComputeAmount.value.gt(props.maxAmount)) {
    if (BigNumber.from(props.maxAmount).isZero()) {
      return "insufficient_balance";
    }
    return "exceeds_max_amount";
  }
  if (inputted.value) {
    const [, decimal] = inputted.value.split(".");
    if (decimal && decimal.length > selectedToken.value.decimals) {
      return "exceeds_decimals";
    }
  }
  return undefined;
});
watch(
  amountError,
  (value) => {
    emit("update:error", value);
  },
  { immediate: true }
);

const recalculateInputWidth = () => {
  inputWidth.value = 0;
  nextTick(() => {
    if (!inputElement.value) return;
    inputWidth.value = inputElement.value.scrollWidth;
  });
};
</script>

<style lang="scss" scoped>
.amount-input-container {
  @apply grid w-full gap-x-4 rounded-3xl bg-gray-input p-4 transition-colors dark:bg-neutral-900;
  grid-template-areas:
    "a b b b"
    "c c d d";
  &:not(.loading) {
    &.focused {
      @apply bg-gray-input-focus dark:bg-neutral-800;
    }
  }
  &.has-error {
    @apply ring-1 ring-inset ring-red-500;
  }

  .amount-input-token {
    @apply text-xl font-medium leading-[1.4] text-gray-900 dark:text-white;
    grid-area: a / a / a / a;
  }
  .amount-input-field-container {
    grid-area: b / b / b / b;
    @apply flex flex-row-reverse items-center justify-start gap-2 overflow-hidden pl-2;

    .amount-input-max-button {
      @apply rounded bg-primary-100/50 px-1.5 py-1 text-xs font-medium uppercase text-primary-400 transition-all dark:bg-neutral-700 dark:text-neutral-400;
      &:not(.is-max) {
        @apply cursor-pointer hover:bg-primary-100 dark:hover:bg-neutral-600;
      }
      &.is-max {
        @apply cursor-default bg-primary-600 text-white dark:bg-primary-300;
      }
    }
    .amount-input-field {
      @apply block w-max min-w-[15px] overflow-hidden border-none bg-transparent text-right text-xl font-medium outline-none placeholder:text-gray-secondary dark:placeholder:text-neutral-400;
    }
  }
  .amount-input-select-asset,
  .amount-input-note,
  .amount-input-error {
    @apply mt-1 text-sm leading-tight;
  }
  .amount-input-select-asset,
  .amount-input-note {
    @apply text-gray-secondary dark:text-neutral-400;
  }
  .amount-input-select-asset {
    @apply flex cursor-pointer items-start whitespace-pre-line transition-colors hover:text-gray-400 xs:w-max;
    grid-area: c / c / c / c;
  }
  .amount-input-note {
    @apply break-all;
  }
  .amount-input-note,
  .amount-input-error {
    @apply justify-self-end text-right;
    grid-area: d / d / d / d;
  }
  .amount-input-error {
    @apply break-words text-red-500;
  }
}
</style>
