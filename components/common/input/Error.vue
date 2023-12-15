<template>
  <div class="input-error">
    <slot />
    <!-- Empty space to keep the min height of 1 line of text -->
    &nbsp;
  </div>
</template>

<style lang="scss" scoped>
.input-error {
  @apply -mb-6 mt-1 text-sm text-error-300 transition;
}
</style>
