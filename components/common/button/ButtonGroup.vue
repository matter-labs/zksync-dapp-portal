<template>
  <div class="buttons-line-group">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.buttons-line-group {
  @apply flex w-full flex-wrap gap-2;
}
</style>
