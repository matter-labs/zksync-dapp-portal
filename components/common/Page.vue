<template>
  <div>
    <h1 class="h1">{{ title }}</h1>
    <!-- <VersionTabs class="mb-4" /> -->

    <slot name="era" v-if="version === 'era'" />
    <slot name="lite" v-else-if="version === 'lite'" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { usePreferencesStore } from "@/store/preferences";

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const { version } = storeToRefs(usePreferencesStore());
</script>

<style lang="scss" scoped></style>
