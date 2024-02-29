import type { Api } from "@/types";

export default <T>(resource: () => URL) => {
  const meta = ref<Api.Response.Collection<T>["meta"] | undefined>();
  const links = ref<Api.Response.Collection<T>["links"] | undefined>();

  const loadNext = async () => {
    const url = links.value?.next ? new URL(links.value.next, resource().origin) : resource();
    const response = await $fetch<Api.Response.Collection<T>>(url.toString());
    meta.value = response.meta;
    links.value = response.links;
    return response;
  };

  return {
    meta,
    canLoadMore: computed(() => !!links.value?.next),
    loadNext,
    reset: () => {
      meta.value = undefined;
      links.value = undefined;
    },
  };
};
