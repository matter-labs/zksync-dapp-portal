<template>
  <span class="content-loader animate-pulse">
    <span v-for="item in rows" :key="item"
      ><template v-for="lengthItem in length" :key="lengthItem">&nbsp;</template
      ><template v-if="item < rows"><br /></template
    ></span>
  </span>
</template>

<script lang="ts" setup>
defineProps({
  length: {
    type: Number,
    default: 15,
  },
  rows: {
    type: Number,
    default: 1,
  },
});
</script>

<style lang="scss" scoped>
.content-loader {
  @apply rounded-xl bg-neutral-50 dark:bg-neutral-700;
}
</style>
