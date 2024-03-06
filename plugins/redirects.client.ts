export default defineNuxtPlugin(() => {
  const currentUrl = new URL(window.location.href);
  const redirectNetworkKeys = ["goerli", "sepolia"];
  for (const network of redirectNetworkKeys) {
    if (currentUrl.origin === `https://${network}.portal.zksync.io`) {
      const newUrl = new URL(currentUrl.href);
      newUrl.hostname = "portal.zksync.io";
      newUrl.searchParams.set("network", network);
      navigateTo(newUrl.href, {
        external: true,
      });
      break;
    }
  }
});
