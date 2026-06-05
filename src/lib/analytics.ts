// Lightweight analytics shim. Pushes to window.dataLayer (GTM/GA4 compatible)
// and to gtag when present, with a safe console fallback for local debugging.
export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props, _ts: Date.now() });
    if (typeof window.gtag === "function") {
      window.gtag("event", event, props);
    }
    if (import.meta.env.DEV) console.info("[analytics]", event, props);
  } catch { /* swallow */ }
}