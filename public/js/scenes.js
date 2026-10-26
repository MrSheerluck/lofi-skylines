import {
  W,
  H,
  clamp,
  lerp,
  mod,
  hash01,
  mulberry32,
  rgba,
  px,
  line,
  catenary,
  createSky,
  drawStars,
  drawMoon,
  drawCloudBand,
  drawSkyline,
  drawCar,
  drawPerson,
  drawRain,
  drawSnow,
  drawPetals,
  drawLeaves,
  drawFog,
  drawWater,
  drawGlow,
  pixelText,
  drawNeonSign,
} from "./pixel.js";

const SKY_DEFS = {
  tokyo: {
    colors: ["#070616", "#100b26", "#1d1135", "#341a45", "#57284f", "#914459", "#c36570"],
    glow: "#ff8b9b",
    glowY: 0.78,
  },
  paris: {
    colors: ["#07101e", "#0c1a2d", "#152b44", "#25415a", "#4b5e70", "#907a7e", "#d29b83"],
    glow: "#ffc48d",
    glowY: 0.82,
  },
  "new-york": {
    colors: ["#040916", "#081323", "#0e2035", "#182f48", "#2c455c", "#596c78", "#9b968d"],
    glow: "#d8e7f0",
    glowY: 0.8,
  },
  london: {
    colors: ["#050b13", "#0a141f", "#101f2c", "#1b2f3d", "#344b56", "#697678", "#a89c8c"],
    glow: "#d8c5a5",
    glowY: 0.84,
  },
  seoul: {
    colors: ["#08071a", "#100d28", "#1a1238", "#2b1748", "#4c225d", "#8d3c68", "#d06a87"],
    glow: "#ff9ab5",
    glowY: 0.8,
  },
  rio: {
    colors: ["#04101b", "#071c2b", "#0c2b3b", "#154352", "#2b6061", "#6b7f6d", "#c39f77"],
    glow: "#ffc48d",
    glowY: 0.84,
  },
};

const skyCache = new Map();

function getSky(id) {
  if (!skyCache.has(id)) {
    const def = SKY_DEFS[id] || SKY_DEFS.tokyo;
    skyCache.set(id, createSky(def.colors, { glow: def.glow, glowY: def.glowY }));
  }
  return skyCache.get(id);
}

function drawTokyoTower(ctx, cx, baseY, topY, t) {
  const bright = "#ff7259";
  const mid = "#c84342";
  const dark = "#6f202f";
  const glow = "#ff5b5b";
  const waists = [
    [baseY, 43],
    [baseY - 26, 30],
    [158, 17],
    [132, 8],
    [112, 12],
    [88, 5],
    [topY, 2],
  ];

  const halfAt = (y) => {
    for (let i = 0; i < waists.length - 1; i += 1) {
      const [y0, w0] = waists[i];
      const [y1, w1] = waists[i + 1];
      if (y <= y0 && y >= y1) {
        const p = (y0 - y) / (y0 - y1);
        return lerp(w0, w1, p);
      }
    }
    return 1;
  };

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = glow;
  for (let y = topY; y <= baseY; y += 2) {
    const hw = halfAt(y) + 4;
    ctx.fillRect(Math.round(cx - hw), y, Math.round(hw * 2), 1);
  }
  ctx.restore();

  for (let y = topY; y <= baseY; y += 1) {
    const hw = halfAt(y);
    const structure = y % 6 === 0;
    ctx.fillStyle = structure ? bright : mid;
    ctx.globalAlpha = structure ? 0.95 : 0.6;
    ctx.fillRect(Math.round(cx - hw), y, Math.max(1, Math.round(hw * 2)), 1);
    if (structure) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = dark;
      ctx.fillRect(Math.round(cx - hw), y + 1, Math.max(1, Math.round(hw * 2)), 1);
    }
  }

  ctx.globalAlpha = 1;
  for (let y = topY; y < baseY; y += 8) {
    const hw0 = halfAt(y);
    const hw1 = halfAt(Math.min(baseY, y + 8));
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = bright;
    line(ctx, cx - hw0, y, cx + hw1, y + 8, bright);
    line(ctx, cx + hw0, y, cx - hw1, y + 8, bright);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = bright;
  ctx.fillRect(Math.round(cx - 46), baseY, 92, 2);
  ctx.fillRect(Math.round(cx - 34), baseY - 27, 68, 2);
  ctx.fillRect(Math.round(cx - 17), 158, 34, 1);
  ctx.fillRect(Math.round(cx - 13), 131, 26, 2);
  ctx.fillRect(Math.round(cx - 8), 111, 16, 1);

  ctx.fillStyle = dark;
  ctx.fillRect(Math.round(cx - 1), topY - 13, 2, 13);
  ctx.fillStyle = "#ff4b59";
  if (Math.sin(t * 2.4) > 0.2) {
    ctx.fillRect(Math.round(cx - 1), topY - 15, 2, 2);
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#ff4b59";
    ctx.fillRect(Math.round(cx - 5), topY - 18, 10, 8);
  }
  ctx.globalAlpha = 1;

  drawNeonSign(ctx, {
    x: cx - 21,
    y: 146,
    w: 42,
    h: 8,
    text: "TOKYO",
    color: "#ffd2a8",
    bg: "#2a0f1d",
    t,
    scale: 1,
  });
}

function drawVerticalNeon(ctx, x, y, height, color, t) {
  const lit = 0.7 + Math.sin(t * 2 + x) * 0.15;
  ctx.fillStyle = "#150d1c";
  ctx.fillRect(x, y, 9, height);
  ctx.strokeStyle = rgba(color, 0.8);
  ctx.strokeRect(x + 0.5, y + 0.5, 8, height - 1);
  const count = Math.max(2, Math.floor((height - 4) / 9));
  for (let i = 0; i < count; i += 1) {
    const gy = y + 4 + i * 9;
    ctx.globalAlpha = lit * (i % 3 === 0 ? 0.6 : 1);
    ctx.fillStyle = color;
    ctx.fillRect(x + 2, gy + 1, 5, 1);
    ctx.fillRect(x + 3, gy + 3, 3, 1);
    ctx.fillRect(x + 2, gy + 5, 1, 1);
    ctx.fillRect(x + 6, gy + 5, 1, 1);
    ctx.globalAlpha = 1;
  }
}

function drawLanternString(ctx, t, x0, x1, y, sag) {
  catenary(ctx, x0, y, x1, y, sag, "rgba(24,16,30,.9)", 40);
  for (let i = 0; i < 18; i += 1) {
    const p = (i + 0.5) / 18;
    const x = lerp(x0, x1, p);
    const ly = y + Math.sin(Math.PI * p) * sag + 2;
    ctx.globalAlpha = 0.75 + Math.sin(t * 2.5 + i) * 0.2;
    ctx.fillStyle = i % 2 ? "#ffd18a" : "#ff9f7a";
    ctx.fillRect(Math.round(x), Math.round(ly), 2, 3);
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffd18a";
    ctx.fillRect(Math.round(x) - 2, Math.round(ly) - 1, 6, 6);
    ctx.globalAlpha = 1;
  }
}

function drawTrain(ctx, x, y, t) {
  const carWidth = 42;
  const cars = 4;
  ctx.save();
  for (let car = 0; car < cars; car += 1) {
    const cx = Math.round(x + car * (carWidth + 2));
    if (cx > W + 10 || cx + carWidth < -10) continue;
    ctx.fillStyle = "#171b27";
    ctx.fillRect(cx, y, carWidth, 13);
    ctx.fillStyle = "#2d3547";
    ctx.fillRect(cx, y, carWidth, 2);
    ctx.fillStyle = "#0d1119";
    ctx.fillRect(cx, y + 11, carWidth, 2);
    ctx.fillStyle = "#ffd487";
    for (let i = 0; i < 7; i += 1) {
      ctx.fillRect(cx + 3 + i * 5, y + 4, 3, 4);
    }
    ctx.fillStyle = "#ffd487";
    ctx.globalAlpha = 0.8;
    ctx.fillRect(cx + 2, y + 4, 1, 4);
    ctx.globalAlpha = 1;
    if (car === 0) {
      ctx.fillStyle = "#ff5d6e";
      ctx.fillRect(cx - 1, y + 3, 1, 2);
    }
    if (car === cars - 1) {
      ctx.fillStyle = "#ff5d6e";
      ctx.fillRect(cx + carWidth, y + 3, 1, 2);
    }
  }
  ctx.restore();
}

function drawStreetReflections(ctx, list, t, y0, y1) {
  for (const item of list) {
    const { x, width = 6, color, alpha = 0.3 } = item;
    for (let y = y0; y < y1; y += 2) {
      const p = (y - y0) / Math.max(1, y1 - y0);
      const wobble = Math.sin(t * 1.8 + y * 0.7 + x) * (1 + p * 2);
      const w = Math.max(1, Math.round(width * (1 - p * 0.5)));
      ctx.globalAlpha = alpha * (1 - p) * (0.45 + Math.abs(Math.sin(t * 1.1 + y)) * 0.55);
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + wobble - w / 2), y, w, 1);
    }
  }
  ctx.globalAlpha = 1;
}

function drawStreetLamp(ctx, x, baseY, height, warm = true, t = 0) {
  const topY = baseY - height;
  ctx.fillStyle = "#16131c";
  ctx.fillRect(x, topY, 2, height);
  ctx.fillRect(x - 3, topY, 8, 1);
  ctx.fillStyle = warm ? "#ffd18a" : "#bfe7ff";
  ctx.fillRect(x - 2, topY + 1, 6, 2);
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = warm ? "#ffd18a" : "#bfe7ff";
  ctx.fillRect(x - 8, topY - 5, 18, 14);
  ctx.globalAlpha = 0.28 + Math.sin(t * 3 + x) * 0.03;
  ctx.fillRect(x - 5, topY + 3, 12, 1);
  ctx.globalAlpha = 1;
}

