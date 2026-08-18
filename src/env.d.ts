/// <reference types="astro/client" />

/** Public browser analytics queue used by the optional GTM/GA integration.
 * The integration is deliberately typed as generic event records because each
 * client may send different event properties. */
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export {};
