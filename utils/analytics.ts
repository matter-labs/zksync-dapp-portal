const portalRuntimeConfig = usePortalRuntimeConfig();
let analyticsLoaded = false;

async function loadRudder() {
  if (!window.rudderanalytics) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    throw new Error("Rudder not loaded");
  }
  window.rudderanalytics.load(
    portalRuntimeConfig.analytics.rudder!.key,
    portalRuntimeConfig.analytics.rudder!.dataplaneUrl
  );
}

export async function initAnalytics(): Promise<boolean> {
  if (analyticsLoaded) return true;

  const useRudder = Boolean(portalRuntimeConfig.analytics.rudder);
  if (!useRudder || analyticsLoaded) {
    return false;
  }

  await loadRudder();
  analyticsLoaded = true;
  return true;
}

export async function trackPage(): Promise<void> {
  if (await initAnalytics()) {
    window.rudderanalytics?.page();
  }
}

export async function trackEvent(eventName: string, params?: object): Promise<void> {
  if (await initAnalytics()) {
    window.rudderanalytics?.track(eventName, params);
  }
}
