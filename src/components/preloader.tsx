"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const LaserCollection = dynamic(
  () => import("@/shaders/laser/LaserCollection").then((m) => m.LaserCollection),
  { ssr: false },
);

/**
 * Preloader — LaserCollection matrix-field WebGL fills the entire screen.
 * Brand text + progress bar on top. Fades out when done.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const tFade = setTimeout(() => setFading(true), 3500);
    const tGone = setTimeout(() => setGone(true), 4200);

    let start: number | null = null;
    const dur = 3500;
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "#000", transitionDuration: "700ms" }}
    >
      {/* Full-screen WebGL matrix junction */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <LaserCollection
            speed={1.0}
            size={1.0}
            length={1.0}
            density={1.0}
            opacity={1.0}
            hue={0}
            saturation={1.0}
            brightness={1.0}
          />
        </Suspense>
      </div>

      {/* Brand + progress */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-xl font-bold tracking-[0.2em] uppercase text-white/90" style={{ fontFamily: "system-ui" }}>
          Home Power Calculator
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.35em] uppercase text-white/40">
          IPS · Battery · Solar
        </p>

        <div className="mt-8 w-48">
          <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #22d3ee, #10b981)",
                transition: "width 0.1s ease-out",
                boxShadow: "0 0 10px rgba(34,211,238,0.5)",
              }}
            />
          </div>
          <p className="mt-2 text-center text-[10px] font-mono text-white/25">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
