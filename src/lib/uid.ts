/**
 * Unique id for wizard rows. Kept outside components so React lint rules
 * (component purity) don't flag impure calls during render.
 */
export function createUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}