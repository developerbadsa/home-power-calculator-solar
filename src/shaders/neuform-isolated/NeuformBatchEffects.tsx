import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

// ── Inlined HTML sources (avoid ?raw import issues) ─────────────────

const constellationFieldSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Constellation Field</title>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #070914; }
        #constellationCanvas { display: block; width: 100%; height: 100%; }
    </style>
</head>
<body>
    <canvas id="constellationCanvas"></canvas>
    <script>
    (function () {
        var canvas = document.getElementById('constellationCanvas');
        var ctx = canvas.getContext('2d');
        var w, h;
        function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        var LINK = 160;
        var MAX_NODES = window.innerWidth < 768 ? 40 : 85;
        var nodes = [];
        for (var i = 0; i < MAX_NODES; i++) {
            nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, radius: Math.random() * 2.4 + 1.8 });
        }
        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.lineWidth = 1;
            for (var i = 0; i < nodes.length; i++) {
                for (var j = i + 1; j < nodes.length; j++) {
                    var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < LINK) { var alpha = (1 - dist / LINK) * 0.35; ctx.strokeStyle = 'rgba(230, 200, 121, ' + alpha + ')'; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); }
                }
            }
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                ctx.fillStyle = '#E6C879'; ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2); ctx.fill();
                node.x += node.vx; node.y += node.vy;
                if (node.x < -10) node.x = w + 10; if (node.x > w + 10) node.x = -10;
                if (node.y < -10) node.y = h + 10; if (node.y > h + 10) node.y = -10;
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();
    <\\/script>
