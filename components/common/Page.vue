<template>
  <div>
    <h1 class="h1">{{ title }}</h1>

    <slot name="era" v-if="version === 'era'" />
    <slot name="lite" v-else-if="version === 'lite'" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const { version } = storeToRefs(useNetworkStore());
</script>

<style lang="scss" scoped></style>