function drawTokyo(ctx, t, weather, reducedMotion) {
  ctx.drawImage(getSky("tokyo"), 0, 0);
  drawStars(ctx, reducedMotion ? 0 : t, { seed: 31, count: 82, maxY: 158, color: "#ffe8d1" });
  drawCloudBand(ctx, t, { seed: 12, y: 36, color: "#2a1a43", alpha: 0.7, height: 5, spread: 30 });
  drawCloudBand(ctx, t, { seed: 61, y: 78, color: "#3b2148", alpha: 0.5, height: 4, spread: 24 });
  drawMoon(ctx, 389, 52, 13, { color: "#f7e7cd", shade: "#d6c0a5" });

  drawSkyline(ctx, {
    baseY: 202,
    color: "#171023",
    roofColor: "#120d1a",
    seed: 81,
    minH: 20,
    maxH: 62,
    minW: 10,
    maxW: 24,
    gap: 2,
    windows: true,
    windowColors: ["#8f6c8e", "#5e4a78", "#c0848e"],
    windowDensity: 0.08,
    t: reducedMotion ? 0 : t,
    dim: 0.55,
  });

  drawSkyline(ctx, {
    baseY: 208,
    color: "#24142f",
    roofColor: "#190e24",
    seed: 23,
    minH: 48,
    maxH: 132,
    minW: 16,
    maxW: 34,
    gap: 3,
    windows: true,
    windowColors: ["#ffcf87", "#e6a46d", "#91d7d6", "#ff8bc6"],
    windowDensity: 0.19,
    t: reducedMotion ? 0 : t,
    antenna: 0.3,
  });

  drawVerticalNeon(ctx, 128, 111, 54, "#ff6fae", t);
  drawVerticalNeon(ctx, 344, 90, 67, "#65e0e8", t);
  drawVerticalNeon(ctx, 366, 128, 45, "#ffc86b", t);

  drawNeonSign(ctx, {
    x: 292,
    y: 150,
    w: 43,
    h: 10,
    text: "SHINJUKU",
    color: "#ff6fae",
    bg: "#180d20",
    t,
  });
  drawNeonSign(ctx, {
    x: 39,
    y: 164,
    w: 32,
    h: 9,
    text: "SUSHI",
    color: "#68e4db",
    bg: "#10121f",
    t,
  });
  drawNeonSign(ctx, {
    x: 377,
    y: 172,
    w: 38,
    h: 9,
    text: "HOTEL",
    color: "#ffd27d",
    bg: "#1c101b",
    t,
  });
  drawNeonSign(ctx, {
    x: 185,
    y: 126,
    w: 34,
    h: 9,
    text: "LOFI",
    color: "#ff92d0",
    bg: "#160d24",
    t,
  });

  drawTokyoTower(ctx, 255, 202, 67, reducedMotion ? 0 : t);
  drawLanternString(ctx, reducedMotion ? 0 : t, 6, 474, 178, 12);

  ctx.fillStyle = "#1a1224";
  ctx.fillRect(0, 194, W, 3);
  ctx.fillStyle = "#0e0b15";
  ctx.fillRect(0, 197, W, 13);
  for (let x = 0; x < W; x += 24) {
    ctx.fillStyle = "#20172a";
    ctx.fillRect(x + 4, 201, 15, 9);
    ctx.fillStyle = "#0b0910";
    ctx.fillRect(x + 7, 204, 9, 6);
    if (hash01(x * 1.7) > 0.38) {
      ctx.fillStyle = hash01(x * 2.3) > 0.5 ? "#e8a46e" : "#c9829a";
      ctx.globalAlpha = 0.42 + hash01(x * 3.1) * 0.35;
      ctx.fillRect(x + 9, 205, 5, 4);
      ctx.globalAlpha = 1;
    }
  }
  ctx.fillStyle = "#2b2035";
  ctx.fillRect(0, 196, W, 1);

  const trainCycle = mod(reducedMotion ? 12 : t + 4, 34);
  if (trainCycle < 13) {
    drawTrain(ctx, -176 + trainCycle * 54, 183, t);
  }

  // Road and pavements.
  ctx.fillStyle = "#1b1523";
  ctx.fillRect(0, 210, W, 40);
  ctx.fillStyle = "#2a2033";
  ctx.fillRect(0, 210, W, 2);
  ctx.fillStyle = "#0c0911";
  ctx.fillRect(0, 250, W, 20);
  ctx.fillStyle = "#312439";
  ctx.fillRect(0, 250, W, 1);
  ctx.fillStyle = "#0b0910";
  ctx.fillRect(0, 269, W, 1);

  // Wet sheen across the asphalt.
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#c7a0d6";
  ctx.fillRect(0, 214, W, 3);
  ctx.fillRect(0, 239, W, 2);
  ctx.globalAlpha = 1;

  // Crosswalks.
  for (let x = 330; x < 414; x += 14) {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#f2dfc1";
    ctx.fillRect(x, 214, 6, 22);
    ctx.globalAlpha = 1;
  }
  for (let x = 198; x < 290; x += 13) {
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "#f2dfc1";
    ctx.fillRect(x, 214, 5, 20);
    ctx.globalAlpha = 1;
  }

  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#d9c7ab";
  for (let x = 10; x < W; x += 26) {
    ctx.fillRect(x, 231, 12, 1);
  }
  ctx.globalAlpha = 1;

  // Manhole and puddles.
  ctx.fillStyle = "#0d0b12";
  ctx.fillRect(196, 235, 12, 3);
  ctx.fillStyle = "#3b2e43";
  ctx.fillRect(198, 236, 8, 1);
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#7a5f8f";
  ctx.fillRect(92, 224, 18, 2);
  ctx.fillRect(277, 242, 26, 2);
  ctx.globalAlpha = 1;

  drawStreetReflections(
    ctx,
    [
      { x: 259, width: 46, color: "#ff6855", alpha: 0.42 },
      { x: 345, width: 14, color: "#64e0e8", alpha: 0.45 },
      { x: 132, width: 11, color: "#ff6fae", alpha: 0.44 },
      { x: 386, width: 20, color: "#ffd18a", alpha: 0.36 },
      { x: 196, width: 17, color: "#ff92d0", alpha: 0.32 },
      { x: 448, width: 13, color: "#ffd18a", alpha: 0.34 },
    ],
    reducedMotion ? 0 : t,
    211,
    248,
  );

  // Cars on the wet road.
  const car1 = mod(reducedMotion ? 0 : t * 27 + 40, W + 70) - 35;
  const car2 = W - mod(reducedMotion ? 0 : t * 18 + 110, W + 70) + 35;
  drawCar(ctx, car1, 215, "#7c3d5c", 1, true, t);
  drawCar(ctx, car2, 224, "#2b4a63", -1, true, t);
  drawCar(ctx, mod(reducedMotion ? 0 : t * 14 + 260, W + 90) - 45, 238, "#5a445f", 1, true, t);

  // Corner shops sit in front of the road, giving the foreground a warm edge.
  ctx.fillStyle = "#1c1222";
  ctx.fillRect(0, 196, 65, 60);
  ctx.fillRect(W - 70, 196, 70, 60);
  ctx.fillStyle = "#2b192d";
  ctx.fillRect(0, 196, 65, 3);
  ctx.fillRect(W - 70, 196, 70, 3);
  drawNeonSign(ctx, { x: 24, y: 201, w: 30, h: 7, text: "RAMEN", color: "#ffcf82", bg: "#1e1017", t });
  drawNeonSign(ctx, { x: 55, y: 201, w: 14, h: 7, text: "BAR", color: "#ff87c8", bg: "#1e1017", t });
  drawNeonSign(ctx, { x: 414, y: 201, w: 34, h: 7, text: "SUSHI", color: "#8de5df", bg: "#16121d", t });
  ctx.fillStyle = "#d84f5e";
  ctx.fillRect(0, 211, 70, 3);
  ctx.fillRect(W - 78, 211, 78, 3);
  ctx.fillStyle = "#f0c4bd";
  for (let i = 0; i < 7; i += 1) {
    ctx.fillRect(i * 10, 211, 4, 2);
    ctx.fillRect(W - 76 + i * 10, 211, 4, 2);
  }

  for (let i = 0; i < 3; i += 1) {
    const leftX = 6 + i * 20;
    const rightX = W - 66 + i * 20;
    for (const wx of [leftX, rightX]) {
      ctx.fillStyle = "#2a1720";
      ctx.fillRect(wx - 1, 217, 14, 16);
      ctx.globalAlpha = 0.68;
      ctx.fillStyle = i === 1 ? "#ffd9a2" : "#ffc17c";
      ctx.fillRect(wx, 218, 12, 14);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#2a1720";
      ctx.fillRect(wx + 6, 218, 1, 14);
      ctx.fillRect(wx, 224, 12, 1);
      ctx.fillStyle = "#ff9f7a";
      ctx.fillRect(wx + 2, 220, 3, 3);
      ctx.fillRect(wx + 9, 221, 2, 2);
      ctx.fillStyle = "#40202a";
      ctx.fillRect(wx + 2, 226, 2, 4);
      ctx.fillRect(wx + 9, 227, 1, 3);
    }
  }

  ctx.fillStyle = "#ffcf82";
  ctx.globalAlpha = 0.5;
  ctx.fillRect(8, 236, 22, 2);
  ctx.fillRect(W - 58, 236, 24, 2);
  ctx.globalAlpha = 1;

  // A yakitori cart under the viaduct.
  ctx.fillStyle = "#35201e";
  ctx.fillRect(82, 207, 30, 9);
  ctx.fillStyle = "#1a1114";
  ctx.fillRect(86, 216, 4, 3);
  ctx.fillRect(105, 216, 4, 3);
  ctx.fillStyle = "#ffd391";
  ctx.globalAlpha = 0.8;
  ctx.fillRect(90, 199, 4, 7);
  ctx.fillRect(102, 199, 4, 7);
  ctx.globalAlpha = 0.13;
  ctx.fillRect(84, 193, 28, 18);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#b5453f";
  ctx.fillRect(84, 196, 8, 2);
  ctx.fillRect(93, 195, 8, 2);
  ctx.fillStyle = "#e4ddd0";
  ctx.globalAlpha = 0.35;
  ctx.fillRect(88, 187, 4, 5);
  ctx.fillRect(94, 183, 5, 5);
  ctx.fillRect(101, 180, 6, 6);
  ctx.globalAlpha = 1;

  drawStreetLamp(ctx, 286, 216, 41, true, t);
  drawStreetLamp(ctx, 454, 217, 38, true, t);
  drawStreetLamp(ctx, 24, 217, 37, true, t);
  drawStreetLamp(ctx, 414, 216, 39, true, t);

  drawGlow(ctx, 286, 226, 20, 7, "#ffd18a", 0.16, 4);
  drawGlow(ctx, 454, 228, 18, 6, "#ffd18a", 0.14, 6);
  drawGlow(ctx, 24, 228, 17, 6, "#ffd18a", 0.13, 8);
  drawGlow(ctx, 414, 226, 18, 6, "#ffd18a", 0.14, 10);
  drawGlow(ctx, 255, 221, 42, 8, "#ff765f", 0.1, 12);

  // Pedestrian signal at the central crossing.
  ctx.fillStyle = "#110d16";
  ctx.fillRect(306, 198, 2, 18);
  ctx.fillRect(301, 194, 11, 5);
  ctx.fillStyle = "#3d2530";
  ctx.fillRect(302, 195, 9, 3);
  ctx.fillStyle = "#75e59f";
  ctx.globalAlpha = 0.8 + Math.sin(t * 2) * 0.15;
  ctx.fillRect(303, 196, 2, 1);
  ctx.globalAlpha = 1;

  drawPerson(ctx, 70, 204, { coat: "#24172b", umbrella: "#d76f93", walk: 1 });
  drawPerson(ctx, 150, 203, { coat: "#2a2030", umbrella: "#5f9ecc", walk: 0, scale: 0.95 });
  drawPerson(ctx, 207, 203, { coat: "#1d1b2d", umbrella: "#5f9ecc", walk: 0 });
  drawPerson(ctx, 220, 203, { coat: "#322138", umbrella: "#b76e9b", walk: 1, scale: 0.9 });
  drawPerson(ctx, 399, 203, { coat: "#251628", umbrella: "#d7a261", walk: 0 });
  drawPerson(ctx, 430, 204, { coat: "#2b1a25", umbrella: "#9d6fa8", walk: 1, scale: 0.9 });

  // Foreground props: vending machine, plant, cat.
  ctx.fillStyle = "#0f1520";
  ctx.fillRect(8, 244, 15, 24);
  ctx.fillStyle = "#1f4a63";
  ctx.fillRect(9, 245, 13, 22);
  ctx.fillStyle = "#9fe9ff";
  ctx.globalAlpha = 0.85;
  ctx.fillRect(11, 247, 9, 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffcf7a";
  for (let i = 0; i < 3; i += 1) ctx.fillRect(11 + i * 3, 258, 2, 3);
  ctx.fillStyle = "#b8f0ff";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(4, 240, 24, 30);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#0e1814";
  ctx.fillRect(443, 243, 22, 14);
  ctx.fillStyle = "#1f3d2c";
  ctx.fillRect(438, 238, 12, 9);
  ctx.fillRect(452, 235, 12, 12);
  ctx.fillStyle = "#347450";
  ctx.fillRect(440, 236, 4, 2);
  ctx.fillRect(455, 233, 4, 2);

  const catBlink = Math.sin(t * 1.3) > 0.85;
  ctx.fillStyle = "#0b0910";
  ctx.fillRect(424, 259, 9, 6);
  ctx.fillRect(432, 257, 4, 4);
  ctx.fillRect(434, 255, 1, 2);
  ctx.fillRect(431, 255, 1, 2);
  if (!catBlink) {
    ctx.fillStyle = "#ffd37d";
    ctx.fillRect(433, 259, 1, 1);
  }
}

function drawHaussmann(ctx, x, baseY, width, height, t, flip = false) {
  const top = baseY - height;
  ctx.fillStyle = "#241f2c";
  ctx.fillRect(x, top + 9, width, height - 9);
  ctx.fillStyle = "#17161f";
  ctx.beginPath();
  ctx.moveTo(x, top + 10);
  ctx.lineTo(x + width * 0.5, top - 3);
  ctx.lineTo(x + width, top + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2f2a38";
  ctx.fillRect(x + 2, top + 10, width - 4, 2);

  const cols = Math.max(2, Math.floor(width / 11));
  const rows = Math.max(3, Math.floor(height / 12));
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const wx = x + 5 + col * 10;
      const wy = top + 18 + row * 11;
      const lit = hash01(x * 2.3 + row * 9 + col * 17) > 0.5;
      if (lit) {
        ctx.globalAlpha = 0.45 + hash01(row * 4 + col) * 0.45;
        ctx.fillStyle = row === 0 ? "#ffce88" : "#e7ad6f";
        ctx.fillRect(wx, wy, 4, 5);
        ctx.globalAlpha = 0.12;
        ctx.fillRect(wx - 1, wy - 1, 6, 8);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = "#16131d";
        ctx.fillRect(wx, wy, 4, 5);
      }
    }
  }

  ctx.fillStyle = "#241f2c";
  ctx.fillRect(x + 1, top + 8, width - 2, 2);
  if (flip) {
    ctx.fillStyle = "#3d3544";
    ctx.fillRect(x + width - 6, top - 5, 4, 6);
  } else {
    ctx.fillStyle = "#3d3544";
    ctx.fillRect(x + 2, top - 5, 4, 6);
  }

  // Chimney stacks and a dormer give the roof its Paris silhouette.
  const chimneyX = Math.round(x + width * (flip ? 0.26 : 0.68));
  ctx.fillStyle = "#211c29";
  ctx.fillRect(chimneyX, top - 11, 8, 11);
  ctx.fillStyle = "#3a3242";
  ctx.fillRect(chimneyX - 1, top - 12, 10, 2);
  ctx.fillStyle = "#17141d";
  ctx.fillRect(chimneyX + 1, top - 15, 2, 4);
  ctx.fillRect(chimneyX + 5, top - 14, 2, 4);
  const dormerX = Math.round(x + width * (flip ? 0.58 : 0.24));
  ctx.fillStyle = "#17141d";
  ctx.fillRect(dormerX, top + 3, 6, 6);
  ctx.fillStyle = "#ffce88";
  ctx.globalAlpha = 0.42;
  ctx.fillRect(dormerX + 1, top + 4, 4, 4);
  ctx.globalAlpha = 1;
}

