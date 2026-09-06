/**
 * Generate PWA icon PNGs (public/icons/icon-192.png, icon-512.png) using only
 * Node built-ins (zlib). No image dependencies.
 *
 *   node scripts/generate-icons.mjs
 *
 * Design: indigo rounded square with an amber lightning bolt — simple,
 * high-contrast, reads at small sizes.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── PNG encoder ──────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Scanlines with filter byte 0.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Drawing ─────────────────────────────────────────────────────────────
const BOLT = [
  [300, 60],
  [180, 290],
  [265, 290],
  [230, 452],
  [390, 220],
  [300, 220],
  [352, 60],
];

function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function roundedRectContains(x, y, size, radius) {
  const cx = Math.min(Math.max(x, radius), size - radius);
  const cy = Math.min(Math.max(y, radius), size - radius);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function renderIcon(size) {
  const s = 4; // supersampling for smooth edges
  const out = Buffer.alloc(size * size * 4);
  const scale = size / 512;
  const radius = 112 * scale;
  const bolt = BOLT.map(([px, py]) => [px * scale, py * scale]);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inBolt = 0;
      let inBg = 0;
      for (let sy = 0; sy < s; sy++) {
        for (let sx = 0; sx < s; sx++) {
          const px = x + (sx + 0.5) / s;
          const py = y + (sy + 0.5) / s;
          if (pointInPolygon(px, py, bolt)) inBolt++;
          else if (roundedRectContains(px, py, size, radius)) inBg++;
        }
      }
      const i = (y * size + x) * 4;
      const boltAlpha = inBolt / (s * s);
      const bgAlpha = inBg / (s * s);
      // Background: brand indigo #1e40af, bolt: amber #fbbf24.
      const [br, bg, bb] = [0x1e, 0x40, 0xaf];
      const [fr, fg, fb] = [0xfb, 0xbf, 0x24];
      const useBolt = boltAlpha >= 0.5;
      const alpha = Math.max(boltAlpha, bgAlpha);
      out[i] = useBolt ? fr : br;
      out[i + 1] = useBolt ? fg : bg;
      out[i + 2] = useBolt ? fb : bb;
      out[i + 3] = Math.round(alpha * 255);
    }
  }
  return encodePng(size, size, out);
}

const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const png = renderIcon(size);
  writeFileSync(join(outDir, `icon-${size}.png`), png);
  console.log(`Wrote public/icons/icon-${size}.png (${png.length} bytes)`);
}