"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { LaserCollection } from "@/shaders/laser/LaserCollection";

/**
 * Premium Preloader — LaserCollection matrix-field WebGL background.
 *
 * Flow: Matrix junction fades in → particles flow → progress completes → smooth fade out.
 * Total: ~4s visible, then 700ms fade.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const tFade = setTimeout(() => setFading(true), 3800);
    const tGone = setTimeout(() => setGone(true), 4500);

    // Progress bar: cubic ease 0→100 over 3600ms
    let start: number | null = null;
    const dur = 3600;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(tFade);
      clearTimeout(tGone);
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
        background: "#000",
        transitionDuration: "700ms",
      }}
    >
      {/* WebGL Matrix Field background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Suspense fallback={null}>
          <LaserCollection
            speed={0.8}
            size={1.0}
            length={1.0}
            density={1.0}
            opacity={0.7}
            hue={0}
            saturation={1.0}
            brightness={1.0}
          />
        </Suspense>
      </div>

      {/* Content overlay */}
      <div
        className="relative z-10 flex flex-col items-center"
      >
        {/* Brand name */}
        <p className="text-lg font-bold tracking-[0.25em] uppercase text-white/90" style={{ fontFamily: "system-ui" }}>
          Home Power Calculator
        </p>
        <p className="mt-1.5 text-[11px] font-medium tracking-[0.35em] uppercase text-white/40">
          IPS · Battery · Solar
        </p>

        {/* Progress bar */}
        <div className="mt-8 w-48 mx-auto">
          <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #22d3ee, #10b981, #34d399)",
                transition: "width 0.12s ease-out",
                boxShadow: "0 0 12px rgba(34,211,238,0.4), 0 0 4px rgba(34,211,238,0.6)",
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-[10px] font-medium tracking-wider uppercase text-white/30">
              Initializing
            </span>
            <span className="text-[10px] font-mono font-semibold tabular-nums text-white/20">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
