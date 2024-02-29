export default <ResultType>(fn: () => ResultType, delay: number) => {
  let interval: ReturnType<typeof setInterval> | undefined;
  const currentDelay = ref(delay);

  function stop() {
    clearInterval(interval);
    interval = undefined;
  }

  function start() {
    stop();
    interval = setInterval(fn, currentDelay.value);
  }
  start();

  function reset() {
    stop();
    start();
  }

  return {
    stop,
    reset,
  };
};
