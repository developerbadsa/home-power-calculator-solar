"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

/**
 * Preloader — shows on initial load, fades out when the app is ready.
 * Uses CSS animation + state to ensure smooth transition.
 * Matches the dark slate-900 hero theme.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Wait for fonts + initial render, then fade out
    const fadeTimer = setTimeout(() => setFading(true), 800);
    const removeTimer = setTimeout(() => setVisible(false), 1300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated Zap icon — the core brand element */}
      <div className="relative mb-6">
        {/* Outer pulse ring */}
        <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-amber-400/20" />
        {/* Inner glow ring */}
        <div className="absolute inset-0 -m-2 rounded-full bg-amber-400/10 preloader-glow" />
        {/* Icon container */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 preloader-icon">
          <Zap
            className="h-8 w-8 text-amber-400 preloader-zap"
            strokeWidth={2.5}
            fill="currentColor"
          />
        </div>
      </div>

      {/* Brand name */}
      <h1 className="text-xl font-bold text-white preloader-text">
        হোম পাওয়ার ক্যালকুলেটর
      </h1>
      <p className="mt-1 text-sm text-slate-400 preloader-text-delayed">
        IPS · Battery · Solar
      </p>

      {/* Loading dots */}
      <div className="mt-8 flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 preloader-dot-1" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 preloader-dot-2" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 preloader-dot-3" />
      </div>
    </div>
  );
}
