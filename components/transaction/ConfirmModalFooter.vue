<template>
  <div class="sticky bottom-0 z-[1] mt-auto w-full bg-gray/60 backdrop-blur-sm dark:bg-neutral-950/60">
    <slot name="alerts" />
    <div class="mx-4 mb-3 border-t border-dashed border-gray-300 dark:border-neutral-800"></div>
    <slot />
  </div>
</template>

<script lang="ts" setup></script>
