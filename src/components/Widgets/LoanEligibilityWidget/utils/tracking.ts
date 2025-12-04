// src/components/widgets/LoanEligibilityWidget/utils/tracking.ts
export type AnalyticsConfig = {
  gaMeasurementId?: string; // G-...
  gaTagId?: string; // GT-...
  gaConversionId?: string; // AW-...
  gaConversionTagId?: string; // GT-...
  fbPixelId?: string; // numeric
  fbDomainVerification?: string;
  fbAppId?: string;
};

let globalConfig: AnalyticsConfig | null = null;

export const initAnalyticsConfig = (cfg: AnalyticsConfig) => {
  globalConfig = { ...(globalConfig || {}), ...(cfg || {}) };
};

export const trackGA = (event: string, label: string, payload?: Record<string, any>) => {
  try {
    if ((window as any).gtag && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", event, {
        event_category: "engagement",
        event_label: label,
        ...(payload || {}),
      });
    }
  } catch (e) {
    // swallow
  }
};

export const trackMeta = (event: string, label: string, payload?: Record<string, any>) => {
  try {
    if ((window as any).fbq && typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", event, { label, ...(payload || {}) });
    }
  } catch (e) {}
};
