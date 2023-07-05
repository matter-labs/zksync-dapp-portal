<template>
  <div class="token-badge token-badge-loader">
    <div class="token-badge-amount">
      <CommonContentLoader :length="17" />
    </div>
    <div class="token-badge-img">
      <CommonContentLoader class="token-badge-img-loader" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.token-badge-loader {
  @apply pointer-events-none select-none;

  .token-badge-img-loader {
    @apply block aspect-square h-full w-full rounded-full;
  }
}
</style>
