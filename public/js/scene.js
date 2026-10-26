import { W, H, pixelText, line, mulberry32 } from "./pixel.js";
import { drawScene } from "./scenes.js";
import { getCity } from "./cities.js";

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.ctx.imageSmoothingEnabled = false;
    this.cityId = "tokyo";
    this.weather = "rain";
    this.t = 2.4;
    this.last = 0;
    this.raf = 0;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.lightning = null;
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.motionQuery.addEventListener?.("change", (event) => {
      this.reducedMotion = event.matches;
      if (this.reducedMotion) this.draw();
      else this.start();
    });

    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("orientationchange", this.resize, { passive: true });
    this.resize();
  }

  resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(vw / W, vh / H);
    const cw = Math.ceil(W * scale);
    const ch = Math.ceil(H * scale);
    const city = getCity(this.cityId);
    const focusX = city.focusX ?? 0.5;
    const focusY = city.focusY ?? 0.5;
    const left = Math.round((vw - cw) * focusX);
    const top = Math.round((vh - ch) * focusY);

    this.canvas.style.width = `${cw}px`;
    this.canvas.style.height = `${ch}px`;
    this.canvas.style.left = `${left}px`;
    this.canvas.style.top = `${top}px`;

    if (this.reducedMotion) this.draw();
  }

  start() {
    if (this.raf) return;
    if (this.reducedMotion) {
      this.draw();
      return;
    }
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  loop(now) {
    const delta = Math.min(0.06, (now - this.last) / 1000 || 0.016);
    this.last = now;
    this.t += delta;
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  }

  draw() {
    drawScene(this.ctx, this.cityId, this.t, this.weather, this.reducedMotion);
    this.drawLightningOverlay();
  }

  flashLightning(intensity = 1, { background = false } = {}) {
    if (this.reducedMotion) return;
    this.lightning = {
      at: this.t,
      intensity: Math.max(0.1, Math.min(1, intensity)),
      background,
      seed: Math.random() * 1000,
    };
  }

  drawLightningOverlay() {
    const flash = this.lightning;
    if (!flash) return;
    if (this.weather !== "storm") {
      this.lightning = null;
      return;
    }

    const age = this.t - flash.at;
    if (age > 0.6) {
      this.lightning = null;
      return;
    }

    let alpha = 0;
    if (age < 0.08) alpha = 0.2;
    else if (age > 0.12 && age < 0.18) alpha = 0.1;
    else if (age > 0.26 && age < 0.32) alpha = 0.05;
    if (flash.background) alpha *= 0.35;
    alpha *= flash.intensity;

    const ctx = this.ctx;
    if (alpha > 0.002) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#eaf7ff";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    if (!flash.background && flash.intensity > 0.4 && age < 0.16) {
      const random = mulberry32(flash.seed);
      let x = 60 + random() * 360;
      let y = 18 + random() * 20;
      ctx.save();
      ctx.globalAlpha = 0.55 * flash.intensity * (1 - age / 0.18);
      ctx.fillStyle = "#f2fbff";
      for (let step = 0; step < 9; step += 1) {
        const nx = x + (random() * 2 - 1) * 13;
        const ny = y + 8 + random() * 9;
        line(ctx, x, y, nx, ny, "#f2fbff");
        x = nx;
        y = ny;
        if (y > 160) break;
      }
      ctx.globalAlpha = 0.18;
      ctx.fillRect(Math.round(x) - 8, Math.round(y), 17, 3);
      ctx.restore();
    }
  }

  setCity(cityId) {
    if (cityId === this.cityId) return;
    this.cityId = cityId;
    this.t += 0.4;
    this.resize();
    this.draw();
  }

  setWeather(weather) {
    if (weather === this.weather) return;
    this.weather = weather;
    this.draw();
  }

  createPostcard() {
    const city = getCity(this.cityId);
    const frame = document.createElement("canvas");
    frame.width = W;
    frame.height = H;
    const frameCtx = frame.getContext("2d");
    frameCtx.imageSmoothingEnabled = false;
    frameCtx.drawImage(this.canvas, 0, 0);

    const shade = frameCtx.createLinearGradient(0, 218, 0, H);
    shade.addColorStop(0, "rgba(7,5,12,0)");
    shade.addColorStop(1, "rgba(7,5,12,.82)");
    frameCtx.fillStyle = shade;
    frameCtx.fillRect(0, 218, W, H - 218);

    frameCtx.fillStyle = "rgba(12,8,18,.55)";
    frameCtx.fillRect(12, 230, 198, 26);
    frameCtx.strokeStyle = "rgba(255,255,255,.22)";
    frameCtx.strokeRect(12.5, 230.5, 197, 25);
    pixelText(frameCtx, "LOFI SKYLINES", 19, 235, {
      color: "#f7f2ff",
      scale: 2,
    });
    pixelText(frameCtx, `${city.name} / ${this.weather}`, 19, 248, {
      color: city.accent,
      scale: 1,
    });
    pixelText(frameCtx, "A LITTLE NIGHT, GENERATED LIVE", 402, 248, {
      color: "rgba(255,255,255,.6)",
      scale: 1,
      align: "right",
    });

    const output = document.createElement("canvas");
    output.width = 1920;
    output.height = 1080;
    const outCtx = output.getContext("2d");
    outCtx.imageSmoothingEnabled = false;
    outCtx.drawImage(frame, 0, 0, output.width, output.height);
    return output;
  }

  downloadPostcard() {
    const city = getCity(this.cityId);
    const output = this.createPostcard();
    const link = document.createElement("a");
    output.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `lofi-skylines-${city.id}-${this.weather}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }
}
