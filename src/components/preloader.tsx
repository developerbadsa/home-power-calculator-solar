"use client";

import { useEffect, useState } from "react";

/**
 * Preloader — animated solar → battery → IPS sequence.
 * Three-phase animation:
 *   Phase 1 (0–1s): Sun rays appear + solar panel icon rises
 *   Phase 2 (1–2s): Energy flows to battery icon which charges up
 *   Phase 3 (2–3s): Battery powers the Zap/IPS icon, whole thing glows
 *   Phase 4 (3–3.8s): Everything fades out revealing the app.
 */
export function Preloader() {
  const [phase, setPhase] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);  // solar appears
    const t2 = setTimeout(() => setPhase(2), 1400); // battery charges
    const t3 = setTimeout(() => setPhase(3), 2200); // IPS powers on
    const t4 = setTimeout(() => setFading(true), 3000);
    const t5 = setTimeout(() => setGone(true), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-600 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated scene — solar → battery → IPS */}
      <div className="relative flex items-center gap-6 sm:gap-10">
        {/* ── Sun ──────────────────────────────────────── */}
        <div className={`transition-all duration-700 ${phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="relative">
            {/* Sun rays */}
            <div className="absolute inset-0 -m-6 sun-rays" />
            {/* Sun body */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 shadow-lg shadow-amber-400/40">
              <SunSVG />
            </div>
          </div>
        </div>

        {/* ── Energy flow line 1 (solar → battery) ─────── */}
        <div className={`absolute left-[62px] top-1/2 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transition-all duration-500 sm:left-[76px] ${
          phase >= 1 ? "w-8 sm:w-12 opacity-100" : "w-0 opacity-0"
        }`}>
          <div className="energy-particle-1 h-full w-2 bg-amber-300 shadow-sm shadow-amber-300/60" />
        </div>

        {/* ── Battery ──────────────────────────────────── */}
        <div className={`transition-all duration-700 delay-200 ${phase >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="relative">
            <BatterySVG charge={phase >= 2 ? 1 : 0} />
            {/* Battery glow when charging */}
            {phase >= 2 && phase < 3 && (
              <div className="absolute inset-0 -m-2 rounded-xl bg-emerald-400/20 animate-pulse" />
            )}
          </div>
        </div>

        {/* ── Energy flow line 2 (battery → IPS) ───────── */}
        <div className={`absolute right-[62px] top-1/2 h-0.5 bg-gradient-to-r from-transparent to-emerald-400 transition-all duration-500 sm:right-[76px] ${
          phase >= 3 ? "w-8 sm:w-12 opacity-100" : "w-0 opacity-0"
        }`}>
          <div className="energy-particle-2 h-full w-2 bg-emerald-300 shadow-sm shadow-emerald-300/60" />
        </div>

        {/* ── IPS / Zap icon ───────────────────────────── */}
        <div className={`transition-all duration-700 delay-200 ${phase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="relative">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-500 ${
              phase >= 3
                ? "bg-white/15 shadow-lg shadow-emerald-400/30 border border-white/20"
                : "bg-white/5 border border-white/10"
            }`}>
              <ZapSVG glowing={phase >= 3} />
            </div>
            {/* Power-on glow burst */}
            {phase >= 3 && (
              <div className="absolute inset-0 -m-3 animate-ping rounded-2xl bg-emerald-400/15" />
            )}
          </div>
        </div>
      </div>

      {/* ── Brand text ─────────────────────────────────── */}
      <div className="mt-10 text-center">
        <h1 className={`text-xl font-bold text-white transition-all duration-500 ${
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}>
          হোম পাওয়ার ক্যালকুলেটর
        </h1>
        <p className={`mt-1 text-sm text-slate-400 transition-all duration-500 delay-150 ${
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}>
          IPS · Battery · Solar
        </p>
      </div>

      {/* ── Phase label ────────────────────────────────── */}
      <div className="mt-6 h-5">
        {phase === 1 && (
          <p className="text-xs text-amber-400/80 preloader-text-in">
            ☀️ Capturing solar energy...
          </p>
        )}
        {phase === 2 && (
          <p className="text-xs text-emerald-400/80 preloader-text-in">
            🔋 Charging battery...
          </p>
        )}
        {phase === 3 && (
          <p className="text-xs text-white/80 preloader-text-in">
            ⚡ Powering your home...
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Inline SVGs to avoid icon-library flash ──────────────────── */

function SunSVG() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

function BatterySVG({ charge }: { charge: number }) {
  return (
    <svg viewBox="0 0 32 20" className="h-12 w-14 text-emerald-400" fill="none">
      {/* Battery body */}
      <rect x="1" y="3" width="26" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" className="transition-all duration-500" />
      {/* Battery tip */}
      <rect x="27" y="7" width="3" height="6" rx="1" fill="currentColor" opacity="0.5" />
      {/* Charge level bars */}
      <rect x="3.5" y="5.5" width="5" height="9" rx="1" fill="currentColor"
        className={`transition-all duration-700 ${charge ? "opacity-90" : "opacity-0"}`} />
      <rect x="10" y="5.5" width="5" height="9" rx="1" fill="currentColor"
        className={`transition-all duration-700 delay-200 ${charge ? "opacity-90" : "opacity-0"}`} />
      <rect x="16.5" y="5.5" width="5" height="9" rx="1" fill="currentColor"
        className={`transition-all duration-700 delay-400 ${charge ? "opacity-90" : "opacity-0"}`} />
    </svg>
  );
}

function ZapSVG({ glowing }: { glowing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 transition-all duration-500 ${glowing ? "text-emerald-400" : "text-white/60"}`} fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
