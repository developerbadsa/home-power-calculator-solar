"use client";

import { useEffect } from "react";

/**
 * Registers the hand-rolled service worker (§70). Once the page has loaded,
 * the core calculator works fully offline: static assets are cached and the
 * app shell (HTML) falls back to the last-cached version when offline.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is progressive enhancement */
    });
  }, []);
  return null;
}