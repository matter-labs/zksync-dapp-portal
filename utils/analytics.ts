let analyticsLoaded = false;

const isRudderReady = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.rudderanalytics) {
      reject(new Error("Rudder not loaded"));
    }
    resolve();
  });
};

const isMasaReady = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.masaAnalytics) {
      reject(new Error("Masa not loaded"));
    }

    resolve();
  });
};

export async function initAnalytics(): Promise<boolean> {
  const runtimeConfig = useRuntimeConfig();
  const useRudder = Boolean(runtimeConfig.public.rudderKey && runtimeConfig.public.dataplaneUrl);
  const useMasa = Boolean(runtimeConfig.public.masaKey);
  if (!useRudder && !useMasa) {
    return false;
  }

  if (analyticsLoaded) {
    await Promise.all([await isRudderReady(), await isMasaReady()]);
    return true;
  }
  const rudderWait = retry(async () => {
    if (useRudder && !window.rudderanalytics) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      throw new Error("Rudder not loaded");
    }
  });
  const masaWait = retry(async () => {
    if (useMasa && !window.MA) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      throw new Error("Rudder not loaded");
    }
  });
  await Promise.all([await rudderWait, await masaWait]);
  useRudder && window.rudderanalytics?.load(runtimeConfig.public.rudderKey, runtimeConfig.public.dataplaneUrl);
  if (useMasa && window.MA) {
    window.masaAnalytics = new window.MA!.MasaAnalytics({
      clientId: runtimeConfig.public.masaKey,
    });
  }
  analyticsLoaded = true;

  await Promise.all([await isRudderReady(), await isMasaReady()]);
  return true;
}

export async function trackPage(): Promise<void> {
  if (await initAnalytics()) {
    window.rudderanalytics?.page();
    window.masaAnalytics?.firePageViewEvent({
      page: window.location.href,
      additionalEventData: { appId: "zksync-portal" },
    });
  }
}

export async function trackEvent(eventName: string, params?: object): Promise<void> {
  if (await initAnalytics()) {
    window.rudderanalytics?.track(eventName, params);
    window.masaAnalytics?.trackCustomEvent({ eventName, additionalEventData: { appId: "zksync-portal", ...params } });
  }
}

export async function identifyWallet(userAddress: `0x${string}` | undefined, walletType?: string): Promise<void> {
  if (await initAnalytics()) {
    window.masaAnalytics?.fireConnectWalletEvent({
      user_address: userAddress,
      wallet_type: walletType,
      additionalEventData: { appId: "zksync-portal" },
    });
  }
}
