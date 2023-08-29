<template>
  <CommonModal :opened="!eraNetwork.l1Network" :closable="false" title="Withdrawal unavailable">
    <p class="leading-normal">
      Withdrawal is not available on <span class="font-medium">{{ eraNetwork.name }}</span> since it doesn't have L1
      network
    </p>
    <CommonButton as="RouterLink" :to="{ name: 'index' }" replace variant="primary-solid" class="mx-auto mt-4">
      Go to Assets page
    </CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useEraProviderStore } from "@/store/zksync/era/provider";

const { eraNetwork } = storeToRefs(useEraProviderStore());
</script>
