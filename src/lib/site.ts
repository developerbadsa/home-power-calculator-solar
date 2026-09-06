/**
 * Canonical site URL used by sitemap.xml, robots.txt and metadata.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (or deploy on Vercel, where
 * NEXT_PUBLIC_VERCEL_URL is injected automatically). Until then, links stay
 * on the fallback so builds never break.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3000";
}