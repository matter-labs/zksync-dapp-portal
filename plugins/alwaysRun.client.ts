export default defineNuxtPlugin(() => {
  useColorMode();

  const router = useRouter();
  router.onError((error, to) => {
    // Happens when new version is deployed and user has active session on the old version
    if (error?.message?.includes("Failed to fetch dynamically imported module")) {
      const win: Window = window; // ts error hack: https://github.com/microsoft/TypeScript/issues/48949
      win.location = to.fullPath;
    }
  });
});
