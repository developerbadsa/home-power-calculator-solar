/**
 * Quick-reference table for SEO pages — designed to answer "People also ask"
 * style queries directly in crawlable content (§74 step 4).
 */
import type { ReactNode } from "react";

interface Props {
  caption: string;
  head: string[];
  rows: ReactNode[][];
  note?: string;
}

export function QuickTable({ caption, head, rows, note }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-slate-900">{caption}</h2>
      <div className="overflow-hidden rounded-[4px] border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {head.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 text-sm ${
                      j === 0 ? "font-medium text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="text-xs text-slate-500">{note}</p> : null}
    </div>
  );
}