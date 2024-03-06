<template>
  <div class="error-layout">
    <Header />
    <div class="error-info-container">
      <h1 class="error-status-code">{{ error.statusCode }}</h1>
      <p class="error-message">{{ error.message }}</p>
      <CommonButton as="RouterLink" :to="{ name: 'bridge' }" class="mt-4" variant="primary">
        Back to Bridge
      </CommonButton>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    error: {
      type: Object as PropType<any>,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.error-layout {
  @apply grid grid-rows-[auto_1fr];
  min-height: 100vh;
  min-height: 100dvh;

  .error-info-container {
    @apply mx-auto flex h-full w-11/12 max-w-md flex-col items-center justify-center px-4 py-2 leading-normal md:px-0 md:py-4;

    .error-status-code {
      @apply mb-2 text-9xl font-normal;
    }
    .error-message {
      @apply whitespace-pre-line break-words break-all text-center wrap-balance;
    }
  }
}
</style>
