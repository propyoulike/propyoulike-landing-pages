// src/components/widgets/LoanEligibilityWidget/AnalyticsProvider.tsx
import React, { createContext, useContext, useEffect } from "react";
import { initAnalyticsConfig } from "./utils/tracking";

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children, config }: { children: React.ReactNode; config?: any; }) {
  useEffect(() => {
    if (config) initAnalyticsConfig(config);
    // Optionally inject GA/FB scripts here if you want auto load
  }, [config]);

  return <AnalyticsContext.Provider value={config}>{children}</AnalyticsContext.Provider>;
}

export const useAnalytics = () => useContext(AnalyticsContext);
