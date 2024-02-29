<template>
  <div class="alert-container" :class="[`variant-${variant}`, { 'has-icon': !!icon }]">
    <div v-if="icon" class="alert-icon-container">
      <component :is="icon" class="alert-icon" aria-hidden="true" />
    </div>
    <div class="alert-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  variant: {
    type: String as PropType<"info" | "neutral" | "success" | "warning" | "error">,
  },
  icon: {
    type: [Object, Function] as PropType<Component>,
  },
});
</script>

<style lang="scss">
.alert-container {
  @apply w-full rounded-[1.24rem] p-4;
  &.has-icon {
    @apply grid grid-cols-[max-content_1fr] gap-block-padding-1/2;
  }
  &.variant- {
    &info {
      @apply border bg-primary-300 text-primary-700;
      @apply dark:border-primary-300/50 dark:bg-primary-300/10 dark:text-white;

      .alert-icon {
        @apply dark:text-primary-300;
      }
      .alert-body {
        .alert-link {
          @apply hover:text-primary-400 dark:hover:text-primary-300;
        }
      }
    }
    &neutral {
      @apply border border-gray-200 bg-gray-200 bg-opacity-70 text-gray-700 backdrop-blur-sm;
      @apply dark:border-white/50 dark:bg-white/10 dark:text-white;

      .alert-body {
        .alert-link {
          @apply hover:text-gray-500 dark:hover:text-neutral-200;
        }
      }
    }
    &success {
      @apply border border-green-200 bg-green-200 text-green-700;
      @apply dark:border-success-400/50 dark:bg-success-400/10 dark:text-white;

      .alert-icon {
        @apply dark:text-success-600;
      }
      .alert-body {
        .alert-link {
          @apply hover:text-green-600 dark:hover:text-green-600;
        }
      }
    }
    &warning {
      @apply border p-block-padding-1/2 sm:p-block-padding;
      @apply border-warning-400/30 bg-warning-400/10;

      .alert-icon-container {
        @apply h-12 w-12 bg-warning-400;

        .alert-icon {
          @apply text-neutral-950;
        }
      }
      .alert-body {
        .alert-link {
          @apply hover:text-orange-600 dark:text-warning-400 dark:hover:text-warning-600;
        }
      }
    }
    &error {
      @apply border border-red-100 bg-red-100 text-red-700;
      @apply dark:border-red-400/50 dark:bg-red-400/10 dark:text-white;

      .alert-icon {
        @apply dark:text-red-400;
      }
      .alert-body {
        .alert-link {
          @apply hover:text-red-600 dark:text-red-400 dark:hover:text-red-500;
        }
      }
    }
  }

  .alert-icon-container {
    @apply flex items-center justify-center rounded-full;

    .alert-icon {
      @apply h-6 w-6;
    }
  }
  .alert-body {
    @apply flex-1 items-center xs:flex xs:justify-between;

    .alert-link {
      @apply mt-2 flex items-center whitespace-nowrap font-medium underline underline-offset-2 transition-colors xs:ml-6 xs:mt-0;
    }
  }
}
</style>
