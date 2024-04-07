import type { Hash } from "@/types";

let analyticsLoaded = false;

async function loadRudder() {
  if (!window.rudderanalytics) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    throw new Error("Rudder not loaded");
  }
  const runtimeConfig = useRuntimeConfig();
  window.rudderanalytics.load(
    runtimeConfig.public.analytics.rudder.key,
    runtimeConfig.public.analytics.rudder.dataplaneUrl
  );
}

async function loadMasa() {
  if (!window.MA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    throw new Error("Masa not loaded");
  }
  const runtimeConfig = useRuntimeConfig();
  window.masaAnalytics = new window.MA.MasaAnalytics({
    clientId: runtimeConfig.public.analytics.masa.clientId,
  });
}

export async function initAnalytics(): Promise<boolean> {
  if (analyticsLoaded) return true;

  const runtimeConfig = useRuntimeConfig();
  const useRudder = Boolean(
    runtimeConfig.public.analytics.rudder.key && runtimeConfig.public.analytics.rudder.dataplaneUrl
  );
  const useMasa = Boolean(runtimeConfig.public.analytics.masa.clientId && runtimeConfig.public.analytics.masa.appId);
  if ((!useRudder && !useMasa) || analyticsLoaded) {
    return false;
  }

  const services = [];
  if (useRudder) services.push(loadRudder());
  if (useMasa) services.push(loadMasa());

  await Promise.all(services);
  analyticsLoaded = true;
  return true;
}

export async function trackPage(): Promise<void> {
  if (await initAnalytics()) {
    const runtimeConfig = useRuntimeConfig();
    window.rudderanalytics?.page();
    window.masaAnalytics?.firePageViewEvent({
      page: window.location.href,
      additionalEventData: { appId: runtimeConfig.public.analytics.masa.appId },
    });
  }
}

export async function trackEvent(eventName: string, params?: object): Promise<void> {
  if (await initAnalytics()) {
    const runtimeConfig = useRuntimeConfig();
    window.rudderanalytics?.track(eventName, params);
    window.masaAnalytics?.trackCustomEvent({
      eventName,
      additionalEventData: { appId: runtimeConfig.public.analytics.masa.appId, ...params },
    });
  }
}

export async function identifyWallet(userAddress: Hash | undefined, walletType?: string): Promise<void> {
  if (await initAnalytics()) {
    const runtimeConfig = useRuntimeConfig();
    window.masaAnalytics?.fireConnectWalletEvent({
      user_address: userAddress,
      wallet_type: walletType,
      additionalEventData: { appId: runtimeConfig.public.analytics.masa.appId },
    });
  }
}
