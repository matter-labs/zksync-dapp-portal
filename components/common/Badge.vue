<template>
  <div class="badge">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.badge {
  @apply rounded-lg bg-neutral-900 px-2 text-white dark:bg-white dark:text-black;
}
</style>
