export const W = 480;
export const H = 270;

const BAYER = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mod = (n, m) => ((n % m) + m) % m;

export function hash01(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

export function rgba(hex, alpha = 1) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mix(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

export function px(ctx, x, y, w = 1, h = 1, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

export function hline(ctx, x0, x1, y, color) {
  const start = Math.round(Math.min(x0, x1));
  const end = Math.round(Math.max(x0, x1));
  ctx.fillStyle = color;
  ctx.fillRect(start, Math.round(y), end - start + 1, 1);
}

export function vline(ctx, x, y0, y1, color) {
  const start = Math.round(Math.min(y0, y1));
  const end = Math.round(Math.max(y0, y1));
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), start, 1, end - start + 1);
}

export function line(ctx, x0, y0, x1, y1, color) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const ex = Math.round(x1);
  const ey = Math.round(y1);
  const dx = Math.abs(ex - x);
  const dy = -Math.abs(ey - y);
  const sx = x < ex ? 1 : -1;
  const sy = y < ey ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = color;
  for (;;) {
    ctx.fillRect(x, y, 1, 1);
    if (x === ex && y === ey) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

export function catenary(ctx, x0, y0, x1, y1, sag, color, steps = 32) {
  ctx.fillStyle = color;
  let prevX = x0;
  let prevY = y0;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const x = lerp(x0, x1, t);
    const y = lerp(y0, y1, t) + Math.sin(Math.PI * t) * sag;
    line(ctx, prevX, prevY, x, y, color);
    prevX = x;
    prevY = y;
  }
}

export function createSky(colors, options = {}) {
  const { glow = null, glowY = 0.8, grain = 2.2 } = options;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(W, H);
  const palette = colors.map(hexToRgb);
  const glowRgb = glow ? hexToRgb(glow) : null;
  const bands = palette.length - 1;
  let i = 0;

  for (let y = 0; y < H; y += 1) {
    const v = y / (H - 1);
    const scaled = clamp(v, 0, 1) * bands;
    const base = Math.min(bands - 1, Math.floor(scaled));
    const fraction = scaled - base;
    const glowAmount = glowRgb
      ? Math.exp(-Math.pow((v - glowY) / 0.18, 2)) * 0.5
      : 0;

    for (let x = 0; x < W; x += 1) {
      const threshold = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
      let color = palette[base + (fraction > threshold ? 1 : 0)];
      if (glowRgb && glowAmount > 0) {
        color = mix(color, glowRgb, glowAmount);
      }
      const noise = (hash01(x * 0.71 + y * 13.37) - 0.5) * grain;
      image.data[i] = clamp(color[0] + noise, 0, 255);
      image.data[i + 1] = clamp(color[1] + noise, 0, 255);
      image.data[i + 2] = clamp(color[2] + noise, 0, 255);
      image.data[i + 3] = 255;
      i += 4;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas;
}

export function drawStars(ctx, t, options = {}) {
  const {
    seed = 1,
    count = 70,
    maxY = 160,
    color = "#f7e9cf",
    drift = 0,
  } = options;
  const random = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < count; i += 1) {
    const x = mod(Math.floor(random() * W + drift), W);
    const y = Math.floor(random() * maxY);
    const phase = random() * Math.PI * 2;
    const speed = 0.4 + random() * 1.2;
    const alpha = 0.28 + Math.abs(Math.sin(t * speed + phase)) * 0.65;
    const size = random() > 0.88 ? 2 : 1;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, 1);
    if (size === 2 && random() > 0.6) {
      ctx.fillRect(x, y - 1, 1, 3);
      ctx.fillRect(x - 1, y, 3, 1);
    }
  }
  ctx.restore();
}

export function drawMoon(ctx, x, y, r, options = {}) {
  const {
    color = "#f3e7cb",
    shade = "#d8c7a8",
    craters = true,
    halo = true,
  } = options;
  const cx = Math.round(x);
  const cy = Math.round(y);
  const radius = Math.round(r);

  if (halo) {
    ctx.save();
    for (let py = cy - radius - 13; py <= cy + radius + 13; py += 1) {
      for (let pxx = cx - radius - 13; pxx <= cx + radius + 13; pxx += 1) {
        const d = Math.hypot(pxx - cx, py - cy);
        if (d > radius + 1 && d < radius + 13) {
          const alpha = 0.045 * (1 - (d - radius) / 13);
          const threshold = (BAYER[(py & 3) * 4 + (pxx & 3)] + 0.5) / 16;
          if (threshold < 0.7) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(pxx, py, 1, 1);
          }
        }
      }
    }
    ctx.restore();
  }

  for (let py = -radius; py <= radius; py += 1) {
    for (let pxx = -radius; pxx <= radius; pxx += 1) {
      if (pxx * pxx + py * py <= radius * radius) {
        const threshold = (BAYER[(py + radius) & 3] * 4 + ((pxx + radius) & 3)) / 16;
        const edge = pxx * pxx + py * py > (radius - 1.2) * (radius - 1.2);
        if (!edge || threshold < 0.55) {
          const lit = pxx < radius * 0.2 || py < -radius * 0.3;
          let c = lit ? color : shade;
          if (craters && hash01(pxx * 3.1 + py * 8.7) > 0.88) c = shade;
          ctx.fillStyle = c;
          ctx.fillRect(cx + pxx, cy + py, 1, 1);
        }
      }
    }
  }
}

