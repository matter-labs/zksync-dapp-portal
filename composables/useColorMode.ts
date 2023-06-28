import { useColorMode } from "@vueuse/core";
export default () => {
  const { store } = useColorMode();

  const selectedColorMode = computed(() => (store.value === "auto" ? "dark" : store.value));

  const switchColorMode = () => {
    if (selectedColorMode.value === "dark") {
      store.value = "light";
    } else {
      store.value = "dark";
    }
  };

  return {
    selectedColorMode,
    switchColorMode,
  };
};
