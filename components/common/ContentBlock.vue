<template>
  <div class="content-block-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.content-block-container {
  @apply h-max w-full rounded-3xl bg-white px-block-padding-1/2 py-block-padding dark:bg-neutral-900 sm:px-block-padding;
}
</style>