</body>
</html>`;

const matrixFieldSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Matrix Field</title>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
        #glcanvas { display: block; width: 100%; height: 100%; }
    </style>
</head>
<body>
    <canvas id="glcanvas"></canvas>
    <script>
    (function () {
        var canvas = document.getElementById('glcanvas');
        var gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
        if (!gl) return;
        var VERT = 'attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0,1); }';
        var FRAG = [
            'precision highp float;',
            'uniform vec2 u_res;',
            'uniform vec2 u_ptr;',
            'uniform float u_time;',
            'uniform float u_intensity;',
            '',
            'float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }',
            '',
            'float noise(vec2 p){',
            '  vec2 i=floor(p), f=fract(p);',
            '  vec2 u=f*f*(3.0-2.0*f);',
            '  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);',
            '}',
            '',
            'float fbm(vec2 p){',
            '  float r=0.0, w=0.5;',
            '  for(int i=0;i<5;i++){ r+=noise(p)*w; p=mat2(1.6,1.2,-1.2,1.6)*p+9.1; w*=0.5; }',
            '  return r;',
            '}',
            '',
            'void main(){',
            '  vec2 uv=(gl_FragCoord.xy*2.0-u_res.xy)/min(u_res.x,u_res.y);',
            '  vec2 ptr=u_ptr;',
            '  float t=u_time*0.15;',
            '  float a1=abs(uv.x-ptr.x*0.15);',
            '  float a2=abs(uv.y-ptr.y*0.15);',
            '  float a3=abs(uv.x+uv.y-(ptr.x+ptr.y)*0.1);',
            '  float line1=exp(-a1*a1*800.0)*smoothstep(1.2,0.2,abs(uv.y));',
            '  float line2=exp(-a2*a2*800.0)*smoothstep(1.2,0.2,abs(uv.x));',
            '  float line3=exp(-a3*a3*400.0)*smoothstep(1.4,0.2,abs(uv.x-uv.y));',
            '  float jDist=length(uv-vec2(ptr.x*0.15,ptr.y*0.15));',
            '  float junction=exp(-jDist*jDist*25.0);',
            '  float p1=exp(-a1*a1*2000.0)*smoothstep(0.0,0.3,fract(uv.y*2.0-t*3.0))*smoothstep(1.2,0.3,abs(uv.y));',
            '  float p2=exp(-a2*a2*2000.0)*smoothstep(0.0,0.3,fract(uv.x*2.0+t*2.5))*smoothstep(1.2,0.3,abs(uv.x));',
            '  float p3=exp(-a3*a3*1000.0)*smoothstep(0.0,0.3,fract((uv.x+uv.y)*1.5-t*2.0))*smoothstep(1.4,0.3,abs(uv.x-uv.y));',
            '  float n=fbm(uv*3.0+vec2(t*0.2,t*0.15)+ptr*0.3);',
            '  float field=smoothstep(0.35,0.65,n)*0.08;',
            '  float gx=exp(-abs(fract(uv.x*8.0)-0.5)*12.0)*0.04;',
            '  float gy=exp(-abs(fract(uv.y*8.0)-0.5)*12.0)*0.04;',
            '  vec3 cyan=vec3(0.2,0.9,1.0);',
            '  vec3 green=vec3(0.1,1.0,0.6);',
            '  vec3 white=vec3(1.0);',
            '  vec3 col=vec3(0.005,0.01,0.015);',
            '  col+=cyan*(line1+line2)*0.3;',
            '  col+=green*line3*0.25;',
            '  col+=white*(p1+p2)*0.6;',
            '  col+=green*p3*0.5;',
            '  col+=white*junction*0.8;',
            '  col+=cyan*field;',
            '  col+=vec3(gx+gy)*cyan;',
            '  float vig=1.0-smoothstep(0.3,1.5,length(uv));',
            '  col*=0.5+vig*0.5;',
            '  col*=u_intensity;',
            '  col=col/(col+0.8);',
            '  col=pow(max(col,vec3(0.0)),vec3(0.9));',
            '  gl_FragColor=vec4(col,1.0);',
            '}'
        ].join('\\n');
        function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
        var vs = compile(gl.VERTEX_SHADER, VERT);
        var fs = compile(gl.FRAGMENT_SHADER, FRAG);
        var prog = gl.createProgram();
        gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
        gl.useProgram(prog);
        var pos = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        var uRes = gl.getUniformLocation(prog, 'u_res');
        var uPtr = gl.getUniformLocation(prog, 'u_ptr');
        var uTime = gl.getUniformLocation(prog, 'u_time');
        var uIntensity = gl.getUniformLocation(prog, 'u_intensity');
        var ptrX = 0, ptrY = 0, tX = 0, tY = 0;
        var intensity = 0.006;
        var started = performance.now();
        function resize() {
            var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.max(1, Math.round(window.innerWidth * dpr));
            canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        resize();
        window.addEventListener('resize', resize);
        canvas.addEventListener('pointermove', function(e) { var r = canvas.getBoundingClientRect(); tX = ((e.clientX - r.left) / r.width) * 2 - 1; tY = -(((e.clientY - r.top) / r.height) * 2 - 1); }, { passive: true });
        canvas.addEventListener('pointerleave', function() { tX = 0; tY = 0; }, { passive: true });
        function draw(now) {
            ptrX += (tX - ptrX) * 0.05; ptrY += (tY - ptrY) * 0.05;
            var elapsed = (now - started) * 0.001;
            gl.useProgram(prog);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform2f(uPtr, ptrX, ptrY);
            gl.uniform1f(uTime, elapsed);
            gl.uniform1f(uIntensity, intensity);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    })();
    <\\/script>
</body>
</html>`;

// ── Types ──────────────────────────────────────────────────────────

type FocusRole = "background" | "ui";
type NeuformMode = "dark" | "light";
type NeuformModePreference = NeuformMode | "auto";

type FocusTarget = {
  selector: string;
  role: FocusRole;
  width?: string;
};

type BakeKnobs = {
  variant: string;
  size: number;
  gap: number;
  length: number;
  density: number;
  strokeWidth: number;
  mode: NeuformMode;
};

