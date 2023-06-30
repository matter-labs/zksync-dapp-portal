<template>
  <div class="error-layout">
    <Header />
    <div class="error-info-container">
      <h1 class="error-status-code">{{ error.statusCode }}</h1>
      <p class="error-message">{{ error.message }}</p>
      <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mt-4">Back to Portal</CommonButton>
    </div>
  </div>
</template>

<script lang="ts">
import useColorMode from "@/composables/useColorMode";

export default {
  props: ["error"],
};

useColorMode();
</script>

<style lang="scss" scoped>
.error-layout {
  @apply grid grid-rows-[auto_1fr];
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-areas:
    "header header header header"
    "menu menu menu menu";

  .error-info-container {
    @apply col-span-4 flex h-full w-full flex-col items-center justify-center leading-normal;

    .error-status-code {
      @apply mb-2 text-9xl font-normal;
    }
    .error-message {
      @apply text-center wrap-balance;
    }
  }
}
</style>