function drawEiffelTower(ctx, cx, baseY, topY, t) {
  const shadow = "#6b4326";
  const mid = "#b77a3f";
  const gold = "#e5a756";
  const light = "#ffd08a";
  const bright = "#ffe7b3";
  const lowerTop = 182;
  const platformYs = [182, 150, 122, 95, 72];
  const platformWidths = [25, 14, 10, 6, 4];

  const upperHalf = (y) => {
    const points = [
      [lowerTop, 25],
      [166, 19],
      [150, 14],
      [136, 10],
      [122, 7],
      [104, 5],
      [88, 3.5],
      [topY, 1.2],
    ];
    for (let i = 0; i < points.length - 1; i += 1) {
      const [y0, w0] = points[i];
      const [y1, w1] = points[i + 1];
      if (y <= y0 && y >= y1) {
        return lerp(w0, w1, (y0 - y) / (y0 - y1));
      }
    }
    return 1.2;
  };

  // Warm halo.
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = "#ffc477";
  for (let y = topY; y <= baseY; y += 2) {
    const hw = y >= lowerTop ? lerp(36, 25, (baseY - y) / (baseY - lowerTop)) : upperHalf(y);
    ctx.fillRect(Math.round(cx - hw - 3), y, Math.round(hw * 2 + 6), 1);
  }
  ctx.restore();

  // The two splayed legs and their arch.
  for (let y = lowerTop; y <= baseY; y += 1) {
    const p = (y - lowerTop) / (baseY - lowerTop);
    const outer = lerp(25, 36, p);
    const inner = lerp(11, 13, p);
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = mid;
    ctx.fillRect(Math.round(cx - outer), y, Math.round(outer - inner), 1);
    ctx.fillRect(Math.round(cx + inner), y, Math.round(outer - inner), 1);
    ctx.globalAlpha = 0.96;
    ctx.fillStyle = gold;
    ctx.fillRect(Math.round(cx - outer), y, 1, 1);
    ctx.fillRect(Math.round(cx + outer) - 1, y, 1, 1);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = light;
    ctx.fillRect(Math.round(cx - inner), y, 1, 1);
    ctx.fillRect(Math.round(cx + inner) - 1, y, 1, 1);
    if (y % 5 === 0) {
      ctx.globalAlpha = 0.24;
      line(ctx, cx - outer, y, cx - inner, y + Math.min(5, baseY - y), light);
      line(ctx, cx + outer, y, cx + inner, y + Math.min(5, baseY - y), light);
    }
  }
  ctx.globalAlpha = 1;

  // The arch between the legs.
  ctx.save();
  ctx.globalAlpha = 0.65;
  const archSteps = 26;
  for (let i = 0; i <= archSteps; i += 1) {
    const p = i / archSteps;
    const x = lerp(cx - 13, cx + 13, p);
    const y = baseY - Math.sin(Math.PI * p) * 18;
    ctx.fillStyle = bright;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  ctx.restore();

  // Upper lattice body: translucent mass, bright edges and cross bracing.
  for (let y = topY; y <= lowerTop; y += 1) {
    const hw = upperHalf(y);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = mid;
    ctx.fillRect(Math.round(cx - hw), y, Math.max(1, Math.round(hw * 2)), 1);
    if (y % 5 === 0) {
      ctx.globalAlpha = 0.48;
      ctx.fillStyle = light;
      ctx.fillRect(Math.round(cx - hw), y, Math.max(1, Math.round(hw * 2)), 1);
    }
    ctx.globalAlpha = 0.94;
    ctx.fillStyle = y < 100 ? bright : gold;
    ctx.fillRect(Math.round(cx - hw), y, 1, 1);
    ctx.fillRect(Math.round(cx + hw) - 1, y, 1, 1);
  }

  for (let y = topY; y < lowerTop; y += 8) {
    const hw0 = upperHalf(y);
    const hw1 = upperHalf(Math.min(lowerTop, y + 8));
    ctx.globalAlpha = 0.26;
    line(ctx, cx - hw0, y, cx + hw1, y + 8, light);
    line(ctx, cx + hw0, y, cx - hw1, y + 8, gold);
  }
  ctx.globalAlpha = 1;

  platformYs.forEach((y, index) => {
    const half = platformWidths[index];
    ctx.fillStyle = index === 0 ? bright : light;
    ctx.fillRect(Math.round(cx - half), y, Math.round(half * 2), 1);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = shadow;
    ctx.fillRect(Math.round(cx - half), y + 1, Math.round(half * 2), 1);
    ctx.globalAlpha = 1;
    if (index === 0) {
      ctx.fillStyle = gold;
      ctx.fillRect(Math.round(cx - half - 3), y - 1, Math.round(half * 2 + 6), 1);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = shadow;
      for (let x = -half; x < half; x += 4) {
        ctx.fillRect(Math.round(cx + x), y + 2, 2, 2);
      }
      ctx.globalAlpha = 1;
    }
  });

  // Antenna and beacon.
  ctx.fillStyle = shadow;
  ctx.fillRect(cx - 1, topY - 12, 2, 12);
  ctx.fillStyle = bright;
  const pulse = 0.45 + 0.55 * Math.abs(Math.sin(t * 1.7));
  ctx.globalAlpha = pulse;
  ctx.fillRect(cx - 1, topY - 15, 2, 2);
  ctx.globalAlpha = 1;

  const sparklePhase = mod(t, 9.5);
  if (sparklePhase < 2.1) {
    const random = mulberry32(88);
    for (let i = 0; i < 60; i += 1) {
      const y = topY + random() * (baseY - topY);
      const hw = y >= lowerTop
        ? lerp(46, 14, (baseY - y) / (baseY - lowerTop))
        : upperHalf(y);
      const x = cx + (random() * 2 - 1) * hw;
      if (random() > 0.22) {
        ctx.globalAlpha = 0.45 + random() * 0.55;
        ctx.fillStyle = random() > 0.5 ? "#fff7db" : "#ffd797";
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  if (Math.sin(t * 0.23) > 0.84) {
    ctx.save();
    ctx.globalAlpha = 0.075;
    ctx.fillStyle = "#ffe7b6";
    const beamY = 86 + Math.sin(t * 0.5) * 5;
    line(ctx, cx, topY - 12, W, beamY, "#ffe7b6");
    line(ctx, cx, topY - 12, 0, beamY + 8, "#ffe7b6");
    ctx.restore();
  }
}

function drawParisBridge(ctx, t) {
  const deckY = 213;
  ctx.fillStyle = "#262a39";
  ctx.fillRect(302, deckY, W - 302, 6);
  ctx.fillStyle = "#393d4d";
  ctx.fillRect(302, deckY, W - 302, 1);
  ctx.fillStyle = "#171b27";
  ctx.fillRect(302, deckY + 6, W - 302, 2);

  // Three stone arches over the water.
  for (let index = 0; index < 3; index += 1) {
    const cx = 332 + index * 54;
    ctx.fillStyle = "#1d2130";
    ctx.fillRect(cx - 18, deckY + 7, 36, 11);
    for (let i = 0; i < 6; i += 1) {
      const w = 26 - i * 4;
      ctx.fillRect(cx - w / 2, deckY + 7 + i, w, 1);
    }
    ctx.fillStyle = "#0b1019";
    for (let i = 0; i < 7; i += 1) {
      const w = 20 - i * 3;
      ctx.fillRect(cx - w / 2, deckY + 9 + i, w, 1);
    }
  }

  // Balustrade and lamps.
  ctx.fillStyle = "#454959";
  ctx.fillRect(302, deckY - 3, W - 302, 1);
  for (let x = 306; x < W; x += 7) {
    ctx.fillRect(x, deckY - 2, 1, 2);
  }
  for (let x = 322; x < W; x += 48) {
    ctx.fillStyle = "#202432";
    ctx.fillRect(x, deckY - 15, 1, 12);
    ctx.fillStyle = "#ffd18a";
    ctx.fillRect(x - 1, deckY - 17, 3, 3);
    ctx.globalAlpha = 0.16 + Math.abs(Math.sin(t * 1.6 + x)) * 0.04;
    ctx.fillRect(x - 5, deckY - 22, 11, 12);
    ctx.globalAlpha = 1;
  }
}

function drawNotreDame(ctx) {
  const x = 112;
  const baseY = 199;
  ctx.fillStyle = "#202738";
  ctx.fillRect(x, 178, 11, 21);
  ctx.fillRect(x + 14, 176, 11, 23);
  ctx.fillRect(x + 2, 170, 7, 8);
  ctx.fillRect(x + 16, 168, 7, 8);

  ctx.beginPath();
  ctx.moveTo(x + 2, 170);
  ctx.lineTo(x + 5.5, 163);
  ctx.lineTo(x + 9, 170);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 16, 168);
  ctx.lineTo(x + 19.5, 161);
  ctx.lineTo(x + 23, 168);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#161d2b";
  for (let i = 0; i < 2; i += 1) {
    ctx.fillRect(x + 3 + i * 5, 182, 2, 4);
    ctx.fillRect(x + 17 + i * 5, 180, 2, 5);
  }
  ctx.fillStyle = "#e8ae6d";
  ctx.globalAlpha = 0.55;
  ctx.fillRect(x + 4, 182, 1, 2);
  ctx.fillRect(x + 18, 180, 1, 2);
  ctx.fillRect(x + 21, 184, 1, 2);
  ctx.globalAlpha = 1;

  // A small rose window.
  ctx.fillStyle = "#b37f57";
  ctx.fillRect(x + 11, 180, 3, 3);
  ctx.fillStyle = "#e5b16c";
  ctx.fillRect(x + 12, 181, 1, 1);
}

function drawTree(ctx, x, baseY, height, seed, color, light) {
  const random = mulberry32(seed);
  ctx.fillStyle = "#141220";
  ctx.fillRect(x + 5, baseY - height * 0.55, 3, height * 0.55);
  for (let i = 0; i < 11; i += 1) {
    const w = 16 + random() * 34;
    const h = 8 + random() * 18;
    const cx = x + 6 + (random() * 2 - 1) * 20;
    const cy = baseY - height * (0.35 + random() * 0.6);
    ctx.globalAlpha = 0.72 + random() * 0.28;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(cx - w / 2), Math.round(cy - h / 2), Math.round(w), Math.round(h));
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = light;
    for (let j = 0; j < 9; j += 1) {
      ctx.fillRect(
        Math.round(cx - w / 2 + random() * w),
        Math.round(cy - h / 2 + random() * h),
        2,
        1,
      );
    }
    ctx.globalAlpha = 1;
  }
}

function drawParis(ctx, t, weather, reducedMotion) {
  ctx.drawImage(getSky("paris"), 0, 0);
  drawStars(ctx, reducedMotion ? 0 : t, { seed: 71, count: 55, maxY: 150, color: "#f7e3c6" });
  drawCloudBand(ctx, t, { seed: 5, y: 42, color: "#283a55", alpha: 0.55, height: 4, spread: 28 });
  drawCloudBand(ctx, t, { seed: 15, y: 88, color: "#465568", alpha: 0.42, height: 3, spread: 18 });
  drawMoon(ctx, 398, 50, 12, { color: "#f6e3c6", shade: "#d8c1a4" });

  drawSkyline(ctx, {
    baseY: 200,
    color: "#1a2336",
    roofColor: "#151c2b",
    seed: 12,
    minH: 18,
    maxH: 56,
    minW: 12,
    maxW: 28,
    gap: 3,
    windows: true,
    windowColors: ["#c89c69", "#a48359", "#8290a1"],
    windowDensity: 0.09,
    t: reducedMotion ? 0 : t,
    dim: 0.55,
  });

  // Sacré-Cœur on the left hill.
  ctx.fillStyle = "#11192a";
  ctx.beginPath();
  ctx.moveTo(0, 196);
  ctx.lineTo(20, 184);
  ctx.lineTo(48, 176);
  ctx.lineTo(80, 189);
  ctx.lineTo(108, 196);
  ctx.lineTo(0, 198);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d7d2c8";
  ctx.fillRect(34, 164, 18, 14);
  ctx.fillRect(38, 159, 10, 6);
  ctx.fillRect(42, 154, 2, 6);
  ctx.fillStyle = "#8c8a8b";
  ctx.fillRect(34, 174, 18, 3);
  ctx.fillStyle = "#d7d2c8";
  ctx.fillRect(30, 170, 4, 9);
  ctx.fillRect(52, 170, 4, 9);
  ctx.fillStyle = "#f4d89d";
  ctx.fillRect(40, 170, 2, 3);

  drawHaussmann(ctx, -6, 204, 92, 68, t);
  drawHaussmann(ctx, 392, 204, 96, 72, t, true);

  drawSkyline(ctx, {
    baseY: 204,
    color: "#2a2b3c",
    roofColor: "#202030",
    seed: 44,
    minH: 28,
    maxH: 58,
    minW: 14,
    maxW: 26,
    gap: 1,
    windows: true,
    windowColors: ["#f2be7b", "#e3a766", "#d7955b"],
    windowDensity: 0.2,
    t: reducedMotion ? 0 : t,
    minX: 84,
    maxX: 400,
    antenna: 0.12,
  });

  drawNotreDame(ctx);
  drawTree(ctx, -18, 203, 40, 3, "#15211b", "#2b4431");
  drawTree(ctx, 442, 203, 42, 8, "#15211b", "#2b4431");

  drawEiffelTower(ctx, 252, 200, 62, reducedMotion ? 0 : t);

  // Quay and river.
  ctx.fillStyle = "#1b1c2b";
  ctx.fillRect(0, 201, W, 15);
  ctx.fillStyle = "#302c3b";
  ctx.fillRect(0, 214, W, 2);
  ctx.fillStyle = "#0b111a";
  ctx.fillRect(0, 216, W, 54);

  drawWater(ctx, {
    y: 216,
    t: reducedMotion ? 0 : t,
    topColor: "#0d1724",
    bottomColor: "#060a11",
    waveColor: "#274058",
    reflections: [
      { x: 252, width: 54, color: "#f3c37b", alpha: 0.58 },
      { x: 120, width: 12, color: "#ffd89d", alpha: 0.3 },
      { x: 388, width: 12, color: "#ffd89d", alpha: 0.28 },
      { x: 58, width: 9, color: "#d7b279", alpha: 0.24 },
    ],
  });

  drawParisBridge(ctx, reducedMotion ? 0 : t);

  drawStreetLamp(ctx, 124, 203, 33, true, t);
  drawStreetLamp(ctx, 384, 203, 33, true, t);
  drawStreetLamp(ctx, 58, 204, 28, true, t);
  drawStreetLamp(ctx, 452, 204, 28, true, t);
  drawStreetLamp(ctx, 300, 202, 31, true, t);

  drawGlow(ctx, 124, 204, 18, 6, "#ffd18a", 0.15, 2);
  drawGlow(ctx, 384, 204, 18, 6, "#ffd18a", 0.15, 5);
  drawGlow(ctx, 58, 205, 15, 5, "#ffd18a", 0.12, 7);
  drawGlow(ctx, 452, 205, 15, 5, "#ffd18a", 0.12, 9);
  drawGlow(ctx, 300, 203, 16, 5, "#ffd18a", 0.13, 11);
  drawGlow(ctx, 252, 219, 44, 9, "#f3c37b", 0.16, 13);

  // Warm pools on the quay.
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffd08a";
  ctx.fillRect(112, 201, 24, 2);
  ctx.fillRect(372, 201, 24, 2);
  ctx.fillRect(290, 200, 20, 2);
  ctx.globalAlpha = 1;

  drawPerson(ctx, 116, 194, { coat: "#1b1a26", umbrella: null, walk: 0 });
  drawPerson(ctx, 126, 194, { coat: "#2c2230", umbrella: null, walk: 1, scale: 0.92 });
  drawPerson(ctx, 340, 194, { coat: "#1c202d", umbrella: null, walk: 0 });
  drawPerson(ctx, 350, 194, { coat: "#2b2130", umbrella: null, walk: 1, scale: 0.9 });

  // A bateau mouche drifting by.
  const boatX = mod(reducedMotion ? 60 : t * 3.2 + 90, W + 130) - 60;
  ctx.fillStyle = "#101722";
  ctx.fillRect(Math.round(boatX), 229, 58, 8);
  ctx.fillRect(Math.round(boatX) + 4, 223, 48, 6);
  ctx.fillStyle = "#283244";
  ctx.fillRect(Math.round(boatX) + 4, 222, 48, 2);
  ctx.fillStyle = "#ffd18a";
  for (let i = 0; i < 8; i += 1) {
    ctx.fillRect(Math.round(boatX) + 7 + i * 6, 225, 4, 2);
  }
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ffd18a";
  ctx.fillRect(Math.round(boatX) + 4, 227, 52, 3);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#2e4054";
  ctx.fillRect(Math.round(boatX) - 4, 236, 68, 1);

  // Warm café light at the edge of the frame.
  ctx.fillStyle = "#1b1520";
  ctx.fillRect(0, 184, 24, 26);
  ctx.fillStyle = "#ffd08b";
  ctx.globalAlpha = 0.65;
  ctx.fillRect(6, 190, 10, 8);
  ctx.globalAlpha = 1;

  drawFog(ctx, reducedMotion ? 0 : t, { y: 204, alpha: 0.05, height: 12, color: "#f0c49b" });
}

function drawEmpireState(ctx, cx, baseY, topY, t) {
  const body = "#232b3b";
  const lit = "#ffd48d";
  const glow = "#8ecdf7";
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 35, topY, 70, baseY - topY);
  ctx.restore();

  ctx.fillStyle = body;
  ctx.fillRect(cx - 20, baseY - 92, 40, 92);
  ctx.fillRect(cx - 15, baseY - 116, 30, 24);
  ctx.fillRect(cx - 10, baseY - 132, 20, 16);
  ctx.fillRect(cx - 5, baseY - 144, 10, 12);
  ctx.fillRect(cx - 2, topY + 18, 4, 12);
  ctx.fillRect(cx - 1, topY, 2, 18);

  ctx.fillStyle = "#3d4659";
  ctx.fillRect(cx - 22, baseY - 94, 44, 3);
  ctx.fillRect(cx - 17, baseY - 118, 34, 2);
  ctx.fillRect(cx - 12, baseY - 134, 24, 2);
  ctx.fillStyle = "#f2bd75";
  ctx.globalAlpha = 0.5;
  ctx.fillRect(cx - 9, baseY - 130, 18, 1);
  ctx.fillRect(cx - 4, baseY - 142, 8, 1);
  ctx.globalAlpha = 1;

  for (let row = 0; row < 22; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const x = cx - 17 + col * 5;
      const y = baseY - 88 + row * 4;
      if (hash01(cx + row * 8 + col * 11) > 0.38) {
        ctx.globalAlpha = 0.35 + hash01(row * 3 + col) * 0.55;
        ctx.fillStyle = lit;
        ctx.fillRect(x, y, 2, 1);
      }
    }
  }
  ctx.globalAlpha = 1;

  const blink = Math.sin(t * 2.2) > 0.55;
  ctx.fillStyle = blink ? "#ff6d79" : "#7a3545";
  ctx.fillRect(cx - 1, topY - 2, 2, 2);
  ctx.globalAlpha = blink ? 0.22 : 0;
  ctx.fillStyle = "#ff6d79";
  ctx.fillRect(cx - 5, topY - 6, 10, 8);
  ctx.globalAlpha = 1;
}

