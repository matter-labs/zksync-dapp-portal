<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useRoute } from "vue-router";

import { trackPage } from "@/utils/analytics";

const route = useRoute();
watch(
  () => route.path,
  () => {
    trackPage();
  },
  { immediate: true }
);
</script>