export function drawCloudBand(ctx, t, options = {}) {
  const {
    seed = 7,
    y = 55,
    color = "#3c2a55",
    alpha = 0.55,
    speed = 1.6,
    layers = 3,
    spread = 18,
    height = 4,
  } = options;
  const random = mulberry32(seed);
  ctx.save();
  ctx.fillStyle = color;

  for (let i = 0; i < layers; i += 1) {
    const width = 36 + random() * 96;
    const x = mod(random() * (W + 180) + t * speed * (0.4 + i * 0.18), W + 180) - 90;
    const baseY = y + Math.floor(random() * spread);
    const blobs = 2 + Math.floor(random() * 3);

    for (let blob = 0; blob < blobs; blob += 1) {
      const cx = x + random() * width;
      const cy = baseY + (random() * 2 - 1) * Math.max(2, height);
      const rx = 10 + random() * (width * 0.42);
      const ry = Math.max(2, height * (0.45 + random() * 0.65));
      const localAlpha = alpha * (0.4 + random() * 0.45);
      const phase = random() * 100;

      for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy += 1) {
        const p = dy / (ry + 0.5);
        const span = Math.sqrt(Math.max(0, 1 - p * p)) * rx;
        if (span < 1) continue;
        for (let dx = -Math.floor(span); dx <= Math.floor(span); dx += 1) {
          const edge = Math.abs(dx) / Math.max(1, span);
          const threshold = (BAYER[(Math.round(cy + dy) & 3) * 4 + (Math.round(cx + dx) & 3)] + 0.5) / 16;
          if (threshold < 0.82 && hash01(phase + dx * 0.41 + dy * 9.1) > edge * 0.24) {
            ctx.globalAlpha = localAlpha * (1 - edge * 0.35);
            ctx.fillRect(Math.round(cx + dx), Math.round(cy + dy), 1, 1);
          }
        }
      }

      // Loose wisps trailing off the main body.
      for (let wisp = 0; wisp < 3; wisp += 1) {
        const wy = Math.round(cy + (random() * 2 - 1) * ry);
        const wx = Math.round(cx - rx - random() * 18);
        const wl = 3 + Math.round(random() * 12);
        ctx.globalAlpha = localAlpha * 0.5;
        ctx.fillRect(wx, wy, wl, 1);
      }
    }
  }
  ctx.restore();
}

