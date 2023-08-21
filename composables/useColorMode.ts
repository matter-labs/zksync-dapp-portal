import { useColorMode } from "@vueuse/core";

const { store } = useColorMode({
  initialValue: "dark",
  listenToStorageChanges: false,
});

export default () => {
  const selectedColorMode = computed(() => (store.value === "auto" ? "dark" : store.value));

  const switchColorMode = (colorMode?: "dark" | "light") => {
    if (colorMode) {
      return (store.value = colorMode);
    }
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
