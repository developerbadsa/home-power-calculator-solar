/**
 * Renders a JSON-LD structured-data block (§77). Server component — pages
 * pass any serializable object (FAQPage, WebApplication, BreadcrumbList…).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}