export function drawSkyline(ctx, options = {}) {
  const {
    baseY = 200,
    color = "#21152f",
    roofColor = "#17101f",
    seed = 5,
    minH = 30,
    maxH = 90,
    minW = 12,
    maxW = 32,
    gap = 3,
    windows = true,
    windowColors = ["#f5c879", "#e9a76a", "#8dd9df"],
    windowDensity = 0.22,
    t = 0,
    minX = -8,
    maxX = W + 8,
    antenna = 0.22,
    roofDetail = true,
    dim = 1,
  } = options;
  const random = mulberry32(seed);
  let x = minX;

  while (x < maxX) {
    const width = Math.round(minW + random() * (maxW - minW));
    const height = Math.round(minH + random() * (maxH - minH));
    const y = Math.round(baseY - height);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = roofColor;
    ctx.fillRect(x, y, width, 2);
    if (roofDetail && random() > 0.55) {
      ctx.fillRect(x + 2, y - 1, width - 4, 1);
    }

    if (random() < antenna) {
      const ax = x + 2 + Math.round(random() * Math.max(1, width - 5));
      const ah = 4 + Math.round(random() * 10);
      ctx.fillStyle = roofColor;
      ctx.fillRect(ax, y - ah, 1, ah);
      if (random() > 0.55) {
        ctx.fillStyle = "#ff5b68";
        ctx.fillRect(ax, y - ah - 1, 1, 1);
      }
    }

    if (windows) {
      const cols = Math.max(1, Math.floor((width - 4) / 4));
      const rows = Math.max(1, Math.floor((height - 6) / 5));
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const wx = x + 3 + col * 4;
          const wy = y + 5 + row * 5;
          if (wx > x + width - 2) continue;
          const r = hash01(seed * 7.3 + row * 31 + col * 17 + x * 0.3);
          if (r < windowDensity) {
            let wc = windowColors[Math.floor(hash01(r * 22 + row + col) * windowColors.length)];
            let alpha = dim * (0.45 + hash01(r * 13) * 0.5);
            const flicker = hash01(row * 7 + col * 11 + x) > 0.94;
            if (flicker) alpha *= 0.55 + Math.abs(Math.sin(t * 0.7 + row + col)) * 0.45;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = wc;
            ctx.fillRect(wx, wy, 2, 1);
            if (r > windowDensity * 0.35) ctx.fillRect(wx, wy + 1, 1, 1);
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    if (roofDetail && random() > 0.72 && width > 18) {
      const tankX = x + 4 + Math.round(random() * (width - 12));
      ctx.fillStyle = roofColor;
      ctx.fillRect(tankX, y - 5, 4, 4);
      ctx.fillRect(tankX + 1, y - 7, 2, 2);
    }

    x += width + Math.max(0, Math.round(random() * gap));
  }
}

export function drawCar(ctx, x, y, color, direction = 1, headlights = true, t = 0) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (direction < 0) ctx.scale(-1, 1);

  if (headlights) {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffe7a5";
    ctx.fillRect(10, 2, 8, 1);
    ctx.fillRect(12, 3, 7, 1);
    ctx.fillRect(14, 4, 5, 1);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = color;
  ctx.fillRect(0, 2, 10, 3);
  ctx.fillRect(2, 0, 6, 2);
  ctx.fillStyle = "#0c0a12";
  ctx.fillRect(2, 5, 2, 2);
  ctx.fillRect(7, 5, 2, 2);
  ctx.fillStyle = "#b8e6ff";
  ctx.fillRect(3, 1, 2, 1);
  ctx.fillRect(6, 1, 1, 1);
  ctx.fillStyle = "#ffdf9d";
  ctx.fillRect(9, 3, 1, 1);
  ctx.fillStyle = "#ff5967";
  ctx.fillRect(0, 3, 1, 1);

  if (headlights && Math.sin(t * 2.2) > -0.9) {
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#ffe7a5";
    ctx.fillRect(10, 3, 1, 1);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

export function drawPerson(ctx, x, y, options = {}) {
  const {
    coat = "#16121c",
    skin = "#e3b08d",
    umbrella = null,
    scale = 1,
    walk = 0,
  } = options;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (scale !== 1) ctx.scale(scale, scale);

  ctx.fillStyle = coat;
  ctx.fillRect(0, 3, 3, 5);
  ctx.fillRect(walk > 0 ? 0 : 2, 8, 1, 2);
  ctx.fillRect(walk > 0 ? 2 : 0, 8, 1, 2);
  ctx.fillStyle = skin;
  ctx.fillRect(1, 1, 2, 2);
  ctx.fillStyle = coat;
  ctx.fillRect(0, 0, 3, 1);

  if (umbrella) {
    ctx.fillStyle = umbrella;
    ctx.fillRect(-1, -1, 5, 1);
    ctx.fillRect(-2, -2, 7, 1);
    ctx.fillRect(-2, -3, 6, 1);
    ctx.fillRect(1, 0, 1, 5);
    ctx.fillStyle = "#0c0a12";
    ctx.fillRect(1, 4, 1, 1);
  }
  ctx.restore();
}

export function drawRain(ctx, t, options = {}) {
  const {
    count = 150,
    wind = 10,
    speed = 150,
    color = "rgba(188, 216, 255, 1)",
    maxY = H + 10,
    minAlpha = 0.12,
    maxAlpha = 0.46,
  } = options;
  const random = mulberry32(99);
  ctx.save();
  for (let i = 0; i < count; i += 1) {
    const baseX = random() * (W + 40);
    const baseY = random() * H;
    const sp = speed * (0.65 + random() * 0.7);
    const len = 2 + Math.round(random() * 3);
    const x = mod(baseX + t * wind, W + 40) - 20;
    const y = mod(baseY + t * sp, maxY);
    const alpha = minAlpha + random() * (maxAlpha - minAlpha);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, len);
    if (random() > 0.75) {
      ctx.fillRect(Math.round(x - 1), Math.round(y + len), 1, 1);
    }
  }
  ctx.restore();
}

export function drawSnow(ctx, t, options = {}) {
  const {
    count = 110,
    wind = 16,
    speed = 14,
    maxY = H + 8,
    color = "#f4f0e8",
  } = options;
  const random = mulberry32(417);
  ctx.save();
  for (let i = 0; i < count; i += 1) {
    const baseX = random() * (W + 30);
    const baseY = random() * H;
    const sp = speed * (0.5 + random());
    const drift = Math.sin(t * (0.4 + random() * 0.5) + i) * (4 + random() * 10);
    const x = mod(baseX + t * wind + drift, W + 30) - 15;
    const y = mod(baseY + t * sp, maxY);
    const size = random() > 0.82 ? 2 : 1;
    ctx.globalAlpha = 0.35 + random() * 0.55;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
    if (size === 2 && random() > 0.6) ctx.fillRect(Math.round(x - 1), Math.round(y + 2), 1, 1);
  }
  ctx.restore();
}

export function drawPetals(ctx, t, options = {}) {
  const {
    count = 24,
    color = "#ffb8d7",
    seed = 33,
    speed = 7,
  } = options;
  const random = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < count; i += 1) {
    const baseX = random() * W;
    const baseY = random() * H;
    const sp = speed * (0.6 + random() * 1.4);
    const x = mod(baseX + t * 8 + Math.sin(t * 0.6 + i) * 12, W + 20) - 10;
    const y = mod(baseY + t * sp, H + 10) - 5;
    ctx.globalAlpha = 0.45 + random() * 0.45;
    ctx.fillStyle = color;
    if (random() > 0.6) {
      ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
    } else {
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
  ctx.restore();
}

export function drawFog(ctx, t, options = {}) {
  const {
    y = 185,
    color = "#9eb3c9",
    alpha = 0.12,
    layers = 4,
    height = 12,
    seed = 9,
  } = options;
  const random = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < layers; i += 1) {
    const cy = y + random() * height;
    const offset = mod(t * (0.7 + i * 0.2) + random() * W, W);
    ctx.globalAlpha = alpha * (0.5 + random() * 0.7);
    ctx.fillStyle = color;
    for (let row = 0; row < 3; row += 1) {
      for (let x = 0; x < W; x += 1) {
        const threshold = (BAYER[(Math.round(cy + row) & 3) * 4 + (x & 3)] + 0.5) / 16;
        if (threshold < 0.5 - row * 0.13) {
          const wx = mod(x + offset, W);
          ctx.fillRect(wx, Math.round(cy + row), 1, 1);
        }
      }
    }
  }
  ctx.restore();
}

export function drawWater(ctx, options = {}) {
  const {
    y = 212,
    t = 0,
    topColor = "#0a1524",
    bottomColor = "#060b12",
    waveColor = "#2b4a66",
    reflections = [],
    fog = 0,
  } = options;
  const height = H - y;
  ctx.fillStyle = topColor;
  ctx.fillRect(0, y, W, height);
  ctx.fillStyle = bottomColor;
  ctx.fillRect(0, y + Math.floor(height * 0.45), W, height);

  ctx.save();
  for (let row = 0; row < height; row += 1) {
    const alpha = 0.12 + row / height * 0.22;
    const offset = Math.sin(t * 0.5 + row * 0.65) * 3;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = waveColor;
    for (let x = 0; x < W; x += 3) {
      if (hash01(x * 0.3 + row * 4.1) > 0.55) {
        ctx.fillRect(Math.round(x + offset), y + row, 2, 1);
      }
    }
  }
  ctx.restore();

  for (const reflection of reflections) {
    const { x = W / 2, width = 20, color = "#f5c06e", alpha = 0.35 } = reflection;
    ctx.save();
    for (let row = 2; row < height - 2; row += 2) {
      const wobble = Math.sin(t * 1.1 + row * 0.4 + x) * 3;
      const fade = 1 - row / height;
      ctx.globalAlpha = alpha * fade * (0.55 + Math.abs(Math.sin(t * 0.8 + row * 0.25)) * 0.45);
      ctx.fillStyle = color;
      const span = Math.max(2, Math.round(width * (0.5 + fade * 0.5)));
      ctx.fillRect(Math.round(x + wobble - span / 2), y + row, span, 1);
      if (hash01(row * 3.7 + x) > 0.72) {
        ctx.fillRect(Math.round(x + wobble - span / 2 - 3), y + row, 2, 1);
      }
    }
    ctx.restore();
  }

  if (fog > 0) drawFog(ctx, t, { y: y - 4, alpha: fog, height: 14, color: "#c9d8e7" });
}

const GLYPHS = {
  A: ["111", "101", "111", "101", "101"],
  B: ["110", "101", "110", "101", "110"],
  C: ["111", "100", "100", "100", "111"],
  D: ["110", "101", "101", "101", "110"],
  E: ["111", "100", "110", "100", "111"],
  F: ["111", "100", "110", "100", "100"],
  G: ["111", "100", "101", "101", "111"],
  H: ["101", "101", "111", "101", "101"],
  I: ["111", "010", "010", "010", "111"],
  J: ["001", "001", "001", "101", "111"],
  K: ["101", "101", "110", "101", "101"],
  L: ["100", "100", "100", "100", "111"],
  M: ["101", "111", "111", "101", "101"],
  N: ["101", "111", "111", "111", "101"],
  O: ["111", "101", "101", "101", "111"],
  P: ["111", "101", "111", "100", "100"],
  Q: ["111", "101", "101", "111", "001"],
  R: ["111", "101", "111", "110", "101"],
  S: ["111", "100", "111", "001", "111"],
  T: ["111", "010", "010", "010", "010"],
  U: ["101", "101", "101", "101", "111"],
  V: ["101", "101", "101", "101", "010"],
  W: ["101", "101", "111", "111", "101"],
  X: ["101", "101", "010", "101", "101"],
  Y: ["101", "101", "010", "010", "010"],
  Z: ["111", "001", "010", "100", "111"],
  0: ["111", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "111"],
  2: ["111", "001", "111", "100", "111"],
  3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"],
  5: ["111", "100", "111", "001", "111"],
  6: ["111", "100", "111", "101", "111"],
  7: ["111", "001", "010", "010", "010"],
  8: ["111", "101", "111", "101", "111"],
  9: ["111", "101", "111", "001", "111"],
  " ": ["000", "000", "000", "000", "000"],
  ".": ["000", "000", "000", "000", "010"],
  "-": ["000", "000", "111", "000", "000"],
  ":": ["000", "010", "000", "010", "000"],
  "&": ["110", "101", "110", "101", "111"],
  "!": ["010", "010", "010", "000", "010"],
};

export function pixelText(ctx, text, x, y, options = {}) {
  const {
    color = "#fff",
    scale = 1,
    align = "left",
    alpha = 1,
    shadow = null,
  } = options;
  const chars = String(text).toUpperCase().split("");
  const glyphWidth = 3;
  const spacing = 1;
  const totalWidth = chars.length * (glyphWidth + spacing) - spacing;
  let startX = Math.round(x);
  if (align === "center") startX -= Math.round(totalWidth * scale * 0.5);
  if (align === "right") startX -= Math.round(totalWidth * scale);
  const startY = Math.round(y);

  if (shadow) {
    drawGlyphs(ctx, chars, startX + scale, startY + scale, scale, shadow, alpha);
  }
  drawGlyphs(ctx, chars, startX, startY, scale, color, alpha);
}

function drawGlyphs(ctx, chars, startX, startY, scale, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  chars.forEach((char, index) => {
    const glyph = GLYPHS[char] || GLYPHS[" "];
    const gx = startX + index * 4 * scale;
    glyph.forEach((row, rowIndex) => {
      for (let col = 0; col < 3; col += 1) {
        if (row[col] === "1") {
          ctx.fillRect(gx + col * scale, startY + rowIndex * scale, scale, scale);
        }
      }
    });
  });
  ctx.restore();
}

export function drawNeonSign(ctx, options = {}) {
  const {
    x = 0,
    y = 0,
    w = 26,
    h = 9,
    text = "BAR",
    color = "#ff5bbd",
    bg = "#150d20",
    t = 0,
    glow = true,
    scale = 1,
  } = options;
  ctx.fillStyle = bg;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
  ctx.fillStyle = rgba(color, 0.5);
  ctx.fillRect(Math.round(x), Math.round(y), w, 1);
  ctx.fillRect(Math.round(x), Math.round(y + h - 1), w, 1);
  ctx.fillRect(Math.round(x), Math.round(y), 1, h);
  ctx.fillRect(Math.round(x + w - 1), Math.round(y), 1, h);

  if (glow) {
    ctx.save();
    ctx.globalAlpha = 0.12 + Math.abs(Math.sin(t * 1.4 + x)) * 0.08;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x - 2), Math.round(y - 2), w + 4, h + 4);
    ctx.restore();
  }
  pixelText(ctx, text, x + w / 2, y + (h - 5 * scale) / 2, {
    color,
    scale,
    align: "center",
  });
}

export function drawWindow(ctx, x, y, color, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
  ctx.fillRect(Math.round(x), Math.round(y + 1), 1, 1);
  ctx.globalAlpha = 1;
}

export function drawGlow(ctx, x, y, rx, ry, color, alpha = 0.12, seed = 3) {
  ctx.save();
  ctx.fillStyle = color;
  for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy += 1) {
    const p = dy / (ry + 0.5);
    const span = Math.sqrt(Math.max(0, 1 - p * p)) * rx;
    for (let dx = -Math.ceil(span); dx <= Math.ceil(span); dx += 1) {
      const edge = Math.abs(dx) / Math.max(1, span);
      const threshold = (BAYER[(Math.round(y + dy) & 3) * 4 + (Math.round(x + dx) & 3)] + 0.5) / 16;
      if (threshold < 0.7 && hash01(seed + dx * 0.31 + dy * 4.7) > edge * 0.2) {
        ctx.globalAlpha = alpha * (1 - edge * 0.45) * (1 - Math.abs(p) * 0.3);
        ctx.fillRect(Math.round(x + dx), Math.round(y + dy), 1, 1);
      }
    }
  }
  ctx.restore();
}
