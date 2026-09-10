/**
 * Related-calculator links (§34 internal linking cluster). Server component;
 * `current` excludes the page being viewed.
 */
import Link from "next/link";

const LINKS = [
  { href: "/calculators/battery", label: "Battery Backup Calculator" },
  { href: "/calculators/inverter", label: "Inverter / IPS Size Calculator" },
  { href: "/calculators/solar", label: "Solar Calculator Bangladesh" },
  { href: "/calculators/watt-to-amp", label: "Watts to Amps Calculator" },
  { href: "/calculators/amp-to-watt", label: "Amps to Watts Calculator" },
  { href: "/calculators/va-to-watt", label: "VA to Watts Calculator" },
  { href: "/calculators/bill-analysis", label: "Electricity Bill Calculator" },
] as const;

export function RelatedCalculators({ current }: { current?: string }) {
  const links = LINKS.filter((l) => l.href !== current);
  return (
    <section aria-labelledby="related-title" className="mx-auto max-w-3xl px-4 pb-10">
      <h2 id="related-title" className="text-xl font-semibold text-slate-900">
        Related calculators
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-[4px] border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:border-slate-900 hover:bg-slate-50"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}