function drawBridgeTower(ctx, cx, baseY, topY, width, t) {
  const stone = "#2b3040";
  const lightStone = "#3c4254";
  const dark = "#0b101b";
  const h = baseY - topY;

  ctx.fillStyle = stone;
  for (let y = topY; y <= baseY; y += 1) {
    const p = (y - topY) / h;
    const half = Math.round(lerp(width * 0.34, width * 0.62, p));
    ctx.fillRect(cx - half, y, half * 2, 1);
  }

  ctx.fillStyle = lightStone;
  ctx.fillRect(cx - width * 0.4, topY, width * 0.8, 3);
  ctx.fillRect(cx - width * 0.5, topY + 5, width, 2);
  ctx.fillRect(cx - width * 0.55, topY + 12, width * 1.1, 1);
  ctx.fillStyle = "#d7dee8";
  ctx.fillRect(cx - width * 0.4, topY - 1, width * 0.8, 1);

  // Two gothic openings.
  const archTop = topY + 30;
  const archBottom = baseY - 10;
  for (const offset of [-width * 0.24, width * 0.24]) {
    const aw = Math.round(width * 0.18);
    const ax = Math.round(cx + offset - aw / 2);
    ctx.fillStyle = dark;
    ctx.fillRect(ax, archTop + 8, aw, archBottom - archTop - 8);
    for (let i = 0; i < 7; i += 1) {
      const w = Math.max(1, aw - i * 2);
      ctx.fillRect(Math.round(cx + offset - w / 2), archTop + i, w, 1);
    }
  }

  // Stone courses.
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = lightStone;
  for (let y = topY + 22; y < baseY; y += 12) {
    ctx.fillRect(cx - width * 0.56, y, width * 1.12, 1);
  }
  ctx.globalAlpha = 1;

  const lightPulse = 0.55 + Math.sin(t * 2 + cx) * 0.2;
  ctx.globalAlpha = lightPulse;
  ctx.fillStyle = "#ffd18a";
  ctx.fillRect(cx - 1, topY + 8, 2, 1);
  ctx.globalAlpha = 1;
}

