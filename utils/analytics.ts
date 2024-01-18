// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rudderanalytics: any = null;

export async function initAnalytics(): Promise<boolean> {
  const runtimeConfig = useRuntimeConfig();

  if (runtimeConfig.public.rudderKey && runtimeConfig.public.dataplaneUrl) {
    if (rudderanalytics) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    while (!(window as any).rudderanalytics) {
      await setTimeout(() => {
        return;
      }, 500);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rudderanalytics = (window as any).rudderanalytics;

    await rudderanalytics.load(runtimeConfig.public.rudderKey, runtimeConfig.public.dataplaneUrl);
    await rudderanalytics.ready();
    return true;
  }
  return false;
}

export async function trackPage(): Promise<void> {
  if (await initAnalytics()) {
    await rudderanalytics.page();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function trackEvent(eventName: string, params?: any): Promise<void> {
  if (await initAnalytics()) {
    await rudderanalytics.track(eventName, params);
  }
}
