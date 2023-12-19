<template>
  <CommonButtonBack @click="back" />
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

import { useRouter } from "#app";

const props = defineProps({
  fallback: {
    type: [String, Object] as PropType<string | RouteLocationRaw>,
    required: true,
  },
});

const router = useRouter();

const back = () => {
  if (!router.options.history.state.replaced && router.options.history.state.back) {
    const newUrl = router.options.history.state.back.toString();
    if (router.options.history.state.back !== newUrl) {
      return router.replace(props.fallback);
    } else {
      return router.back();
    }
  }
  return router.replace(props.fallback);
};
</script>