function drawBrooklynBridge(ctx, t, reducedMotion) {
  const deckY = 207;
  const leftX = 112;
  const rightX = 372;
  const towerTop = 97;
  const towerBase = 217;
  const towerWidth = 38;

  // Diagonal stays, Brooklyn Bridge's signature fan. Drawn under the towers so
  // the stonework stays legible.
  ctx.globalAlpha = 0.17;
  for (let i = 0; i < 9; i += 1) {
    const y = towerTop + 9 + i * 4;
    const spread = 34 + i * 15;
    line(ctx, leftX, y, Math.max(0, leftX - spread), deckY, "#9fb6cd");
    line(ctx, leftX, y, leftX + spread, deckY, "#9fb6cd");
    line(ctx, rightX, y, rightX - spread, deckY, "#9fb6cd");
    line(ctx, rightX, y, Math.min(W, rightX + spread), deckY, "#9fb6cd");
  }
  ctx.globalAlpha = 1;

  drawBridgeTower(ctx, leftX, towerBase, towerTop, towerWidth, t);
  drawBridgeTower(ctx, rightX, towerBase, towerTop, towerWidth, t);

  // Main cables.
  const cableColor = "rgba(14, 20, 32, .95)";
  const cableLight = "rgba(154, 181, 209, .32)";
  catenary(ctx, -10, 154, leftX, towerTop + 2, 24, cableColor, 30);
  catenary(ctx, leftX, towerTop + 2, rightX, towerTop + 2, 60, cableColor, 48);
  catenary(ctx, rightX, towerTop + 2, W + 10, 154, 24, cableColor, 30);
  catenary(ctx, -10, 153, leftX, towerTop + 1, 24, cableLight, 30);
  catenary(ctx, leftX, towerTop + 1, rightX, towerTop + 1, 59, cableLight, 48);
  catenary(ctx, rightX, towerTop + 1, W + 10, 153, 24, cableLight, 30);

  // Vertical suspenders.
  for (let x = 0; x <= W; x += 9) {
    let cableY;
    if (x < leftX) {
      const p = (x + 10) / (leftX + 10);
      cableY = lerp(154, towerTop + 2, p) + Math.sin(Math.PI * p) * 24;
    } else if (x <= rightX) {
      const p = (x - leftX) / (rightX - leftX);
      cableY = towerTop + 2 + Math.sin(Math.PI * p) * 60;
    } else {
      const p = (x - rightX) / (W + 10 - rightX);
      cableY = towerTop + 2 + Math.sin(Math.PI * p) * 24;
    }
    if (cableY < deckY - 2) {
      ctx.globalAlpha = 0.42;
      line(ctx, x, cableY, x, deckY, "rgba(122, 148, 178, .7)");
      ctx.globalAlpha = 1;
    }
  }

  // Deck.
  ctx.fillStyle = "#202634";
  ctx.fillRect(0, deckY, W, 11);
  ctx.fillStyle = "#3b4351";
  ctx.fillRect(0, deckY, W, 2);
  ctx.fillStyle = "#0e131d";
  ctx.fillRect(0, deckY + 9, W, 4);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#ffe0a2";
  for (let x = 8; x < W; x += 22) {
    ctx.fillRect(x, deckY + 3, 2, 1);
  }
  ctx.globalAlpha = 1;

  const carX = mod(reducedMotion ? 80 : t * 17 + 40, W + 80) - 40;
  drawCar(ctx, carX, deckY - 5, "#344054", 1, true, t);
  const carX2 = W - mod(reducedMotion ? 40 : t * 12 + 200, W + 80) + 40;
  drawCar(ctx, carX2, deckY - 5, "#4b3e4b", -1, true, t);

  // Water below.
  drawWater(ctx, {
    y: 221,
    t: reducedMotion ? 0 : t,
    topColor: "#0a1420",
    bottomColor: "#050a11",
    waveColor: "#284257",
    reflections: [
      { x: 252, width: 50, color: "#ffd08b", alpha: 0.28 },
      { x: 118, width: 18, color: "#9fc2dd", alpha: 0.22 },
      { x: 372, width: 18, color: "#9fc2dd", alpha: 0.2 },
      { x: 318, width: 12, color: "#e9b57a", alpha: 0.17 },
    ],
    fog: 0.07,
  });

  // Snowy promenade in the foreground.
  ctx.fillStyle = "#121722";
  ctx.fillRect(0, 247, W, 23);
  ctx.fillStyle = "#252c39";
  ctx.fillRect(0, 247, W, 2);
  ctx.fillStyle = "rgba(215, 224, 232, .55)";
  ctx.fillRect(0, 248, W, 1);
  ctx.fillStyle = "rgba(225, 233, 240, .35)";
  for (let x = 0; x < W; x += 3) {
    if (hash01(x) > 0.45) ctx.fillRect(x, 251 + Math.round(hash01(x * 2) * 4), 2, 1);
  }

  // Railing.
  ctx.fillStyle = "#0d121a";
  ctx.fillRect(0, 243, W, 2);
  for (let x = 6; x < W; x += 22) {
    ctx.fillRect(x, 236, 2, 13);
  }
  ctx.fillStyle = "#4a5565";
  ctx.fillRect(0, 240, W, 1);

  // Bench and lamp on the promenade.
  ctx.fillStyle = "#171d28";
  ctx.fillRect(420, 254, 30, 4);
  ctx.fillRect(422, 258, 3, 6);
  ctx.fillRect(444, 258, 3, 6);
  ctx.fillRect(420, 251, 30, 2);
  ctx.fillStyle = "#283140";
  ctx.fillRect(8, 246, 2, 24);
  ctx.fillRect(3, 245, 12, 2);
  ctx.fillStyle = "#ffd08a";
  ctx.fillRect(5, 247, 8, 3);
  ctx.globalAlpha = 0.16;
  ctx.fillRect(-1, 240, 22, 16);
  ctx.globalAlpha = 1;

  // Snow caps on the bridge towers and cables.
  ctx.fillStyle = "rgba(238, 244, 250, .75)";
  ctx.fillRect(leftX - towerWidth * 0.4, towerTop - 2, towerWidth * 0.8, 1);
  ctx.fillRect(rightX - towerWidth * 0.4, towerTop - 2, towerWidth * 0.8, 1);
  ctx.fillRect(leftX - towerWidth * 0.5, towerTop + 4, towerWidth, 1);
  ctx.fillRect(rightX - towerWidth * 0.5, towerTop + 4, towerWidth, 1);
  ctx.globalAlpha = 0.4;
  for (let x = 10; x < W; x += 13) {
    ctx.fillRect(x, 239, 1, 1);
  }
  ctx.globalAlpha = 1;

  drawFog(ctx, reducedMotion ? 0 : t, { y: 214, alpha: 0.07, height: 18, color: "#b7c9d8" });
}

