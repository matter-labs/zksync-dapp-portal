<template>
  <CommonModal v-bind="$attrs" title="Withdraw to exchange" @after-leave="checked = false">
    <p class="leading-normal">
      When withdrawing to an exchange account, please make sure that your exchange supports transfers from smart
      contracts. Otherwise, this can result in <span class="font-medium text-red-600">loss of funds</span>.
    </p>
    <p class="leading-normal">
      If you are unsure, the safest way would be to firstly
      <NuxtLink :to="withdrawToSelfLinkLocation" class="link">withdraw to {{ selectedEthereumNetwork.name }}</NuxtLink>
      and then send funds to the exchange.
    </p>

    <div class="mt-3 flex items-start">
      <label for="risc" class="flex cursor-pointer items-center">
        <div class="relative">
          <input type="checkbox" id="risc" v-model="checked" class="sr-only" tabindex="-1" />
          <div
            class="flex h-6 w-6 items-center justify-center rounded-md border-2 border-gray-300 bg-white outline-none ring-primary-400 ring-offset-2 focus:ring-2"
            v-bind:class="{ 'bg-primary-600 border-primary-600': checked }"
            tabindex="0"
            @keyup.enter="checked = !checked"
          >
            <svg v-show="checked" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div id="risc-description" class="ml-3 text-sm font-medium leading-6">
          I understand the risks of losing funds
        </div>
      </label>
    </div>

    <CommonButton
      :as="checked ? 'RouterLink' : 'Button'"
      :to="buttonLocation"
      variant="primary-solid"
      :disabled="!checked"
      class="mx-auto mt-5"
    >
      Proceed
    </CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { storeToRefs } from "pinia";

import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

import { useNetworkStore } from "@/store/network";

defineProps({
  buttonLocation: {
    type: Object as PropType<RouteLocationRaw>,
    required: true,
  },
  withdrawToSelfLinkLocation: {
    type: Object as PropType<RouteLocationRaw>,
    required: true,
  },
});

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

const checked = ref(false);
</script>
