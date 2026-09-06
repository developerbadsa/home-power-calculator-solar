import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Dynamic sitemap (§63): one entry per route, auto-generated at build time.
 * Add new routes here when pages are created.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const routes = [
    "",
    "/calculators/battery",
    "/calculators/inverter",
    "/calculators/solar",
    "/calculators/watt-to-amp",
    "/calculators/amp-to-watt",
    "/calculators/va-to-watt",
    "/guides/how-many-watts-can-a-1000va-ips-run",
    "/guides/how-much-battery-do-i-need",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}