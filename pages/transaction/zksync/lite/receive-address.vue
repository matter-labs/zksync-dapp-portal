<template>
  <div>
    <BackButton :fallback="{ name: 'transaction-zksync-lite-receive' }" />

    <h1 class="h1">Receive</h1>
    <Receive :address="address" :destination="destinations.zkSyncLite" />
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
