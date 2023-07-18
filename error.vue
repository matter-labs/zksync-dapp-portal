<template>
  <Head>
    <Title>{{ meta.title }}</Title>
    <Meta name="og:title" :content="meta.title" />
    <Meta name="og:site_name" :content="meta.title" />
    <Meta name="description" :content="meta.description" />
    <Meta name="og:description" :content="meta.description" />

    <Meta property="og:image:type" content="image/jpeg" />
    <Meta property="og:image:width" content="1200" />
    <Meta property="og:image:height" content="630" />
    <Meta property="og:image:alt" content="zkSync Portal" />
    <Meta property="og:image" content="https://portal.zksync.io/preview.jpg" />
  </Head>

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
export default {
  props: ["error"],
  data() {
    return {
      meta: {
        title: "zkSync Portal | Wallet, Bridge and Faucet",
        description:
          "zkSync Portal provides all the required tools for working with Era and Lite networks such as Wallet, Bridge & Faucet functionality.",
      },
    };
  },
};
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
    @apply col-span-4 mx-auto flex h-full w-11/12 max-w-md flex-col items-center justify-center px-4 py-2 leading-normal md:px-0 md:py-4;

    .error-status-code {
      @apply mb-2 text-9xl font-normal;
    }
    .error-message {
      @apply whitespace-pre-line break-words break-all text-center wrap-balance;
    }
  }
}
</style>
