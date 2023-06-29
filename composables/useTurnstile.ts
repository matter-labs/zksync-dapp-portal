import { computed, onUnmounted, ref } from "vue";

import useColorMode from "@/composables/useColorMode";

import { useRuntimeConfig } from "#imports";

export default () => {
  const { public: env } = useRuntimeConfig();
  const { selectedColorMode } = useColorMode();

  const token = ref<string | null>(null);
  const error = ref<string | null>(null);
  let widgetId: string | undefined = undefined;

  const renderTurnstile = async (element: HTMLElement | string) => {
    resetTurnstile();
    widgetId = window.turnstile?.render(element, {
      sitekey: env.turnstileKey,
      theme: selectedColorMode.value,
      appearance: "always",
      language: "en-US",
      callback: (response: string) => {
        error.value = null;
        token.value = response;
      },
      "expired-callback": () => {
        error.value = "Turnstile captcha expired";
      },
      "error-callback": (response: string) => {
        if (response === "invalid_domain") {
          error.value = "Turnstile captcha is not available on this domain";
        } else if (response === "undefined_error") {
          error.value = "Unknown error occurred";
        } else {
          error.value = response;
        }
      },
    });
  };
  const resetTurnstile = () => {
    error.value = null;
    if (widgetId) {
      try {
        window.turnstile?.reset(widgetId);
      } catch {
        // ignore
      }
    }
  };

  onUnmounted(resetTurnstile);

  return {
    renderTurnstile,
    token: computed(() => token.value),
    error: computed(() => error.value),
  };
};
