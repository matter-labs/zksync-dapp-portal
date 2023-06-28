<template>
  <div class="content-block-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.content-block-container {
  @apply h-max w-full rounded-3xl bg-white p-4 dark:bg-neutral-900;
}
</style>
