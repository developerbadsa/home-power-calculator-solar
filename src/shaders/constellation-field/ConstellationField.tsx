import type { ComponentType } from "react";

import {
  ConstellationField as ConstellationFieldRenderer,
  type NeuformBatchEffectProps,
} from "../neuform-isolated/NeuformBatchEffects";

export type ConstellationFieldVariant =
  | "constellation-field";

export type ConstellationFieldProps = NeuformBatchEffectProps & {
  variant?: ConstellationFieldVariant;
};

const VARIANT_COMPONENTS: Record<ConstellationFieldVariant, ComponentType<NeuformBatchEffectProps>> = {
  "constellation-field": ConstellationFieldRenderer,
};

export function ConstellationField({ variant = "constellation-field", ...props }: ConstellationFieldProps) {
  const Variant = VARIANT_COMPONENTS[variant];
  return <Variant {...props} />;
}
