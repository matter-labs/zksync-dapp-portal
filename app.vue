<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { trackPage } from "~/utils/analytics";
trackPage();
</script>

<style lang="scss"></style>

<script lang="ts">
export default {
  watch: {
    $route() {
      trackPage();
    },
  },
};
</script>
