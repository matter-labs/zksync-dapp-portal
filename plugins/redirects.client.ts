export default defineNuxtPlugin(() => {
  const currentUrl = new URL(window.location.href);
  const redirectNetworkKeys = ["goerli", "sepolia"];
  const deprecatedNetworkKeys = ["goerli"];
  for (const network of redirectNetworkKeys) {
    if (currentUrl.origin === `https://${network}.portal.zksync.io`) {
      const newUrl = new URL(currentUrl.href);
      newUrl.hostname = "portal.zksync.io";
      if (deprecatedNetworkKeys.includes(network)) {
        newUrl.searchParams.set(
          "network",
          redirectNetworkKeys.filter((key) => !deprecatedNetworkKeys.includes(key))[0]
        );
      } else {
        newUrl.searchParams.set("network", network);
      }
      navigateTo(newUrl.href, {
        external: true,
      });
      break;
    }
  }
});
