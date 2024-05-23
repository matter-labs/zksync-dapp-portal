export const usePortalRuntimeConfig = () => {
  const runtimeConfig = window && window["##runtimeConfig"];

  return {
    nodeType: runtimeConfig?.nodeType || (process.env.NODE_TYPE as undefined | "memory" | "dockerized" | "hyperchain"),
    walletConnectProjectId: runtimeConfig?.walletConnectProjectId || process.env.WALLET_CONNECT_PROJECT_ID,
    ankrToken: runtimeConfig?.ankrToken || process.env.ANKR_TOKEN,
    screeningApiUrl: runtimeConfig?.screeningApiUrl || process.env.SCREENING_API_URL,
    analytics: {
      rudder: runtimeConfig?.analytics?.rudder
        ? {
            key: (runtimeConfig.analytics.rudder.key || process.env.RUDDER_KEY)!,
            dataplaneUrl: (runtimeConfig.analytics.rudder.dataplaneUrl || process.env.DATAPLANE_URL)!,
          }
        : undefined,
    },
  };
};
