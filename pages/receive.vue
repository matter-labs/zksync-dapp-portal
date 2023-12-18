<template>
  <div>
    <PageTitle :fallback-route="{ name: 'receive-methods' }">Your address</PageTitle>
    <Receive :address="address" :destination="destinations.era" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import Receive from "@/views/transaction/Receive.vue";

const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());

const address = computed(() => account.value.address || "");
</script>
