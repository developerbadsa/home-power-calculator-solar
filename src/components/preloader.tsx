"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ── Helpers ────────────────────────────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ── Particle system ────────────────────────────────────────────────── */
function Particles({ count = 30 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        id: uid(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        dur: 8 + Math.random() * 14,
        delay: Math.random() * -10,
        opacity: 0.1 + Math.random() * 0.25,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animation: `particleFloat ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Ripple ring ────────────────────────────────────────────────────── */
function Ripple({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="preloader-ripple"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

/* ── Main Preloader ─────────────────────────────────────────────────── */
export function Preloader() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  // 0 = fade in panel  1 = energy arc  2 = battery charge  3 = home glow  4 = full scene
  const [charge, setCharge] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),   // arc starts
      setTimeout(() => setPhase(2), 1400),  // battery charges
      setTimeout(() => setPhase(3), 2600),  // home lights up
      setTimeout(() => setPhase(4), 3200),  // hold
      setTimeout(() => setFading(true), 4200),
      setTimeout(() => setGone(true), 4900),
    ];

    let start: number | null = null;
    const dur = 3200;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4); // quartic — slow start, smooth end
      setCharge(Math.round(eased * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-label="Loading"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-opacity ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(145deg, #04080f 0%, #0a1628 40%, #0d1f3c 100%)",
        transitionDuration: "700ms",
      }}
    >
      {/* Ambient gradient layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/[0.03] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-sky-500/[0.04] blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      {/* Particle field */}
      <Particles count={35} />

      {/* Ripple rings — behind main content */}
      {phase >= 2 && <Ripple delay={0} />}
      {phase >= 3 && <Ripple delay={0.8} />}

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-lg">

        {/* ── SVG Scene ── */}
        <div className={`w-full transition-all duration-700 ${phase >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <svg viewBox="0 0 420 130" className="w-full h-auto drop-shadow-2xl" aria-hidden="true">
            <defs>
              <radialGradient id="pgSunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="pgBattFill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="pgArc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="pgGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
              </filter>
              <filter id="pgSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
              </filter>
              <clipPath id="pgBattClip">
                <rect x="196" y="54" width="78" height="48" rx="6" />
              </clipPath>
            </defs>

            {/* ═══ SOLAR ═══ */}
            <g className={phase >= 0 ? "preloader-fade-in" : "preloader-hidden"}>
              {/* Sun ambient glow */}
              <circle cx="55" cy="28" r="34" fill="url(#pgSunGlow)" className="preloader-pulse-glow" />
              {/* Sun rays — two layers */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                <line
                  key={a}
                  x1={55 + 14 * Math.cos((a * Math.PI) / 180)}
                  y1={28 + 14 * Math.sin((a * Math.PI) / 180)}
                  x2={55 + 26 * Math.cos((a * Math.PI) / 180)}
                  y2={28 + 26 * Math.sin((a * Math.PI) / 180)}
                  stroke="#fbbf24"
                  strokeWidth={i % 2 === 0 ? 2 : 1.2}
                  strokeLinecap="round"
                  className="preloader-ray"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
              {/* Sun body */}
              <circle cx="55" cy="28" r="12" fill="#fbbf24" />
              <circle cx="55" cy="28" r="7" fill="#fde68a" opacity="0.9" />

              {/* Panel — glassmorphic */}
              <rect x="22" y="64" width="66" height="46" rx="6" fill="#0c1929" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
              {/* Grid */}
              {[78, 92].map((y) => <line key={y} x1="22" y1={y} x2="88" y2={y} stroke="rgba(148,163,184,0.12)" strokeWidth="0.5" />)}
              {[44, 66].map((x) => <line key={x} x1={x} y1="64" x2={x} y2="110" stroke="rgba(148,163,184,0.12)" strokeWidth="0.5" />)}
              {/* Shine streak */}
              <rect x="24" y="66" width="20" height="10" rx="2" fill="white" opacity="0.04" />
              <text x="55" y="126" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600" fontFamily="system-ui" letterSpacing="0.5">
                SOLAR
              </text>
            </g>

            {/* ═══ ENERGY ARC ═══ */}
            <g className={phase >= 1 ? "preloader-fade-in" : "preloader-hidden"}>
              {/* Base line */}
              <line x1="96" y1="70" x2="190" y2="70" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
              {/* Animated glowing arc */}
              {phase >= 1 && (
                <>
                  {/* Broad glow underneath */}
                  <line x1="96" y1="70" x2="190" y2="70" stroke="url(#pgArc)" strokeWidth="6" opacity="0.15" className="preloader-arc-glow" filter="url(#pgSoftGlow)" />
                  {/* Crisp arc */}
                  <line x1="96" y1="70" x2="190" y2="70" stroke="url(#pgArc)" strokeWidth="2" className="preloader-arc-draw" />
                  {/* Traveling dot */}
                  <circle r="5" fill="#38bdf8" filter="url(#pgGlow)" className="preloader-dot">
                    <animateMotion dur="0.8s" fill="freeze" path="M 96 70 L 190 70" />
                  </circle>
                  {/* Trail dots */}
                  <circle r="2.5" fill="#38bdf8" opacity="0.5" className="preloader-dot" style={{ animationDelay: "0.1s" }}>
                    <animateMotion dur="0.8s" fill="freeze" path="M 96 70 L 190 70" begin="0.08s" />
                  </circle>
                  <circle r="1.5" fill="#38bdf8" opacity="0.25" className="preloader-dot" style={{ animationDelay: "0.2s" }}>
                    <animateMotion dur="0.8s" fill="freeze" path="M 96 70 L 190 70" begin="0.16s" />
                  </circle>
                </>
              )}
              {/* Arrow */}
              <polygon points="188,65 198,70 188,75" fill="#38bdf8" opacity="0.6" className={phase >= 1 ? "preloader-fade-in" : ""} />
            </g>

            {/* ═══ BATTERY ═══ */}
            <g className={phase >= 2 ? "preloader-fade-in" : "preloader-hidden"}>
              {/* Outer glow */}
              {phase >= 2 && (
                <rect x="190" y="48" width="90" height="60" rx="10" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.15" className="preloader-pulse-glow" />
              )}
              {/* Body */}
              <rect x="196" y="54" width="78" height="48" rx="6" fill="#0c1929" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
              {/* Terminal */}
              <rect x="274" y="70" width="5" height="18" rx="2" fill="rgba(148,163,184,0.2)" />
              {/* Fill */}
              <g clipPath="url(#pgBattClip)">
                <rect
                  x="198"
                  y={100 - (charge / 100) * 44}
                  width="74"
                  fill="url(#pgBattFill)"
                  style={{ height: `${(charge / 100) * 44}px`, transition: "y 0.12s ease-out, height 0.12s ease-out" }}
                />
                {/* Wave overlay */}
                {phase >= 2 && (
                  <path
                    d={`M 198 ${100 - (charge / 100) * 44} Q 220 ${96 - (charge / 100) * 44} 237 ${100 - (charge / 100) * 44} T 272 ${100 - (charge / 100) * 44}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                    className="preloader-wave"
                  />
                )}
              </g>
              {/* Percentage */}
              <text x="235" y="84" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="ui-monospace, monospace" letterSpacing="-0.5">
                {charge}
                <tspan fontSize="10" opacity="0.7">%</tspan>
              </text>
              <text x="235" y="126" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600" fontFamily="system-ui" letterSpacing="0.5">
                BATTERY
              </text>
            </g>

            {/* ═══ HOME ═══ */}
            <g className={phase >= 3 ? "preloader-fade-in" : "preloader-hidden"}>
              {/* Ambient glow */}
              {phase >= 3 && (
                <circle cx="355" cy="72" r="28" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.2" className="preloader-pulse-glow" />
              )}
              {/* House body */}
              <rect x="336" y="76" width="38" height="30" rx="3" fill={phase >= 3 ? "#1a2744" : "#0c1929"} stroke={phase >= 3 ? "rgba(251,191,36,0.4)" : "rgba(148,163,184,0.15)"} strokeWidth="1" />
              {/* Roof */}
              <polygon
                points="330,78 355,56 380,78"
                fill={phase >= 3 ? "#fbbf24" : "#0c1929"}
                stroke={phase >= 3 ? "#f59e0b" : "rgba(148,163,184,0.15)"}
                strokeWidth="1"
                className={phase >= 3 ? "preloader-pulse-glow" : ""}
              />
              {/* Door — lights up */}
              <rect x="350" y="90" width="10" height="16" rx="1.5" fill={phase >= 3 ? "#fbbf24" : "#0c1929"} opacity={phase >= 3 ? 1 : 0.15} style={{ transition: "fill 0.5s, opacity 0.5s" }} />
              {/* Windows — glow */}
              <rect x="340" y="82" width="8" height="8" rx="1.5" fill={phase >= 3 ? "#38bdf8" : "#0c1929"} opacity={phase >= 3 ? 0.85 : 0.1} style={{ transition: "fill 0.5s, opacity 0.5s" }} />
              <rect x="362" y="82" width="8" height="8" rx="1.5" fill={phase >= 3 ? "#38bdf8" : "#0c1929"} opacity={phase >= 3 ? 0.85 : 0.1} style={{ transition: "fill 0.5s, opacity 0.5s" }} />
              {/* Lightning bolt */}
              {phase >= 3 && (
                <g filter="url(#pgGlow)" className="preloader-pulse-glow">
                  <polygon points="353,60 357,68 354.5,68 358,76 350.5,67 353,67 349.5,60" fill="#fbbf24" />
                </g>
              )}
              <text x="355" y="126" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600" fontFamily="system-ui" letterSpacing="0.5">
                HOME
              </text>
            </g>
          </svg>
        </div>

        {/* ── Brand — staggered reveal ── */}
        <div className="text-center mt-8 space-y-1.5">
          <p className={`text-lg font-bold tracking-[0.2em] uppercase text-white/90 transition-all duration-700 ${phase >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            style={{ fontFamily: "system-ui" }}>
            Home Power Calculator
          </p>
          <p className={`text-[11px] font-medium tracking-[0.35em] uppercase transition-all duration-700 delay-300 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            style={{ color: "rgba(148,163,184,0.6)" }}>
            IPS · Battery · Solar
          </p>
        </div>

        {/* ── Progress bar — thin, elegant ── */}
        <div className="mt-8 w-48 mx-auto">
          <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${charge}%`,
                background: "linear-gradient(90deg, #fbbf24, #38bdf8, #10b981)",
                transition: "width 0.12s ease-out",
                boxShadow: "0 0 12px rgba(56,189,248,0.3), 0 0 4px rgba(56,189,248,0.5)",
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "rgba(148,163,184,0.4)" }}>
              Initializing
            </span>
            <span className="text-[10px] font-mono font-semibold tabular-nums" style={{ color: "rgba(148,163,184,0.3)" }}>
              {charge}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