function drawNewYork(ctx, t, weather, reducedMotion) {
  ctx.drawImage(getSky("new-york"), 0, 0);
  drawStars(ctx, reducedMotion ? 0 : t, { seed: 55, count: 30, maxY: 130, color: "#dfeaf5" });
  drawCloudBand(ctx, t, { seed: 8, y: 26, color: "#263646", alpha: 0.8, height: 7, spread: 34 });
  drawCloudBand(ctx, t, { seed: 18, y: 64, color: "#34495c", alpha: 0.6, height: 5, spread: 28 });
  drawGlow(ctx, 280, 195, 210, 30, "#d3ab7a", 0.055, 15);

  drawSkyline(ctx, {
    baseY: 201,
    color: "#121a28",
    roofColor: "#0c131e",
    seed: 63,
    minH: 25,
    maxH: 70,
    minW: 10,
    maxW: 24,
    gap: 2,
    windows: true,
    windowColors: ["#c2a478", "#9a8a72", "#b8c7d6"],
    windowDensity: 0.14,
    t: reducedMotion ? 0 : t,
    dim: 0.5,
  });

  drawSkyline(ctx, {
    baseY: 207,
    color: "#1c2636",
    roofColor: "#141c28",
    seed: 36,
    minH: 38,
    maxH: 104,
    minW: 14,
    maxW: 32,
    gap: 3,
    windows: true,
    windowColors: ["#ffcf8e", "#e0a96e", "#9ec9e2"],
    windowDensity: 0.24,
    t: reducedMotion ? 0 : t,
    antenna: 0.18,
  });

  drawEmpireState(ctx, 286, 207, 67, reducedMotion ? 0 : t);

  drawNeonSign(ctx, { x: 35, y: 164, w: 40, h: 9, text: "BROOKLYN", color: "#8ecdf7", bg: "#111925", t });
  drawNeonSign(ctx, { x: 406, y: 172, w: 36, h: 9, text: "DELI", color: "#ffd18a", bg: "#17151b", t });

  drawBrooklynBridge(ctx, reducedMotion ? 0 : t, reducedMotion);
}

function drawLondonEye(ctx, cx, cy, r, t) {
  const ring = "rgba(190, 222, 247, .8)";
  const bright = "#e6f5ff";
  drawGlow(ctx, cx, cy, r + 16, r + 14, "#9ad9ff", 0.08, 21);

  ctx.save();
  ctx.globalAlpha = 0.35;
  line(ctx, cx, cy, cx - 24, 216, "#6d8da2");
  line(ctx, cx, cy, cx + 24, 216, "#6d8da2");
  line(ctx, cx, cy, cx, 216, "#6d8da2");

  for (let index = 0; index < 140; index += 1) {
    const angle = (index / 140) * Math.PI * 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    ctx.globalAlpha = 0.55 + hash01(index * 3.7) * 0.4;
    ctx.fillStyle = ring;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  ctx.globalAlpha = 0.14;
  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2;
    line(ctx, cx, cy, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, bright);
  }

  ctx.globalAlpha = 0.32;
  for (let index = 0; index < 80; index += 1) {
    const angle = (index / 80) * Math.PI * 2;
    ctx.fillStyle = "#bfe5ff";
    ctx.fillRect(
      Math.round(cx + Math.cos(angle) * (r - 3)),
      Math.round(cy + Math.sin(angle) * (r - 3)),
      1,
      1,
    );
  }

  for (let index = 0; index < 18; index += 1) {
    const angle = t * 0.045 + (index / 18) * Math.PI * 2;
    const x = cx + Math.cos(angle) * (r + 1);
    const y = cy + Math.sin(angle) * (r + 1);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = index % 3 === 0 ? "#ffdc9a" : "#d8f1ff";
    ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 2);
  }

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#e8f8ff";
  ctx.fillRect(cx - 2, cy - 2, 5, 5);
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#bfe9ff";
  ctx.fillRect(cx - 9, cy - 9, 19, 19);
  ctx.restore();
}

