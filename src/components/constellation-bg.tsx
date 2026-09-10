"use client";

import { ConstellationField } from "@/shaders/constellation-field/ConstellationField";

export function ConstellationBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <ConstellationField
        mode="dark"
        speed={0.5}
        size={1.0}
        strokeWidth={0.7}
        length={1.2}
        density={0.8}
        opacity={0.5}
        hue={0}
        saturation={1.0}
        brightness={1.0}
      />
    </div>
  );
}
