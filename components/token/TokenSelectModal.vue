<template>
  <CommonModal v-model:opened="isModalOpened" class="token-select-modal" :title="title" @after-leave="search = ''">
    <Combobox v-model="selectedToken">
      <!-- TODO: Refactor this to use ComboboxInput as main component but look like CommonSmallInput -->
      <CommonSmallInput v-model.trim="search" class="mb-4" placeholder="Symbol or address" autofocus="desktop">
        <template #icon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </template>
      </CommonSmallInput>
      <div class="h-full overflow-auto">
        <CommonCardWithLineButtons v-if="loading">
          <TokenBalanceLoader v-for="index in 2" :key="index" />
        </CommonCardWithLineButtons>
        <CommonCardWithLineButtons v-else-if="error">
          <CommonErrorBlock class="m-2" @try-again="emit('try-again')">
            {{ error.message }}
          </CommonErrorBlock>
        </CommonCardWithLineButtons>
        <template v-else-if="!hasBalances">
          <div class="category">
            <CommonCardWithLineButtons>
              <TokenLine
                v-for="item in displayedTokens"
                :key="item.address"
                v-bind="item"
                @click="selectedToken = item"
              />
            </CommonCardWithLineButtons>
          </div>
        </template>
        <template v-else-if="balanceGroups.length || !search">
          <div v-for="(group, index) in balanceGroups" :key="index" class="category">
            <TypographyCategoryLabel v-if="group.title" class="group-category-label">
              {{ group.title }}
            </TypographyCategoryLabel>
            <CommonCardWithLineButtons>
              <TokenBalance
                v-for="item in group.balances"
                :key="item.address"
                v-bind="item"
                @click="selectedToken = item"
              />
            </CommonCardWithLineButtons>
          </div>
        </template>
        <CommonEmptyBlock v-else class="search-empty-block">
          No tokens was found for "{{ search }}"
          <br />
          <span class="mt-1.5 inline-block">Make sure you are using correct zkSync network</span>
        </CommonEmptyBlock>
        <slot name="body-bottom" />
      </div>
    </Combobox>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { Combobox } from "@headlessui/vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

import CommonCardWithLineButtons from "@/components/common/CardWithLineButtons.vue";

import type { Token, TokenAmount } from "@/types";
import type { PropType } from "vue";

import { groupBalancesByAmount } from "@/utils/mappers";

const props = defineProps({
  title: {
    type: String,
    default: "Choose token",
  },
  opened: {
    type: Boolean,
    default: false,
  },
  tokenAddress: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error,
  },
  tokens: {
    type: Array as PropType<Token[]>,
    default: () => [],
  },
  balances: {
    type: Array as PropType<TokenAmount[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "update:tokenAddress", tokenAddress?: string): void;
  (eventName: "try-again"): void;
}>();

const search = ref("");
const hasBalances = computed(() => props.balances.length > 0);
const filterTokens = (tokens: Token[]) => {
  const lowercaseSearch = search.value.toLowerCase();
  return tokens.filter(({ address, symbol }) =>
    Object.values({ address, symbol })
      .filter((e) => typeof e === "string")
      .some((value) => value.toLowerCase().includes(lowercaseSearch))
  );
};
const displayedTokens = computed(() => filterTokens(props.tokens));
const displayedBalances = computed(() => filterTokens(props.balances) as TokenAmount[]);
const balanceGroups = groupBalancesByAmount(displayedBalances);

const selectedTokenAddress = computed({
  get: () => props.tokenAddress,
  set: (value) => emit("update:tokenAddress", value),
});
const selectedToken = computed({
  get: () => {
    if (!props.tokens) {
      return undefined;
    }
    return props.tokens.find((e) => e.address === selectedTokenAddress.value);
  },
  set: (value) => {
    if (value) {
      selectedTokenAddress.value = value.address;
    } else {
      selectedTokenAddress.value = undefined;
    }
    closeModal();
  },
});

const isModalOpened = computed({
  get: () => props.opened,
  set: (value) => emit("update:opened", value),
});
const closeModal = () => {
  isModalOpened.value = false;
};
</script>

<style lang="scss">
.token-select-modal {
  .modal-card {
    @apply grid h-full grid-rows-[max-content_max-content_1fr];
  }
  .category:first-child .group-category-label {
    @apply pt-0;
  }
}
</style>
