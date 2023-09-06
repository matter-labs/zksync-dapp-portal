<template>
  <div class="badge-tabs-container">
    <div class="badge-tab active">zkSync Lite</div>
    <div class="badge-tab">zkSync Era∎</div>
  </div>
</template>

<style lang="scss" scoped>
.badge-tabs-container {
  @apply grid w-full grid-flow-col-dense grid-cols-[max-content] gap-2;

  .badge-tab {
    @apply w-max cursor-pointer whitespace-nowrap rounded-xl px-4 py-1 text-sm font-medium leading-loose text-gray-secondary transition-colors;
    &:hover,
    &.active {
      @apply text-black;
    }
    &.active {
      @apply bg-white;
    }
  }
}
</style>
