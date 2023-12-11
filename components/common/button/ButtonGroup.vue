<template>
  <div class="buttons-line-group">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.buttons-line-group {
  @apply flex flex-wrap gap-block-gap-1/2;
}
</style>
