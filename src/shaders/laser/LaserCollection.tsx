import { lazy, Suspense } from "react";

import type { NeuformBatchEffectProps } from "../neuform-isolated/NeuformBatchEffects";

export type LaserVariant = "matrix-field";

export type LaserCollectionProps = Omit<NeuformBatchEffectProps, "mode" | "gap" | "strokeWidth"> & {
  variant?: LaserVariant;
};

const MatrixField = lazy(() =>
  import("../neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.MatrixField })),
);

const FALLBACK = <div className="threeui-background laser-variant" />;

export function LaserCollection({ variant = "matrix-field", ...props }: LaserCollectionProps) {
  return (
    <Suspense fallback={FALLBACK}>
      <MatrixField {...props} />
    </Suspense>
  );
}
