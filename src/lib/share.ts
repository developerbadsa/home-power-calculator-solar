/**
 * Shareable result links (§28, §67): the input snapshot is encoded into a
 * compact base64url fragment in the URL. No server round-trip — the app
 * restores the exact scenario from the link. This keeps shared results
 * auditable (the snapshot is the input for the engine, §45).
 */

export function encodeShareState(state: unknown): string {
  const json = JSON.stringify(state);
  let base64: string;
  if (typeof Buffer !== "undefined") {
    base64 = Buffer.from(json, "utf8").toString("base64");
  } else {
    const bytes = new TextEncoder().encode(json);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    base64 = btoa(bin);
  }
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeShareState<T>(encoded: string): T | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, "=");
    let json: string;
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(padded, "base64").toString("utf8");
    } else {
      const bin = atob(padded);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    }
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** Read the encoded state from the current URL (?r=...), if present. */
export function readShareStateFromUrl<T>(): T | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("r");
  if (!encoded) return null;
  return decodeShareState<T>(encoded);
}