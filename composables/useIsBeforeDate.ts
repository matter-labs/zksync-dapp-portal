export default (dateRef: Ref<string | undefined>) => {
  const isBefore = ref(false);
  let intervalId: ReturnType<typeof setInterval> | undefined;

  const updateIsBefore = () => {
    if (!dateRef.value) {
      isBefore.value = false;
      reset();
      return;
    }
    isBefore.value = new Date() < new Date(dateRef.value);
  };

  const startChecking = () => {
    // Initial check
    updateIsBefore();

    // Watch for changes on the date
    watch(dateRef, updateIsBefore);

    // Periodically check every second
    intervalId = setInterval(updateIsBefore, 1000);
  };

  const reset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  // Start checking when the composable is used
  startChecking();

  // Stop checking when the component unmounts
  onUnmounted(reset);

  return {
    isBefore,
    reset,
  };
};
