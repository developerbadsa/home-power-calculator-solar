"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium Preloader — pure SVG + CSS, no external images.
 *
 * Flow: Sun rays rotate → energy dot travels to battery → battery fills →
 * home icon powers on → smooth fade out.
 *
 * Total duration: ~3.8s visible, then 600ms fade.
 */
export function Preloader() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0); // 0=sun 1=travel 2=battery 3=home
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Phase timeline — generous so users see each stage
    const timers = [
      setTimeout(() => setPhase(1), 700),   // energy starts traveling
      setTimeout(() => setPhase(2), 1600),  // battery charging
      setTimeout(() => setPhase(3), 2600),  // home powers on
      setTimeout(() => setFading(true), 3800),
      setTimeout(() => setGone(true), 4400),
    ];

    // Progress bar: smooth cubic ease 0→100 over 3800ms
    let start: number | null = null;
    const duration = 3800;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0f1a] transition-all duration-600 select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionDuration: "600ms" }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)]" />

      {/* Main SVG scene */}
      <div className="relative z-10 w-full max-w-md px-6">
        <svg
          viewBox="0 0 400 140"
          className="w-full h-auto"
          aria-hidden="true"
        >
          <defs>
            {/* Sun glow */}
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>

            {/* Battery fill gradient */}
            <linearGradient id="battFill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Energy dot glow */}
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>

            {/* Path for energy travel */}
            <path
              id="energyPath"
              d="M 80 70 C 140 70, 160 70, 200 70"
              fill="none"
            />
          </defs>

          {/* ── SOLAR PANEL ── */}
          <g className={phase >= 0 ? "preloader-fade-in" : "preloader-hidden"}>
            {/* Sun glow circle */}
            <circle
              cx="50"
              cy="30"
              r="28"
              fill="url(#sunGlow)"
              className={phase >= 0 ? "preloader-pulse-slow" : ""}
            />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="50"
                y1="30"
                x2={50 + 22 * Math.cos((angle * Math.PI) / 180)}
                y2={30 + 22 * Math.sin((angle * Math.PI) / 180)}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
                className="preloader-sun-ray"
                style={{ animationDelay: `${angle * 5}ms` }}
              />
            ))}
            {/* Sun core */}
            <circle cx="50" cy="30" r="10" fill="#fbbf24" className="preloader-pulse-slow" />
            <circle cx="50" cy="30" r="6" fill="#fde68a" />

            {/* Panel body */}
            <rect x="20" y="68" width="60" height="42" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Panel grid lines */}
            <line x1="20" y1="82" x2="80" y2="82" stroke="#334155" strokeWidth="0.7" />
            <line x1="20" y1="96" x2="80" y2="96" stroke="#334155" strokeWidth="0.7" />
            <line x1="40" y1="68" x2="40" y2="110" stroke="#334155" strokeWidth="0.7" />
            <line x1="60" y1="68" x2="60" y2="110" stroke="#334155" strokeWidth="0.7" />
            {/* Panel shine */}
            <rect x="22" y="70" width="24" height="12" rx="1" fill="white" opacity="0.08" />

            <text x="50" y="126" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500" fontFamily="system-ui">
              Solar Panel
            </text>
          </g>

          {/* ── ENERGY TRAVEL LINE ── */}
          <g className={phase >= 1 ? "preloader-fade-in" : "preloader-hidden"}>
            {/* Dashed travel line */}
            <line
              x1="90"
              y1="70"
              x2="190"
              y2="70"
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {/* Glowing active line */}
            <line
              x1="90"
              y1="70"
              x2="190"
              y2="70"
              stroke="#38bdf8"
              strokeWidth="2"
              className={phase >= 1 ? "preloader-line-draw" : ""}
              style={{ filter: "drop-shadow(0 0 4px #38bdf8)" }}
            />

            {/* Energy dot traveling */}
            {phase >= 1 && (
              <circle r="4" fill="#38bdf8" className="preloader-dot-travel" style={{ filter: "url(#dotGlow)" }}>
                <animateMotion
                  dur="0.6s"
                  fill="freeze"
                  path="M 90 70 L 190 70"
                  begin="0s"
                />
              </circle>
            )}

            {/* Arrow */}
            <polygon points="188,66 196,70 188,74" fill="#38bdf8" opacity="0.7" />
          </g>

          {/* ── BATTERY ── */}
          <g className={phase >= 2 ? "preloader-fade-in" : "preloader-hidden"}>
            {/* Battery body */}
            <rect x="200" y="58" width="70" height="44" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Battery terminal */}
            <rect x="270" y="72" width="6" height="16" rx="2" fill="#334155" />

            {/* Fill level — animates with progress */}
            <rect
              x="204"
              y={100 - ((progress / 100) * 36)}
              width="62"
              rx="3"
              fill="url(#battFill)"
              className="preloader-batt-fill"
              style={{ height: `${(progress / 100) * 36}px`, transition: "y 0.15s ease-out, height 0.15s ease-out" }}
            />

            {/* Percentage */}
            <text
              x="235"
              y="85"
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="700"
              fontFamily="ui-monospace, monospace"
            >
              {progress}%
            </text>

            <text x="235" y="126" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500" fontFamily="system-ui">
              Battery
            </text>
          </g>

          {/* ── HOME ── */}
          <g className={phase >= 3 ? "preloader-fade-in" : "preloader-hidden"}>
            {/* Home glow */}
            {phase >= 3 && (
              <circle
                cx="355"
                cy="74"
                r="22"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1"
                opacity="0.3"
                className="preloader-pulse-slow"
              />
            )}
            {/* House body */}
            <rect x="335" y="78" width="40" height="28" rx="2" fill={phase >= 3 ? "#1e293b" : "#0f172a"} stroke={phase >= 3 ? "#fbbf24" : "#334155"} strokeWidth="1.5" />
            {/* Roof */}
            <polygon
              points="330,80 355,58 380,80"
              fill={phase >= 3 ? "#fbbf24" : "#1e293b"}
              stroke={phase >= 3 ? "#f59e0b" : "#334155"}
              strokeWidth="1.5"
              className={phase >= 3 ? "preloader-pulse-slow" : ""}
            />
            {/* Door */}
            <rect x="350" y="92" width="10" height="14" rx="1" fill={phase >= 3 ? "#fbbf24" : "#1e293b"} opacity={phase >= 3 ? 0.9 : 0.3} />
            {/* Window */}
            <rect x="339" y="85" width="8" height="7" rx="1" fill={phase >= 3 ? "#38bdf8" : "#1e293b"} opacity={phase >= 3 ? 0.8 : 0.2} />
            <rect x="363" y="85" width="8" height="7" rx="1" fill={phase >= 3 ? "#38bdf8" : "#1e293b"} opacity={phase >= 3 ? 0.8 : 0.2} />

            {/* Lightning bolt when powered */}
            {phase >= 3 && (
              <g className="preloader-pulse-slow" style={{ filter: "drop-shadow(0 0 4px #fbbf24)" }}>
                <polygon
                  points="353,62 357,70 354,70 358,78 351,69 354,69 350,62"
                  fill="#fbbf24"
                />
              </g>
            )}

            <text x="355" y="126" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500" fontFamily="system-ui">
              Home
            </text>
          </g>
        </svg>

        {/* ── Brand name ── */}
        <div className="text-center mt-6">
          <p className="text-sm font-semibold tracking-wider text-white/90">
            Home Power Calculator
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 tracking-wide">
            IPS · Battery · Solar
          </p>
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-5 w-full max-w-[240px] mx-auto">
          <div className="h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400"
              style={{
                width: `${progress}%`,
                transition: "width 0.15s ease-out",
                boxShadow: "0 0 8px rgba(56,189,248,0.4)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
