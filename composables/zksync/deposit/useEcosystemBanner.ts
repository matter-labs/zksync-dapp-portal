import { useSessionStorage } from "@vueuse/core";

export default () => {
  const recentlyBridged = useSessionStorage<boolean>("portal-recently-bridged", false);
  const ecosystemBannerClosed = useSessionStorage<boolean>("portal-ecosystem-banner-closed", false);
  const ecosystemBannerVisible = computed(() => !ecosystemBannerClosed.value && recentlyBridged.value);

  return {
    recentlyBridged,
    ecosystemBannerClosed,
    ecosystemBannerVisible,
  };
};
