<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style lang="scss">
html.dark {
  @apply bg-neutral-950;
}
.lite.dark {
  html,
  body {
    .link {
      @apply text-primary-300;
      &:enabled,
      &:is(a) {
        &:not([aria-disabled="true"]) {
          @apply hover:text-primary-200;
        }
      }
    }
  }
}
html,
body {
  @apply min-h-full w-full bg-gray font-sans leading-[1.15] antialiased dark:bg-neutral-950 dark:text-white;
  -webkit-text-size-adjust: 100%;

  .link {
    @apply font-medium text-primary-400 transition-colors dark:text-primary-200;
    &:enabled,
    &:is(a) {
      &:not([aria-disabled="true"]) {
        @apply hover:text-primary-300;
      }
    }
  }

  .tippy-box {
    @apply rounded-lg text-sm;
    &[data-theme~="light"] {
      @apply bg-white bg-opacity-70 shadow backdrop-blur;

      &[data-placement^="top"] > .tippy-arrow:before {
        border-top-color: rgba(255, 255, 255, 0.7);
        bottom: -8px;
      }
      &[data-placement^="bottom"] > .tippy-arrow:before {
        border-bottom-color: rgba(255, 255, 255, 0.7);
        top: -7px;
      }
    }
  }
}
</style>
