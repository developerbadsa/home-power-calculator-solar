"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const LaserCollection = dynamic(
  () => import("@/shaders/laser/LaserCollection").then((m) => m.LaserCollection),
  { ssr: false },
);

export function MatrixBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Suspense fallback={null}>
        <LaserCollection
          speed={0.6}
          size={1.0}
          length={1.0}
          density={0.8}
          opacity={0.35}
          hue={0}
          saturation={1.0}
          brightness={1.0}
        />
      </Suspense>
    </div>
  );
}
