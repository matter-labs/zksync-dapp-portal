export default defineNuxtPlugin(() => {
  const currentUrl = new URL(window.location.href);
  if (currentUrl.origin === "https://goerli.portal.zksync.io") {
    const newUrl = new URL(currentUrl, "https://portal.zksync.io");
    newUrl.searchParams.set("network", "era-goerli");
    navigateTo(newUrl.href, {
      external: true,
    });
  }
});