function drawBigBen(ctx, cx, baseY, t) {
  const stone = "#2a2e39";
  const stoneLight = "#424957";
  const gold = "#e3b76f";
  const pale = "#f8e9bd";

  // Parliament silhouette.
  ctx.fillStyle = "#1a202b";
  ctx.fillRect(cx - 104, baseY - 42, 94, 42);
  ctx.fillStyle = "#202633";
  for (let x = cx - 104; x < cx - 14; x += 12) {
    ctx.fillRect(x, baseY - 48, 5, 8);
    ctx.fillRect(x + 1, baseY - 52, 3, 4);
  }
  ctx.fillStyle = "#343b49";
  ctx.fillRect(cx - 104, baseY - 44, 94, 2);
  for (let x = cx - 98; x < cx - 18; x += 9) {
    ctx.globalAlpha = 0.5 + hash01(x * 1.7) * 0.4;
    ctx.fillStyle = hash01(x * 3.3) > 0.45 ? "#e4b572" : "#8aa4b6";
    ctx.fillRect(x, baseY - 35, 3, 7);
    ctx.globalAlpha = 1;
  }

  // Elizabeth Tower.
  const top = baseY - 118;
  ctx.fillStyle = stone;
  ctx.fillRect(cx - 11, top, 22, 118);
  ctx.fillStyle = stoneLight;
  ctx.fillRect(cx - 11, top, 2, 118);
  ctx.fillRect(cx + 9, top, 2, 118);
  ctx.fillRect(cx - 8, baseY - 28, 16, 2);

  // Clock face.
  const clockY = baseY - 98;
  ctx.fillStyle = gold;
  ctx.fillRect(cx - 8, clockY - 1, 16, 15);
  ctx.fillStyle = pale;
  ctx.fillRect(cx - 6, clockY + 1, 12, 11);
  ctx.fillStyle = "#3e3527";
  ctx.fillRect(cx - 1, clockY + 3, 1, 5);
  ctx.fillRect(cx + 1, clockY + 6, 4, 1);
  ctx.fillStyle = gold;
  ctx.fillRect(cx - 1, clockY + 7, 2, 2);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffd791";
  ctx.fillRect(cx - 13, clockY - 6, 26, 25);
  ctx.globalAlpha = 1;

  // Roof and spire.
  for (let index = 0; index < 12; index += 1) {
    const width = Math.max(2, 22 - index * 1.7);
    ctx.fillStyle = index % 3 === 0 ? "#4b5260" : "#343a46";
    ctx.fillRect(Math.round(cx - width / 2), top - index, Math.round(width), 1);
  }
  ctx.fillStyle = gold;
  ctx.fillRect(cx - 1, top - 20, 2, 10);
  ctx.fillStyle = "#ffe7a8";
  if (Math.sin(t * 2.1) > 0.35) ctx.fillRect(cx - 1, top - 21, 2, 1);

  // Windows and warm faces.
  for (let index = 0; index < 3; index += 1) {
    ctx.fillStyle = "#ffdc9a";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(cx - 6 + index * 5, clockY + 20, 3, 10);
    ctx.globalAlpha = 0.28;
    ctx.fillRect(cx - 5 + index * 5, baseY - 36, 2, 6);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#d7a95f";
  ctx.fillRect(cx - 12, baseY - 4, 24, 2);
}

function drawLondon(ctx, t, weather, reducedMotion) {
  ctx.drawImage(getSky("london"), 0, 0);
  drawStars(ctx, reducedMotion ? 0 : t, { seed: 117, count: 23, maxY: 125, color: "#e9eff5" });
  drawCloudBand(ctx, t, { seed: 44, y: 30, color: "#2b3b48", alpha: 0.7, height: 5, spread: 24 });
  drawCloudBand(ctx, t, { seed: 91, y: 78, color: "#40515e", alpha: 0.52, height: 4, spread: 18 });
  drawMoon(ctx, 394, 52, 9, { color: "#e9e2d1", shade: "#bfc0bb", halo: false });

  drawSkyline(ctx, {
    baseY: 202,
    color: "#111a25",
    roofColor: "#0c141c",
    seed: 57,
    minH: 16,
    maxH: 52,
    minW: 10,
    maxW: 24,
    gap: 3,
    windows: true,
    windowColors: ["#ac9066", "#6e8797", "#d6b47b"],
    windowDensity: 0.09,
    t: reducedMotion ? 0 : t,
    dim: 0.55,
  });

  // The Shard and a few distant towers.
  ctx.fillStyle = "#171f2b";
  ctx.beginPath();
  ctx.moveTo(50, 204);
  ctx.lineTo(60, 66);
  ctx.lineTo(68, 204);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.3;
  for (let y = 130; y < 200; y += 7) ctx.fillRect(59, y, 2, 2);
  ctx.globalAlpha = 1;

  drawLondonEye(ctx, 101, 150, 38, reducedMotion ? 0 : t);
  drawBigBen(ctx, 274, 204, reducedMotion ? 0 : t);

  drawSkyline(ctx, {
    baseY: 205,
    color: "#1d2430",
    roofColor: "#151b24",
    seed: 73,
    minH: 30,
    maxH: 72,
    minW: 14,
    maxW: 28,
    gap: 2,
    windows: true,
    windowColors: ["#e4b572", "#8fa7b7"],
    windowDensity: 0.14,
    t: reducedMotion ? 0 : t,
    minX: 300,
    maxX: W + 8,
    antenna: 0.1,
  });

  // Embankment and river.
  ctx.fillStyle = "#17202a";
  ctx.fillRect(0, 201, W, 17);
  ctx.fillStyle = "#343b45";
  ctx.fillRect(0, 216, W, 2);
  ctx.fillStyle = "#08111a";
  ctx.fillRect(0, 218, W, 52);

  drawWater(ctx, {
    y: 218,
    t: reducedMotion ? 0 : t,
    topColor: "#0a1721",
    bottomColor: "#050b12",
    waveColor: "#294454",
    reflections: [
      { x: 274, width: 34, color: "#eec078", alpha: 0.46 },
      { x: 101, width: 20, color: "#b9e1ff", alpha: 0.3 },
      { x: 402, width: 12, color: "#f2c37a", alpha: 0.25 },
    ],
    fog: 0.045,
  });

  drawGlow(ctx, 274, 219, 32, 8, "#eec078", 0.15, 17);
  drawGlow(ctx, 30, 205, 18, 6, "#ffd28a", 0.12, 19);
  drawGlow(ctx, 163, 205, 16, 5, "#ffd28a", 0.12, 23);

  drawStreetLamp(ctx, 30, 207, 31, true, t);
  drawStreetLamp(ctx, 163, 207, 29, true, t);
  drawStreetLamp(ctx, 422, 207, 30, true, t);

  // Red bus and a black cab on the embankment.
  const busX = mod(reducedMotion ? 40 : t * 7 + 140, W + 100) - 40;
  ctx.fillStyle = "#ad2d37";
  ctx.fillRect(busX, 192, 28, 12);
  ctx.fillStyle = "#d95056";
  ctx.fillRect(busX, 192, 28, 2);
  ctx.fillStyle = "#f4d29a";
  for (let index = 0; index < 5; index += 1) {
    ctx.fillRect(busX + 4 + index * 5, 196, 3, 4);
  }
  ctx.fillStyle = "#10131a";
  ctx.fillRect(busX + 4, 203, 4, 3);
  ctx.fillRect(busX + 20, 203, 4, 3);
  drawCar(ctx, mod(reducedMotion ? 200 : t * 11 + 280, W + 80) - 40, 195, "#181b23", 1, false, t);

  drawPerson(ctx, 188, 195, { coat: "#1c2028", umbrella: "#425465", walk: 0 });
  drawPerson(ctx, 198, 195, { coat: "#25222a", umbrella: "#8c6f5d", walk: 1, scale: 0.92 });
  drawPerson(ctx, 387, 195, { coat: "#1e242c", umbrella: "#576c7a", walk: 0 });

  // A small river boat.
  const boatX = mod(reducedMotion ? 300 : t * 2.8 + 30, W + 120) - 50;
  ctx.fillStyle = "#0f1820";
  ctx.fillRect(boatX, 233, 48, 7);
  ctx.fillStyle = "#1d2c36";
  ctx.fillRect(boatX + 4, 229, 38, 5);
  ctx.fillStyle = "#ffd28a";
  for (let index = 0; index < 6; index += 1) ctx.fillRect(boatX + 7 + index * 6, 230, 3, 2);

  drawFog(ctx, reducedMotion ? 0 : t, { y: 188, alpha: 0.055, height: 22, color: "#d4dbe0" });
}

function drawNamsanTower(ctx, cx, baseY, topY, t) {
  const pale = "#dce5e7";
  const light = "#9fdbdc";
  drawGlow(ctx, cx, topY + 42, 26, 54, "#ff9fb8", 0.06, 31);

  // Hill.
  ctx.fillStyle = "#0c1718";
  ctx.beginPath();
  ctx.moveTo(cx - 132, 208);
  ctx.lineTo(cx - 73, 184);
  ctx.lineTo(cx - 22, 158);
  ctx.lineTo(cx + 22, 166);
  ctx.lineTo(cx + 82, 190);
  ctx.lineTo(cx + 134, 208);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#1f3b2d";
  for (let index = 0; index < 28; index += 1) {
    const x = cx - 100 + hash01(index * 7.1) * 200;
    const y = 174 + hash01(index * 3.7) * 30;
    ctx.fillRect(Math.round(x), Math.round(y), 2, 4);
  }
  ctx.globalAlpha = 1;

  // Tower mast and observation deck.
  ctx.fillStyle = "#242329";
  ctx.fillRect(cx - 2, topY + 34, 4, baseY - topY - 34);
  ctx.fillStyle = "#34343b";
  ctx.fillRect(cx - 7, topY + 28, 14, 8);
  ctx.fillStyle = pale;
  ctx.fillRect(cx - 8, topY + 22, 16, 3);
  ctx.fillStyle = "#e6a3b2";
  ctx.fillRect(cx - 2, topY + 10, 4, 12);
  ctx.fillStyle = light;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(cx - 5, topY + 25, 10, 2);
  ctx.fillRect(cx - 1, topY + 13, 2, 8);
  ctx.globalAlpha = 1;
  if (Math.sin(t * 2.3) > 0.25) {
    ctx.fillStyle = "#ff5964";
    ctx.fillRect(cx - 1, topY + 6, 2, 2);
  }
  ctx.fillStyle = pale;
  ctx.fillRect(cx - 1, topY + 2, 2, 5);

  // Tiny cable car line disappearing into the hill.
  ctx.globalAlpha = 0.28;
  line(ctx, cx + 5, topY + 30, cx + 80, 191, "#9dc3cb");
  ctx.globalAlpha = 1;
}

function drawHanok(ctx, x, baseY, width) {
  ctx.fillStyle = "#1d1719";
  ctx.fillRect(x, baseY - 25, width, 25);
  ctx.fillStyle = "#2c2323";
  ctx.fillRect(x + 4, baseY - 21, width - 8, 3);
  ctx.fillStyle = "#ffd08a";
  ctx.globalAlpha = 0.62;
  for (let index = 0; index < 3; index += 1) {
    ctx.fillRect(x + 8 + index * 18, baseY - 18, 11, 12);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#17141a";
  for (let index = 0; index < 4; index += 1) {
    ctx.fillRect(x - 5 + index * 2, baseY - 30 - index, width + 10 - index * 4, 2);
  }
  ctx.fillStyle = "#252028";
  ctx.fillRect(x - 7, baseY - 33, 7, 2);
  ctx.fillRect(x + width, baseY - 33, 7, 2);
  ctx.fillStyle = "#c45c55";
  ctx.fillRect(x + 5, baseY - 28, 4, 4);
  ctx.fillRect(x + width - 9, baseY - 28, 4, 4);
}

function drawSeoul(ctx, t, weather, reducedMotion) {
  ctx.drawImage(getSky("seoul"), 0, 0);
  drawStars(ctx, reducedMotion ? 0 : t, { seed: 151, count: 64, maxY: 150, color: "#ffe3ef" });
  drawCloudBand(ctx, t, { seed: 39, y: 40, color: "#3a234f", alpha: 0.55, height: 4, spread: 24 });
  drawMoon(ctx, 392, 48, 13, { color: "#f8e8cf", shade: "#d7c0a8" });

  drawSkyline(ctx, {
    baseY: 204,
    color: "#131022",
    roofColor: "#0d0a18",
    seed: 81,
    minH: 20,
    maxH: 60,
    minW: 10,
    maxW: 24,
    gap: 2,
    windows: true,
    windowColors: ["#8f6b7f", "#5d4a71", "#c2859d"],
    windowDensity: 0.09,
    t: reducedMotion ? 0 : t,
    dim: 0.55,
  });

  drawNamsanTower(ctx, 236, 198, 58, reducedMotion ? 0 : t);

  drawSkyline(ctx, {
    baseY: 210,
    color: "#1b1430",
    roofColor: "#120d21",
    seed: 52,
    minH: 42,
    maxH: 102,
    minW: 15,
    maxW: 32,
    gap: 3,
    windows: true,
    windowColors: ["#ffcf8a", "#9fe8ef", "#ff9fc4"],
    windowDensity: 0.22,
    t: reducedMotion ? 0 : t,
    minX: -8,
    maxX: 178,
    antenna: 0.2,
  });
  drawSkyline(ctx, {
    baseY: 210,
    color: "#1b1430",
    roofColor: "#120d21",
    seed: 68,
    minH: 38,
    maxH: 96,
    minW: 15,
    maxW: 30,
    gap: 3,
    windows: true,
    windowColors: ["#ffcf8a", "#9fe8ef", "#ff9fc4"],
    windowDensity: 0.22,
    t: reducedMotion ? 0 : t,
    minX: 300,
    maxX: W + 8,
    antenna: 0.18,
  });

  drawNeonSign(ctx, { x: 30, y: 145, w: 42, h: 9, text: "SEOUL", color: "#ff9fc4", bg: "#160e20", t });
  drawNeonSign(ctx, { x: 335, y: 158, w: 35, h: 9, text: "NIGHT", color: "#8fe8ef", bg: "#101322", t });
  drawVerticalNeon(ctx, 122, 127, 52, "#62e0e8", t);
  drawVerticalNeon(ctx, 345, 105, 48, "#ff9fc4", t);

  // Street level.
  ctx.fillStyle = "#16111e";
  ctx.fillRect(0, 210, W, 40);
  ctx.fillStyle = "#271c30";
  ctx.fillRect(0, 210, W, 2);
  ctx.fillStyle = "#0c0911";
  ctx.fillRect(0, 250, W, 20);
  for (let x = 196; x < 292; x += 13) {
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#f0dcc2";
    ctx.fillRect(x, 214, 5, 21);
    ctx.globalAlpha = 1;
  }
  drawStreetReflections(
    ctx,
    [
      { x: 236, width: 24, color: "#ff9fc4", alpha: 0.3 },
      { x: 126, width: 8, color: "#62e0e8", alpha: 0.34 },
      { x: 352, width: 16, color: "#ffcf8a", alpha: 0.28 },
      { x: 44, width: 12, color: "#ff9fc4", alpha: 0.24 },
    ],
    reducedMotion ? 0 : t,
    211,
    249,
  );

  drawHanok(ctx, 0, 235, 68);
  drawHanok(ctx, 410, 235, 70);

  drawStreetLamp(ctx, 100, 214, 36, true, t);
  drawStreetLamp(ctx, 300, 214, 34, true, t);
  drawStreetLamp(ctx, 388, 214, 36, true, t);

  drawPerson(ctx, 176, 204, { coat: "#251a2b", umbrella: null, walk: 0 });
  drawPerson(ctx, 188, 204, { coat: "#30202e", umbrella: null, walk: 1, scale: 0.92 });
  drawPerson(ctx, 320, 204, { coat: "#1c1b2b", umbrella: null, walk: 0 });

  const car1 = mod(reducedMotion ? 0 : t * 22 + 70, W + 90) - 40;
  const car2 = W - mod(reducedMotion ? 0 : t * 16 + 180, W + 90) + 30;
  drawCar(ctx, car1, 220, "#4a2c4d", 1, true, t);
  drawCar(ctx, car2, 236, "#24495a", -1, true, t);

  // Lantern glow near the hanoks.
  drawGlow(ctx, 20, 214, 20, 7, "#ffcf8a", 0.18, 37);
  drawGlow(ctx, 452, 214, 18, 6, "#ffcf8a", 0.16, 41);
}

function drawPalm(ctx, x, baseY, height, seed) {
  const random = mulberry32(seed);
  ctx.save();
  ctx.strokeStyle = "#111711";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x - 8, baseY - height * 0.55, x + 3, baseY - height);
  ctx.stroke();
  ctx.strokeStyle = "#1f3324";
  ctx.lineWidth = 1;
  for (let index = 0; index < 8; index += 1) {
    const angle = -Math.PI * 0.9 + (index / 7) * Math.PI * 1.8;
    const length = 12 + random() * 22;
    const tipX = x + 3 + Math.cos(angle) * length;
    const tipY = baseY - height + Math.sin(angle) * length * 0.55 + length * 0.35;
    ctx.beginPath();
    ctx.moveTo(x + 3, baseY - height);
    ctx.quadraticCurveTo(
      x + 3 + Math.cos(angle) * length * 0.55,
      baseY - height + Math.sin(angle) * length * 0.2 - 4,
      tipX,
      tipY,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawChrist(ctx, cx, feetY, t) {
  const stone = "#e7e1d2";
  const light = "#fff4d9";
  drawGlow(ctx, cx, feetY - 20, 42, 38, "#ffe2a4", 0.11, 51);

  ctx.fillStyle = "#b9b3a7";
  ctx.fillRect(cx - 5, feetY - 5, 10, 5);
  ctx.fillStyle = stone;
  ctx.fillRect(cx - 3, feetY - 34, 7, 30);
  ctx.fillStyle = light;
  ctx.fillRect(cx - 2, feetY - 34, 3, 28);
  ctx.fillStyle = stone;
  ctx.fillRect(cx - 2, feetY - 40, 5, 5);
  ctx.fillRect(cx - 19, feetY - 31, 38, 2);
  ctx.fillRect(cx - 20, feetY - 29, 4, 2);
  ctx.fillRect(cx + 17, feetY - 29, 4, 2);
  ctx.fillStyle = light;
  ctx.fillRect(cx - 18, feetY - 31, 36, 1);
  ctx.fillStyle = "#cfc9bc";
  ctx.fillRect(cx - 2, feetY - 24, 1, 17);
  ctx.fillRect(cx + 2, feetY - 22, 1, 15);

  if (!t) return;
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#ffe4aa";
  ctx.fillRect(cx - 28, feetY - 14, 56, 10);
  ctx.globalAlpha = 1;
}

function drawSugarloaf(ctx, cx, baseY, height) {
  const rows = baseY - height;
  for (let y = rows; y <= baseY; y += 1) {
    const p = (y - rows) / height;
    const half = Math.round(Math.sqrt(p) * 38 + Math.sin(p * Math.PI) * 8);
    ctx.fillStyle = p > 0.7 ? "#0d1c22" : "#10252a";
    ctx.fillRect(cx - half, y, half * 2, 1);
  }
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#33524e";
  for (let index = 0; index < 26; index += 1) {
    const x = cx - 32 + hash01(index * 3.3) * 64;
    const y = rows + 12 + hash01(index * 7.1) * (height - 20);
    ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
  }
  ctx.globalAlpha = 1;

  // Cable car line.
  ctx.globalAlpha = 0.32;
  line(ctx, cx - 60, baseY - 10, cx, rows + 10, "#d4e2dc");
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#e7efe9";
  ctx.fillRect(cx - 28, Math.round(rows + height * 0.35), 4, 3);
}

function drawRio(ctx, t, weather, reducedMotion) {
  ctx.drawImage(getSky("rio"), 0, 0);
  drawStars(ctx, reducedMotion ? 0 : t, { seed: 188, count: 72, maxY: 150, color: "#ffe8c4" });
  drawCloudBand(ctx, t, { seed: 71, y: 38, color: "#24485a", alpha: 0.45, height: 4, spread: 24 });
  drawMoon(ctx, 392, 48, 12, { color: "#f6e7c9", shade: "#d4bfa2" });

  drawSkyline(ctx, {
    baseY: 202,
    color: "#0b1c24",
    roofColor: "#07151b",
    seed: 97,
    minH: 18,
    maxH: 52,
    minW: 10,
    maxW: 25,
    gap: 3,
    windows: true,
    windowColors: ["#d8b878", "#7fa6a6", "#f0cd8a"],
    windowDensity: 0.15,
    t: reducedMotion ? 0 : t,
    minX: 120,
    maxX: 380,
    dim: 0.7,
  });

  // Corcovado mountain.
  ctx.fillStyle = "#0d2026";
  ctx.beginPath();
  ctx.moveTo(105, 207);
  ctx.lineTo(164, 160);
  ctx.lineTo(214, 132);
  ctx.lineTo(250, 124);
  ctx.lineTo(292, 148);
  ctx.lineTo(346, 178);
  ctx.lineTo(390, 207);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#16332f";
  ctx.globalAlpha = 0.55;
  for (let index = 0; index < 36; index += 1) {
    const x = 130 + hash01(index * 5.3) * 230;
    const y = 140 + hash01(index * 9.7) * 64;
    ctx.fillRect(Math.round(x), Math.round(y), 2, 3);
  }
  ctx.globalAlpha = 1;

  drawChrist(ctx, 250, 124, reducedMotion ? 0 : t);
  drawSugarloaf(ctx, 414, 208, 92);

  // Shoreline city lights.
  drawSkyline(ctx, {
    baseY: 207,
    color: "#12252d",
    roofColor: "#0b191f",
    seed: 39,
    minH: 8,
    maxH: 28,
    minW: 6,
    maxW: 14,
    gap: 1,
    windows: true,
    windowColors: ["#ffd28a", "#e8b16d", "#a9d4cc"],
    windowDensity: 0.32,
    t: reducedMotion ? 0 : t,
    minX: -6,
    maxX: W + 6,
    antenna: 0.05,
    dim: 0.8,
  });

  drawWater(ctx, {
    y: 209,
    t: reducedMotion ? 0 : t,
    topColor: "#0a2632",
    bottomColor: "#06141d",
    waveColor: "#2f5e63",
    reflections: [
      { x: 250, width: 34, color: "#ffe0a2", alpha: 0.38 },
      { x: 392, width: 26, color: "#f6e7c9", alpha: 0.3 },
      { x: 150, width: 20, color: "#d8b878", alpha: 0.22 },
      { x: 430, width: 14, color: "#cf9f6c", alpha: 0.2 },
    ],
    fog: 0.03,
  });

  // A bright shoreline and a thin strip of sand.
  ctx.fillStyle = "#3b3029";
  ctx.fillRect(0, 253, W, 17);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#d9bb8c";
  for (let x = 0; x < W; x += 5) {
    if (hash01(x * 2.1) > 0.35) ctx.fillRect(x, 253 + Math.round(hash01(x) * 3), 3, 1);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#617f7a";
  ctx.fillRect(0, 251, W, 1);

  // Boats and shore lights.
  for (let index = 0; index < 4; index += 1) {
    const boatX = mod(reducedMotion ? index * 130 : t * (2 + index * 0.4) + index * 130 + 40, W + 80) - 40;
    ctx.fillStyle = "#101c22";
    ctx.fillRect(Math.round(boatX), 225 + index * 5, 13, 3);
    ctx.fillStyle = "#ffd28a";
    ctx.fillRect(Math.round(boatX) + 3, 224 + index * 5, 2, 1);
  }

  drawPalm(ctx, 22, 270, 64, 12);
  drawPalm(ctx, 454, 270, 58, 19);
  drawPalm(ctx, 66, 270, 42, 25);

  drawGlow(ctx, 250, 208, 36, 8, "#ffe0a2", 0.13, 61);
  drawGlow(ctx, 414, 208, 28, 7, "#ffd28a", 0.1, 67);

  drawFog(ctx, reducedMotion ? 0 : t, { y: 197, alpha: 0.025, height: 18, color: "#bfe0d8" });
}

function drawLightning(ctx, t) {
  const phase = mod(t + 4.2, 12);
  if (phase > 0.12 && phase < 0.2) return;
  if (phase >= 0.36 && phase < 0.4) return;
  if (phase > 0.44) return;

  ctx.save();
  ctx.globalAlpha = phase < 0.12 ? 0.16 : 0.08;
  ctx.fillStyle = "#dce9ff";
  ctx.fillRect(0, 0, W, H);
  if (phase < 0.12) {
    const seed = Math.floor((t + 4.2) / 12);
    const random = mulberry32(seed * 41 + 7);
    let x = 50 + Math.round(random() * 380);
    let y = 30 + Math.round(random() * 18);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#f4f9ff";
    for (let step = 0; step < 9; step += 1) {
      const nx = x + Math.round((random() * 2 - 1) * 12);
      const ny = y + 8 + Math.round(random() * 9);
      line(ctx, x, y, nx, ny, "#f4f9ff");
      x = nx;
      y = ny;
      if (y > 150) break;
    }
  }
  ctx.restore();
}

function drawWeather(ctx, weather, t, reducedMotion) {
  const time = reducedMotion ? 0 : t;
  switch (weather) {
    case "storm":
      drawRain(ctx, time, { count: 300, wind: 38, speed: 220, maxAlpha: 0.5 });
      drawFog(ctx, time, { y: 190, alpha: 0.1, height: 26, color: "#c8d6e5" });
      if (!reducedMotion) drawLightning(ctx, t);
      break;
    case "rain":
      drawRain(ctx, time, { count: 190, wind: 24, speed: 170 });
      drawFog(ctx, time, { y: 200, alpha: 0.07, height: 18, color: "#c9d7e8" });
      drawPetals(ctx, time, { count: 8, color: "#ffa8cc", speed: 4 });
      break;
    case "snow":
      drawSnow(ctx, time, { count: 150, wind: 14, speed: 16 });
      drawFog(ctx, time, { y: 198, alpha: 0.07, height: 18, color: "#dfeaf5" });
      break;
    case "breeze":
      drawLeaves(ctx, time, { count: 36, speed: 9, wind: 36 });
      drawPetals(ctx, time, { count: 9, color: "#ffd59a", speed: 3 });
      break;
    case "fall":
      drawLeaves(ctx, time, { count: 92, speed: 17, wind: 22 });
      drawFog(ctx, time, { y: 200, alpha: 0.035, height: 18, color: "#e5b27c" });
      break;
    case "fog":
      drawFog(ctx, time, { y: 142, alpha: 0.09, height: 44, layers: 6, color: "#c8d3df" });
      drawFog(ctx, time, { y: 196, alpha: 0.13, height: 34, layers: 5, color: "#dfe5ec" });
      break;
    case "clear":
      drawPetals(ctx, time, { count: 9, color: "#ffd59a", speed: 3 });
      break;
    default:
      break;
  }
}

export function drawScene(ctx, cityId, t, weather, reducedMotion = false) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, W, H);
  if (cityId === "paris") {
    drawParis(ctx, t, weather, reducedMotion);
  } else if (cityId === "new-york") {
    drawNewYork(ctx, t, weather, reducedMotion);
  } else if (cityId === "london") {
    drawLondon(ctx, t, weather, reducedMotion);
  } else if (cityId === "seoul") {
    drawSeoul(ctx, t, weather, reducedMotion);
  } else if (cityId === "rio") {
    drawRio(ctx, t, weather, reducedMotion);
  } else {
    drawTokyo(ctx, t, weather, reducedMotion);
  }
  drawWeather(ctx, weather, t, reducedMotion);
}

export function drawPreview(canvas, cityId, weather) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  drawScene(ctx, cityId, 3.5, weather, true);
}