type EffectDefinition = {
  title: string;
  source: string;
  background: string | ((mode: NeuformMode) => string);
  defaultMode?: NeuformModePreference;
  supportsMode?: boolean;
  targets: readonly FocusTarget[];
  focusCss?: string;
  patch?: (source: string, knobs: BakeKnobs) => string;
};

export type NeuformBatchEffectProps = {
  variant?: string;
  mode?: NeuformModePreference;
  speed?: number;
  size?: number;
  gap?: number;
  length?: number;
  density?: number;
  strokeWidth?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

export const NEUFORM_BATCH_DEFAULTS = {
  mode: "dark" as NeuformMode,
  speed: 1,
  size: 1,
  gap: 2,
  length: 1,
  density: 1,
  strokeWidth: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

const LIGHT_PAPER = "#eef1f6";

// ── Helpers ────────────────────────────────────────────────────────

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function scaleCount(base: number, density: number, minimum = 1) {
  return Math.max(minimum, Math.round(base * density));
}

function resolveMode(mode: NeuformMode | number | string | undefined, fallback: NeuformMode = "dark"): NeuformMode {
  if (mode === undefined || mode === null) return fallback;
  if (mode === "light" || mode === 1 || mode === "1") return "light";
  return "dark";
}

function readAutomaticMode(): NeuformMode {
  if (typeof document === "undefined" || typeof window === "undefined") return "dark";
  const root = document.documentElement;
  const declared = root.dataset.scheme ?? root.dataset.theme;
  if (declared === "light" || declared === "dark") return declared;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useAutomaticMode(enabled: boolean) {
  const [mode, setMode] = useState<NeuformMode>(readAutomaticMode);

  useEffect(() => {
    if (!enabled || typeof document === "undefined" || typeof window === "undefined") return undefined;
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setMode(readAutomaticMode());
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-scheme", "data-theme"] });
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [enabled]);

  return mode;
}

function resolveBackground(background: EffectDefinition["background"], mode: NeuformMode) {
  return typeof background === "function" ? background(mode) : background;
}

// ── Effect definitions ─────────────────────────────────────────────

const EFFECTS = {
  constellationField: {
    title: "Constellation Field",
    source: constellationFieldSource,
    supportsMode: true,
    background: (mode: NeuformMode) => (mode === "light" ? LIGHT_PAPER : "#070914"),
    targets: [{ selector: "#constellationCanvas", role: "background" as FocusRole }],
    patch(source: string, { size, length, density, strokeWidth, mode }: BakeKnobs) {
      let next = source
        .replace("const LINK = 160;", `const LINK = ${Math.round(160 * length)};`)
        .replace("const MAX_NODES = window.innerWidth < 768 ? 40 : 85;", `const MAX_NODES = window.innerWidth < 768 ? ${scaleCount(40, density, 8)} : ${scaleCount(85, density, 12)};`)
        .replace("radius: Math.random() * 2.4 + 1.8", `radius: (Math.random() * 2.4 + 1.8) * ${size}`)
        .replace("ctx.lineWidth = 1;", `ctx.lineWidth = ${Number(Math.max(0.25, strokeWidth).toFixed(2))};`)
        .replace("node.x += node.vx;", "node.x += node.vx * ((window.__SF_CONTROLS&&window.__SF_CONTROLS.speed)||1);")
        .replace("node.y += node.vy;", "node.y += node.vy * ((window.__SF_CONTROLS&&window.__SF_CONTROLS.speed)||1);");
      if (mode === "light") {
        next = next.replace("ctx.strokeStyle = '#E6C879';", "ctx.strokeStyle = '#8B6914';").replace("ctx.fillStyle = '#E6C879';", "ctx.fillStyle = '#8B6914';");
      }
      return next;
    },
  },
  matrixField: {
    title: "Matrix Field",
    source: matrixFieldSource,
    background: "#000000",
    targets: [{ selector: "#glcanvas", role: "background" as FocusRole }],
    patch(source: string, { size, length }: BakeKnobs) {
      return source.replace("float intensity = 0.006;", `float intensity = ${Number((0.006 * size * length).toFixed(5))};`);
    },
  },
} as const satisfies Record<string, EffectDefinition>;

// ── Document builder ───────────────────────────────────────────────

function buildFocusedDocument(
  definition: EffectDefinition,
  knobs: BakeKnobs & { speed: number; opacity: number },
) {
  const mode = knobs.mode;
  const background = resolveBackground(definition.background, mode);
  const targetJson = JSON.stringify(definition.targets).replace(/</g, "\\u003c");
  const controlsJson = JSON.stringify({ mode, speed: knobs.speed, size: knobs.size, gap: knobs.gap, length: knobs.length, density: knobs.density, strokeWidth: knobs.strokeWidth, opacity: knobs.opacity }).replace(/</g, "\\u003c");
  const patchedSource = definition.patch ? definition.patch(definition.source, { variant: knobs.variant, size: knobs.size, gap: knobs.gap, length: knobs.length, density: knobs.density, strokeWidth: knobs.strokeWidth, mode }) : definition.source;
  const focusStyle = `<style data-threeui-focus>\nhtml, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: ${background} !important; }\nbody { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }\nbody > * { visibility: hidden !important; }\nbody[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }\n[data-threeui-residual] { display: none !important; }\n[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; z-index: 0 !important; opacity: 1 !important; pointer-events: none !important; }\n[data-threeui-role="ui"] { position: relative !important; z-index: 1 !important; width: min(calc(100% - 32px), var(--threeui-target-width, 1040px)) !important; max-width: none !important; max-height: calc(100% - 32px) !important; margin: auto !important; overflow: auto !important; opacity: 1 !important; transform: none !important; filter: none !important; flex: none !important; box-sizing: border-box !important; }\n</style>`;
  const controlScript = `<script data-threeui-controls>\n(function () {\n  var controls = ${controlsJson};\n  window.__SF_CONTROLS = controls;\n  var origin = performance.now();\n  var virtual = 0;\n  var last = origin;\n  var performanceNow = performance.now.bind(performance);\n  var dateNow = Date.now.bind(Date);\n  var dateOrigin = dateNow();\n  performance.now = function () { var real = performanceNow(); virtual += (real - last) * (controls.speed || 1); last = real; return origin + virtual; };\n  Date.now = function () { return dateOrigin + (performance.now() - origin); };\n  var raf = window.requestAnimationFrame.bind(window);\n  window.requestAnimationFrame = function (callback) { return raf(function () { callback(performance.now()); }); };\n  function applyVisual() {\n    var opacity = controls.opacity == null ? 1 : controls.opacity;\n    Array.prototype.forEach.call(document.querySelectorAll('[data-threeui-role]'), function (element) {\n      element.style.opacity = String(opacity);\n    });\n  }\n  window.addEventListener('message', function (event) {\n    if (!event.data || event.data.type !== 'threeui-controls') return;\n    var next = event.data.controls || {};\n    Object.keys(next).forEach(function (key) { controls[key] = next[key]; });\n    applyVisual();\n  });\n  window.__SF_APPLY_CONTROLS = applyVisual;\n})();\n</script>`;
  const focusScript = `<script data-threeui-focus>\n(function () {\n  var isolated = false;\n  function isolate() {\n    if (isolated) return;\n    var specs = ${targetJson};\n    var roots = [];\n    specs.forEach(function (spec) {\n      var element = document.querySelector(spec.selector);\n      if (!element) return;\n      element.setAttribute('data-threeui-role', spec.role);\n      if (spec.width) element.style.setProperty('--threeui-target-width', spec.width);\n      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);\n    });\n    if (!roots.length) return;\n    isolated = true;\n    roots.forEach(function (root) { document.body.appendChild(root); });\n    Array.from(document.body.children).forEach(function (element) {\n      if (roots.indexOf(element) !== -1) return;\n      element.setAttribute('data-threeui-residual', '');\n      element.setAttribute('aria-hidden', 'true');\n      if ('inert' in element) element.inert = true;\n    });\n    document.body.setAttribute('data-threeui-ready', '');\n    if (window.__SF_APPLY_CONTROLS) window.__SF_APPLY_CONTROLS();\n    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });\n  }\n  function scheduleIsolation() { setTimeout(isolate, 100); }\n  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });\n  else scheduleIsolation();\n  window.addEventListener('load', isolate, { once: true });\n})();\n</script>`;
  return patchedSource
    .replace(/<head([^>]*)>/i, `<head$1>${controlScript}${focusStyle}`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

// ── Core renderer ──────────────────────────────────────────────────

function NeuformBatchEffect({
  definition,
  variant = "cube",
  mode,
  speed = NEUFORM_BATCH_DEFAULTS.speed,
  size = NEUFORM_BATCH_DEFAULTS.size,
  gap = NEUFORM_BATCH_DEFAULTS.gap,
  length = NEUFORM_BATCH_DEFAULTS.length,
  density = NEUFORM_BATCH_DEFAULTS.density,
  strokeWidth = NEUFORM_BATCH_DEFAULTS.strokeWidth,
  opacity = NEUFORM_BATCH_DEFAULTS.opacity,
  hue = NEUFORM_BATCH_DEFAULTS.hue,
  saturation = NEUFORM_BATCH_DEFAULTS.saturation,
  brightness = NEUFORM_BATCH_DEFAULTS.brightness,
  className,
  style,
}: NeuformBatchEffectProps & { definition: EffectDefinition }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const requestedMode = mode ?? definition.defaultMode ?? NEUFORM_BATCH_DEFAULTS.mode;
  const automaticMode = useAutomaticMode(requestedMode === "auto");
  const resolvedMode = requestedMode === "auto" ? automaticMode : resolveMode(requestedMode, NEUFORM_BATCH_DEFAULTS.mode);
  const background = resolveBackground(definition.background, resolvedMode);
  const safeSpeed = clamp(speed, 0, 3);
  const safeSize = clamp(size, 0.05, 200);
  const safeGap = clamp(gap, 0, 64);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeStrokeWidth = clamp(strokeWidth, 0.25, 8);
  const safeOpacity = clamp(opacity, 0.05, 1);
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  const source = useMemo(
    () => buildFocusedDocument(definition, { variant, mode: resolvedMode, speed: NEUFORM_BATCH_DEFAULTS.speed, size: safeSize, gap: safeGap, length: safeLength, density: safeDensity, strokeWidth: safeStrokeWidth, opacity: NEUFORM_BATCH_DEFAULTS.opacity }),
    [definition, resolvedMode, safeDensity, safeGap, safeLength, safeSize, safeStrokeWidth, variant],
  );

  useEffect(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ type: "threeui-controls", controls: { mode: resolvedMode, speed: safeSpeed, size: safeSize, gap: safeGap, length: safeLength, density: safeDensity, strokeWidth: safeStrokeWidth, opacity: safeOpacity } }, "*");
  }, [resolvedMode, safeDensity, safeGap, safeLength, safeOpacity, safeSize, safeSpeed, safeStrokeWidth, source]);

  const filter = safeHue === 0 && safeSaturation === 1 && safeBrightness === 1 ? undefined : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe ref={iframeRef} className={className} title={definition.title} srcDoc={source} sandbox="allow-scripts" loading="eager" style={{ display: "block", width: "100%", height: "100%", border: 0, background, filter, ...style }} />
  );
}

// ── Exports ────────────────────────────────────────────────────────

function createEffectComponent(definition: EffectDefinition) {
  return function EffectComponent(props: NeuformBatchEffectProps) {
    return <NeuformBatchEffect {...props} definition={definition} />;
  };
}

export const ConstellationField = createEffectComponent(EFFECTS.constellationField);
export const MatrixField = createEffectComponent(EFFECTS.matrixField);
