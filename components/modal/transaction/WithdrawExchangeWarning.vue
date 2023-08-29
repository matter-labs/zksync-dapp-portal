<template>
  <CommonModal v-bind="$attrs" title="Withdraw to exchange" @after-leave="checked = false">
    <p class="leading-normal">
      When withdrawing to an exchange account, please make sure that your exchange supports transfers from smart
      contracts. Otherwise, this can result in <span class="font-medium text-red-600">loss of funds</span>.
    </p>
    <p class="leading-normal">
      If you are unsure, the safest way would be to firstly
      <NuxtLink :to="withdrawToSelfLinkLocation" class="link">withdraw to {{ l1Network?.name ?? "L1" }}</NuxtLink>
      and then send funds to the exchange.
    </p>

    <div class="mt-3 flex items-start">
      <CommonCheckbox v-model="checked">I understand the risks of losing funds</CommonCheckbox>
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

const { l1Network } = storeToRefs(useNetworkStore());

const checked = ref(false);
</script>
