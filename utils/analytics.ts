let analyticsLoaded = false;

const isReady = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.rudderanalytics) {
      reject(new Error("Rudder not loaded"));
    }
    window.rudderanalytics?.ready(() => {
      resolve();
    });
  });
};

export async function initAnalytics(): Promise<boolean> {
  const runtimeConfig = useRuntimeConfig();
  if (!runtimeConfig.public.rudderKey || !runtimeConfig.public.dataplaneUrl) {
    return false;
  }

  if (analyticsLoaded) {
    await isReady();
    return true;
  }
  await retry(async () => {
    if (!window.rudderanalytics) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      throw new Error("Rudder not loaded");
    }
  });
  window.rudderanalytics?.load(runtimeConfig.public.rudderKey, runtimeConfig.public.dataplaneUrl);
  analyticsLoaded = true;
  await isReady();
  return true;
}

export async function trackPage(): Promise<void> {
  if (await initAnalytics()) {
    window.rudderanalytics?.page();
  }
}

export async function trackEvent(eventName: string, params?: unknown): Promise<void> {
  if (await initAnalytics()) {
    window.rudderanalytics?.track(eventName, params);
  }
}
