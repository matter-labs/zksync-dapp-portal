export default defineNuxtPlugin(() => {
  const url = window.location.origin;
  if (url.includes("https://goerli.portal.zksync.io")) {
    navigateTo("https://portal.zksync.io/?network=era-goerli", {
      external: true,
    });
  }
});
