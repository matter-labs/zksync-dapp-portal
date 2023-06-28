import { computed, ref } from "vue";

import { useRuntimeConfig } from "#imports";

export default () => {
  const { public: env } = useRuntimeConfig();

  const token = ref<string | null>(null);
  const expire = ref<string | null>(null);
  const fail = ref<string | null>(null);

  const renderTurnstile = async (element: HTMLElement | string) => {
    fail.value = null;
    window.turnstile?.render(element, {
      sitekey: env.turnstileKey,
      callback: (response: string) => {
        expire.value = null;
        fail.value = null;
        token.value = response;
      },
      "expired-callback": (response: string) => {
        expire.value = response;
      },
      "error-callback": (response: string) => {
        fail.value = response;
      },
    });
  };

  return {
    renderTurnstile,
    token: computed(() => token.value),
    expire: computed(() => expire.value),
    fail: computed(() => fail.value),
  };
};
