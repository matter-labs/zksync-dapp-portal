<template>
  <CommonBackButton @click="back" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

import { useRouter } from "#app";
import { usePreferencesStore } from "@/store/preferences";
import { replaceVersionInString } from "@/utils/helpers";

const props = defineProps({
  fallback: {
    type: [String, Object] as PropType<string | RouteLocationRaw>,
    required: true,
  },
});

const router = useRouter();
const { version: selectedZkSyncVersion } = storeToRefs(usePreferencesStore());

const back = () => {
  if (!router.options.history.state.replaced && router.options.history.state.back) {
    const newUrl = replaceVersionInString(router.options.history.state.back.toString(), selectedZkSyncVersion.value);
    if (router.options.history.state.back !== newUrl) {
      return router.replace(props.fallback);
    } else {
      return router.back();
    }
  }
  return router.replace(props.fallback);
};
</script>
