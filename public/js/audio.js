const STYLE_CONFIG = {
  jazzhop: {
    bpm: 76,
    swing: 0.16,
    pad: 0.35,
    chordHits: [0, 6],
    kick: [0, 7, 10],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    openHat: [14],
    bass: [0, 6, 10, 14],
    melody: [0, 3, 6, 10, 12, 14],
    drumKind: "boom",
    chordTone: "rhodes",
  },
  piano: {
    bpm: 67,
    swing: 0.1,
    pad: 0.18,
    chordHits: [0],
    kick: [0, 8],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    openHat: [],
    bass: [0, 8],
    melody: [0, 2, 4, 6, 8, 10, 12, 14],
    drumKind: "brush",
    chordTone: "rhodes",
  },
  ambient: {
    bpm: 56,
    swing: 0,
    pad: 0.9,
    chordHits: [0],
    kick: [],
    snare: [],
    hats: [],
    openHat: [],
    bass: [0],
    melody: [0, 8],
    drumKind: "none",
    chordTone: "rhodes",
  },
  "deep-focus": {
    bpm: 60,
    swing: 0,
    pad: 0.85,
    chordHits: [0],
    kick: [],
    snare: [],
    hats: [],
    openHat: [],
    bass: [0],
    melody: [0, 8],
    drumKind: "none",
    chordTone: "rhodes",
  },
  bossa: {
    bpm: 88,
    swing: 0.07,
    pad: 0.22,
    chordHits: [0, 8],
    kick: [0, 10],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    openHat: [],
    bass: [0, 6, 8, 14],
    melody: [0, 2, 4, 6, 8, 10, 12, 14],
    drumKind: "brush",
    chordTone: "rhodes",
  },
  synth: {
    bpm: 94,
    swing: 0.02,
    pad: 0.55,
    chordHits: [0, 8],
    kick: [0, 8],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    openHat: [14],
    bass: [0, 4, 8, 12],
    melody: [0, 3, 6, 10, 12, 14],
    drumKind: "boom",
    chordTone: "synth",
    arpInterval: 4,
    arpPattern: [0, 1, 2, 3],
  },
  house: {
    bpm: 112,
    swing: 0,
    pad: 0.4,
    chordHits: [0, 8],
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    openHat: [6, 14],
    bass: [0, 4, 8, 12],
    melody: [0, 3, 6, 10, 12, 14],
    drumKind: "house",
    chordTone: "synth",
    arpInterval: 4,
    arpPattern: [0, 2, 1, 3],
    pump: true,
  },
  "focus-edm": {
    bpm: 122,
    swing: 0,
    pad: 0.3,
    chordHits: [0, 8],
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    openHat: [2, 6, 10, 14],
    bass: [0, 4, 8, 12],
    melody: [0, 3, 6, 10, 12, 14],
    drumKind: "house",
    chordTone: "synth",
    arpInterval: 2,
    arpPattern: [0, 1, 2, 1],
    pump: true,
  },
};

const CHORDS = {
  Fmaj9: { notes: [53, 57, 60, 64, 67], root: 41 },
  Dm9: { notes: [50, 53, 57, 60, 64], root: 38 },
  Gm9: { notes: [55, 58, 62, 65, 69], root: 43 },
  C9: { notes: [48, 52, 55, 58, 62], root: 36 },
  Am9: { notes: [45, 48, 52, 55, 59], root: 33 },
  G13: { notes: [55, 59, 62, 65, 69], root: 43 },
  Cmaj9: { notes: [48, 52, 55, 59, 62], root: 36 },
  A7b9: { notes: [45, 49, 52, 55, 58], root: 33 },
  Bbmaj7: { notes: [46, 50, 53, 57], root: 34 },
  C7: { notes: [48, 52, 55, 58], root: 36 },
  Dm7: { notes: [50, 53, 57, 60], root: 38 },
  Fmaj7: { notes: [53, 57, 60, 64], root: 41 },
  Am7: { notes: [45, 48, 52, 55], root: 33 },
  Cmaj7: { notes: [48, 52, 55, 59], root: 36 },
  G7: { notes: [55, 59, 62, 65], root: 43 },
  Dmaj9: { notes: [50, 54, 57, 61, 64], root: 38 },
  Bm11: { notes: [47, 50, 54, 57, 62], root: 35 },
  Gmaj9: { notes: [43, 47, 50, 54, 59], root: 31 },
  A7sus: { notes: [45, 50, 52, 55, 59], root: 33 },
  Em7: { notes: [52, 55, 59, 62], root: 40 },
  A7: { notes: [45, 49, 52, 55], root: 33 },
  Dmaj7: { notes: [50, 54, 57, 61], root: 38 },
  G6: { notes: [55, 59, 62, 64], root: 43 },
  Bm7: { notes: [47, 50, 54, 57], root: 35 },
  E9: { notes: [52, 56, 59, 62, 66], root: 40 },
};

const PROGRESSIONS = {
  jazzhop: [
    ["Fmaj9", "Dm9", "Gm9", "C9"],
    ["Am9", "Dm9", "Gm9", "C9"],
    ["Dm9", "G13", "Cmaj9", "A7b9"],
    ["Fmaj9", "Am9", "Dm9", "G13"],
  ],
  piano: [
    ["Fmaj7", "Dm7", "Bbmaj7", "C7"],
    ["Am7", "Fmaj7", "Cmaj7", "G7"],
    ["Dm7", "Bbmaj7", "Fmaj7", "C7"],
  ],
  ambient: [
    ["Dmaj9", "Bm11", "Gmaj9", "A7sus"],
    ["Bm11", "Gmaj9", "Dmaj9", "A7sus"],
  ],
  "deep-focus": [
    ["Dmaj9", "Bm11", "Gmaj9", "A7sus"],
    ["Fmaj9", "Em7", "Dm9", "A7sus"],
    ["Bm11", "Gmaj9", "Dmaj9", "A7sus"],
  ],
  bossa: [
    ["Cmaj9", "A7b9", "Dm9", "G13"],
    ["Fmaj9", "G13", "Em7", "A7"],
    ["Dm9", "G13", "Cmaj9", "A7b9"],
    ["Fmaj9", "Em7", "Dm9", "G13"],
  ],
  synth: [
    ["Am9", "Fmaj9", "Cmaj9", "G13"],
    ["Dm9", "G13", "Em7", "Am9"],
    ["Fmaj9", "G13", "Em7", "Am9"],
    ["Dmaj7", "Bm7", "Gmaj9", "A7"],
  ],
  house: [
    ["Am9", "Fmaj9", "Cmaj9", "G13"],
    ["Dm9", "G13", "Cmaj9", "Fmaj9"],
    ["Fmaj9", "Em7", "Dm9", "Cmaj9"],
    ["Am9", "Fmaj9", "G13", "Cmaj9"],
  ],
  "focus-edm": [
    ["Am9", "Fmaj9", "Cmaj9", "G13"],
    ["Dm9", "G13", "Em7", "Am9"],
    ["Fmaj9", "G13", "Em7", "Am9"],
    ["Am9", "Fmaj9", "Dm9", "G13"],
  ],
};

function midiToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function curve(value) {
  return Math.pow(Math.max(0, Math.min(1, value)), 1.7);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class LofiEngine {
  constructor() {
    this.ctx = null;
    this.started = false;
    this.playing = false;
    this.style = "jazzhop";
    this.pendingStyle = null;
    this.weather = "rain";
    this.citySounds = true;
    this.musicVol = 0.72;
    this.ambienceVol = 0.55;
    this.muted = false;
    this.seed = 1;
    this.recipe = null;
    this.thunderBuffer = null;
    this.thunderBufferPromise = null;
    this.thunderSampleUrl = "/assets/thunder-strike.mp3";
    this.step = 0;
    this.nextStepTime = 0;
    this.timer = 0;
    this.song = null;
    this.styleConfig = STYLE_CONFIG[this.style];
    this.random = mulberry32(this.seed);
    this.noise = new Map();
  }

  async ensure() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return this.ctx;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio is not supported in this browser.");
    this.ctx = new AudioContextClass({ latencyHint: "playback" });
    this.buildGraph();
    await this.loadThunderSample();
    this.buildAmbience();
    this.startVinyl();
    this.buildSong();
    this.nextStepTime = this.ctx.currentTime + 0.12;
    this.timer = window.setInterval(() => this.tick(), 40);
    await this.ctx.resume();
    this.started = true;
    return this.ctx;
  }

  buildGraph() {
    const ctx = this.ctx;
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -19;
    this.compressor.knee.value = 22;
    this.compressor.ratio.value = 3.5;
    this.compressor.attack.value = 0.008;
    this.compressor.release.value = 0.28;
    this.compressor.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = 0.72;
    this.master.connect(this.compressor);

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 24;
    highpass.connect(this.master);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = curve(this.musicVol) * 0.92;
    this.musicBus.connect(highpass);

    // Tonal instruments run through their own bus so EDM tracks can sidechain
    // the keys and pads against the kick without ducking the drums.
    this.tonalBus = ctx.createGain();
    this.tonalBus.gain.value = 1;
    this.tonalBus.connect(this.musicBus);

    this.ambienceBus = ctx.createGain();
    this.ambienceBus.gain.value = this.citySounds ? curve(this.ambienceVol) * 0.95 : 0;
    this.ambienceBus.connect(highpass);

    // Rain/wind/fog go through the weather bed so a thunderclap can duck them
    // without touching the thunder itself.
    this.weatherBed = ctx.createGain();
    this.weatherBed.gain.value = 1;
    this.weatherBed.connect(this.ambienceBus);

    this.thunderBus = ctx.createGain();
    this.thunderBus.gain.value = 2.2;
    this.thunderBus.connect(this.ambienceBus);

    const impulseLength = Math.floor(ctx.sampleRate * 2.6);
    const impulse = ctx.createBuffer(2, impulseLength, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i += 1) {
        const decay = Math.pow(1 - i / impulseLength, 2.7);
        data[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = impulse;
    this.reverbSend = ctx.createGain();
    this.reverbSend.gain.value = 0.3;
    this.reverbSend.connect(this.reverb);
    this.reverb.connect(this.master);

    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = 0.365;
    this.delayFilter = ctx.createBiquadFilter();
    this.delayFilter.type = "lowpass";
    this.delayFilter.frequency.value = 2400;
    this.delayFeedback = ctx.createGain();
    this.delayFeedback.gain.value = 0.25;
    this.delaySend = ctx.createGain();
    this.delaySend.gain.value = 0.22;
    this.delaySend.connect(this.delay);
    this.delay.connect(this.delayFilter);
    this.delayFilter.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delay);
    this.delayFilter.connect(this.master);

    if (this.muted) this.master.gain.value = 0;
  }

  noiseBuffer(seconds, brown = false) {
    const key = `${seconds}:${brown ? "brown" : "white"}`;
    if (this.noise.has(key)) return this.noise.get(key);
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.4;
      } else {
        data[i] = white;
      }
    }
    this.noise.set(key, buffer);
    return buffer;
  }

  async loadThunderSample() {
    if (this.thunderBuffer) return;
    if (!this.thunderBufferPromise) {
      this.thunderBufferPromise = (async () => {
        const response = await fetch(this.thunderSampleUrl, { cache: "force-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = await response.arrayBuffer();
        this.thunderBuffer = await this.ctx.decodeAudioData(bytes);
      })().catch((error) => {
        console.warn("Thunder sample unavailable; using synthesized fallback.", error);
        this.thunderBuffer = null;
      });
    }
    await this.thunderBufferPromise;
  }

  buildAmbience() {
    const ctx = this.ctx;
    const makeLayer = (filterType, frequency, q, gainValue) => {
      const source = ctx.createBufferSource();
      source.buffer = this.noiseBuffer(3, filterType === "lowpass");
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      const gain = ctx.createGain();
      gain.gain.value = gainValue;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.weatherBed);
      source.start();
      return { source, filter, gain };
    };

    // Rain: a high hiss with a close patter layer underneath.
    this.rainLayer = makeLayer("bandpass", 1500, 0.42, 0);
    const rainTop = ctx.createBiquadFilter();
    rainTop.type = "lowpass";
    rainTop.frequency.value = 6000;
    this.rainLayer.filter.disconnect();
    this.rainLayer.filter.connect(rainTop);
    rainTop.connect(this.rainLayer.gain);
    this.rainPatter = makeLayer("bandpass", 720, 0.85, 0);

    // Snow: low wind with a faint high hush.
    this.windLayer = makeLayer("lowpass", 420, 0.4, 0);
    this.snowHush = makeLayer("highpass", 2900, 0.35, 0);
    this.humLayer = makeLayer("lowpass", 175, 0.65, 0);

    // Autumn leaves: a dry, high rustle that comes and goes with the gusts.
    this.leafLayer = makeLayer("bandpass", 3200, 1.1, 0);
    this.fogLayer = makeLayer("lowpass", 240, 0.5, 0);

    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.075;
    const windDepth = ctx.createGain();
    windDepth.gain.value = 140;
    windLfo.connect(windDepth);
    windDepth.connect(this.windLayer.filter.frequency);
    windLfo.start();

    const gustLfo = ctx.createOscillator();
    gustLfo.frequency.value = 0.055;
    const gustDepth = ctx.createGain();
    gustDepth.gain.value = 45;
    gustLfo.connect(gustDepth);
    gustDepth.connect(this.windLayer.filter.frequency);
    gustLfo.start();

    const patterLfo = ctx.createOscillator();
    patterLfo.frequency.value = 0.61;
    const patterDepth = ctx.createGain();
    patterDepth.gain.value = 220;
    patterLfo.connect(patterDepth);
    patterDepth.connect(this.rainPatter.filter.frequency);
    patterLfo.start();

    const leafLfo = ctx.createOscillator();
    leafLfo.frequency.value = 0.83;
    const leafDepth = ctx.createGain();
    leafDepth.gain.value = 700;
    leafLfo.connect(leafDepth);
    leafDepth.connect(this.leafLayer.filter.frequency);
    leafLfo.start();

    const fogLfo = ctx.createOscillator();
    fogLfo.frequency.value = 0.035;
    const fogDepth = ctx.createGain();
    fogDepth.gain.value = 60;
    fogLfo.connect(fogDepth);
    fogDepth.connect(this.fogLayer.filter.frequency);
    fogLfo.start();

    this.nextCricketAt = ctx.currentTime + 2 + Math.random() * 3;
    this.nextThunderAt = ctx.currentTime + 9 + Math.random() * 14;
    this.applyWeatherLayers();
  }

  applyWeatherLayers() {
    if (!this.ctx || !this.rainLayer) return;
    const now = this.ctx.currentTime;
    const targets = {
      clear: { rain: 0, patter: 0, wind: 0.05, hush: 0, hum: 0.3, leaves: 0, fog: 0 },
      rain: { rain: 0.72, patter: 0.38, wind: 0.06, hush: 0, hum: 0.08, leaves: 0, fog: 0.025 },
      storm: { rain: 0.8, patter: 0.34, wind: 0.2, hush: 0, hum: 0.04, leaves: 0.03, fog: 0.06 },
      snow: { rain: 0, patter: 0, wind: 0.55, hush: 0.07, hum: 0.1, leaves: 0, fog: 0.03 },
      breeze: { rain: 0, patter: 0, wind: 0.32, hush: 0, hum: 0.12, leaves: 0.16, fog: 0 },
      fall: { rain: 0, patter: 0, wind: 0.16, hush: 0, hum: 0.08, leaves: 0.44, fog: 0 },
      fog: { rain: 0, patter: 0, wind: 0.1, hush: 0, hum: 0.18, leaves: 0, fog: 0.26 },
    }[this.weather] || { rain: 0.5, patter: 0.2, wind: 0.08, hush: 0, hum: 0.1, leaves: 0, fog: 0 };

    this.rainLayer.gain.gain.setTargetAtTime(targets.rain, now, 0.7);
    this.rainPatter.gain.gain.setTargetAtTime(targets.patter, now, 0.7);
    this.windLayer.gain.gain.setTargetAtTime(targets.wind, now, 0.7);
    this.snowHush.gain.gain.setTargetAtTime(targets.hush, now, 0.7);
    this.humLayer.gain.gain.setTargetAtTime(targets.hum, now, 0.7);
    this.leafLayer.gain.gain.setTargetAtTime(targets.leaves, now, 0.7);
    this.fogLayer.gain.gain.setTargetAtTime(targets.fog, now, 0.9);
  }

  playWeatherTransition(weather) {
    if (!this.ctx || !this.playing || !this.citySounds) return;
    const ctx = this.ctx;
    const preset = {
      rain: { type: "bandpass", frequency: 1400, q: 0.6, level: 0.045 },
      storm: { type: "bandpass", frequency: 900, q: 0.4, level: 0.065 },
      snow: { type: "lowpass", frequency: 650, q: 0.35, level: 0.045 },
      breeze: { type: "bandpass", frequency: 1800, q: 0.5, level: 0.025 },
      fall: { type: "bandpass", frequency: 3000, q: 0.8, level: 0.032 },
      fog: { type: "lowpass", frequency: 350, q: 0.4, level: 0.03 },
      clear: { type: "highpass", frequency: 2400, q: 0.4, level: 0.018 },
    }[weather] || { type: "highpass", frequency: 2400, q: 0.4, level: 0.018 };
    const time = ctx.currentTime + 0.03;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer(1.4);
    const filter = ctx.createBiquadFilter();
    filter.type = preset.type;
    filter.frequency.value = preset.frequency;
    filter.Q.value = preset.q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(preset.level, time + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceBus);
    source.start(time);
    source.stop(time + 1.2);
  }

  scheduleCricket(time = this.ctx.currentTime + 0.1) {
    if (!this.ctx || this.weather !== "clear") return;
    const ctx = this.ctx;
    const panner = ctx.createStereoPanner();
    panner.pan.value = (Math.random() * 2 - 1) * 0.65;
    panner.connect(this.ambienceBus);
    const chirps = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < chirps; i += 1) {
      const start = time + i * (0.07 + Math.random() * 0.035);
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(3900 + Math.random() * 900, start);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.012 + Math.random() * 0.006, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);
      osc.connect(gain);
      gain.connect(panner);
      osc.start(start);
      osc.stop(start + 0.06);
    }
  }

  scheduleThunder(time = this.ctx.currentTime + 0.3, options = {}) {
    if (!this.ctx || (this.weather !== "rain" && this.weather !== "storm")) return;
    const { intensity = 1, strong = null, background = false } = options;
    const power = Math.max(0.15, Math.min(1, intensity));
    const isStrong = strong ?? this.weather === "storm";
    const ctx = this.ctx;

    if (isStrong && !background && this.weatherBed) {
      const bed = this.weatherBed.gain;
      bed.cancelScheduledValues(time);
      bed.setValueAtTime(1, time);
      bed.linearRampToValueAtTime(0.3, time + 0.03);
      bed.setValueAtTime(0.3, time + 0.9);
      bed.linearRampToValueAtTime(1, time + 1.9);
    }

    if (this.thunderBuffer) {
      this.scheduleThunderSample(time, { power, isStrong, background });
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer(3.2, true);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = background ? 115 : 145;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime((isStrong ? 0.38 : 0.18) * power, time + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.2);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.thunderBus);
    source.start(time);
    source.stop(time + 3.3);

    const rumble = ctx.createOscillator();
    rumble.type = "sine";
    rumble.frequency.setValueAtTime(background ? 42 : 50, time);
    rumble.frequency.exponentialRampToValueAtTime(34, time + 2.2);
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.0001, time);
    rumbleGain.gain.linearRampToValueAtTime((isStrong ? 0.13 : 0.08) * power, time + 0.5);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.6);
    rumble.connect(rumbleGain);
    rumbleGain.connect(this.thunderBus);
    rumble.start(time);
    rumble.stop(time + 2.7);

    if (isStrong && !background) {
      // A short crack on top of the low roll.
      const crack = ctx.createBufferSource();
      crack.buffer = this.noiseBuffer(0.35);
      const crackFilter = ctx.createBiquadFilter();
      crackFilter.type = "bandpass";
      crackFilter.frequency.value = 1100;
      crackFilter.Q.value = 0.5;
      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.0001, time);
      crackGain.gain.linearRampToValueAtTime(0.34 * power, time + 0.012);
      crackGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.46);
      crack.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(this.thunderBus);
      crack.start(time);
      crack.stop(time + 0.55);

      // A second, lower crack makes the strike read as a full thunderclap.
      const crack2 = ctx.createBufferSource();
      crack2.buffer = this.noiseBuffer(0.4);
      const crack2Filter = ctx.createBiquadFilter();
      crack2Filter.type = "bandpass";
      crack2Filter.frequency.value = 720;
      crack2Filter.Q.value = 0.55;
      const crack2Gain = ctx.createGain();
      crack2Gain.gain.setValueAtTime(0.0001, time + 0.16);
      crack2Gain.gain.linearRampToValueAtTime(0.22 * power, time + 0.18);
      crack2Gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.72);
      crack2.connect(crack2Filter);
      crack2Filter.connect(crack2Gain);
      crack2Gain.connect(this.thunderBus);
      crack2.start(time + 0.16);
      crack2.stop(time + 0.8);

      // A mid-frequency body so the thunder carries on small speakers too.
      const body = ctx.createBufferSource();
      body.buffer = this.noiseBuffer(1.9);
      const bodyFilter = ctx.createBiquadFilter();
      bodyFilter.type = "bandpass";
      bodyFilter.frequency.value = 420;
      bodyFilter.Q.value = 0.6;
      const bodyGain = ctx.createGain();
      bodyGain.gain.setValueAtTime(0.0001, time);
      bodyGain.gain.linearRampToValueAtTime(0.22 * power, time + 0.08);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.7);
      body.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.thunderBus);
      body.start(time + 0.05);
      body.stop(time + 1.9);
    }
  }

  scheduleThunderSample(time, { power, isStrong, background }) {
    const ctx = this.ctx;
    const buffer = this.thunderBuffer;
    if (!ctx || !buffer || !this.thunderBus) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = background ? 0.9 : isStrong ? 1 : 0.96;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = background ? 650 : isStrong ? 9000 : 1400;
    filter.Q.value = 0.4;

    const gain = ctx.createGain();
    const base = background ? 0.9 : isStrong ? 1.05 : 0.8;
    const level = Math.max(0.03, base * power);
    const offset = background
      ? Math.min(3.2, Math.max(0, buffer.duration * 0.3))
      : 0;
    const available = Math.max(0.5, buffer.duration - offset);
    const duration = Math.min(background ? 5.5 : 9.2, available);
    const attack = 0.015;
    const fadeStart = time + Math.max(attack + 0.1, duration - 0.8);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(level, time + attack);
    gain.gain.setValueAtTime(level, fadeStart);
    gain.gain.linearRampToValueAtTime(0.0001, time + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.thunderBus);
    source.start(time, offset, duration);
  }

  startVinyl() {
    const ctx = this.ctx;
    const length = ctx.sampleRate * 6;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.012;
    }
    const random = mulberry32(731);
    for (let i = 0; i < 80; i += 1) {
      const index = Math.floor(random() * (length - 30));
      const amp = 0.05 + random() * 0.18;
      for (let j = 0; j < 4 + Math.floor(random() * 8); j += 1) {
        if (index + j < length) data[index + j] += amp * Math.exp(-j * 0.55) * (random() > 0.5 ? 1 : -1);
      }
    }
    this.vinyl = ctx.createBufferSource();
    this.vinyl.buffer = buffer;
    this.vinyl.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.3;
    const gain = ctx.createGain();
    gain.gain.value = 0.07;
    this.vinyl.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicBus);
    this.vinyl.start();
  }

  buildSong() {
    const random = mulberry32(this.seed);
    const style = STYLE_CONFIG[this.style] || STYLE_CONFIG.jazzhop;
    const progressions = PROGRESSIONS[this.style] || PROGRESSIONS.jazzhop;
    const recipe = this.recipe || {};
    let progressionIndex = Number.isInteger(recipe.progressionIndex)
      ? recipe.progressionIndex
      : Math.floor(random() * progressions.length);
    progressionIndex =
      ((progressionIndex % progressions.length) + progressions.length) % progressions.length;
    const transpose = Number.isFinite(recipe.transpose) ? recipe.transpose : 0;
    const progression = progressions[progressionIndex].map((name) => {
      const chord = CHORDS[name];
      return {
        notes: chord.notes.map((note) => note + transpose),
        root: chord.root + transpose,
      };
    });

    this.song = {
      progression,
      bpm: Number.isFinite(recipe.bpm) ? recipe.bpm : style.bpm + Math.floor(random() * 7) - 3,
      swing: Number.isFinite(recipe.swing) ? recipe.swing : style.swing + random() * 0.03,
      fill: random() > 0.55,
      melodyDensity: Number.isFinite(recipe.density) ? recipe.density : 0.35 + random() * 0.25,
      melodyOctave: Number.isFinite(recipe.octave) ? recipe.octave : random() > 0.5 ? 12 : 24,
      variation: Math.floor(random() * 7),
      arpInterval: recipe.arpInterval ?? style.arpInterval ?? 0,
      arpPattern: recipe.arpPattern ?? style.arpPattern ?? [0, 1, 2, 1],
    };
    this.styleConfig = style;
  }

  applyPendingStyle() {
    if (!this.pendingStyle) return false;
    this.style = this.pendingStyle;
    this.pendingStyle = null;
    this.buildSong();
    return true;
  }

  get bpm() {
    return this.song?.bpm ?? this.styleConfig.bpm;
  }

  get stepDuration() {
    return 60 / this.bpm / 4;
  }

  tick() {
    if (!this.ctx || !this.playing) return;
    const ctx = this.ctx;
    while (this.nextStepTime < ctx.currentTime + 0.38) {
      if (this.step % 16 === 0) this.applyPendingStyle();
      const stepDuration = this.stepDuration;
      this.scheduleStep(this.step, this.nextStepTime, stepDuration);
      this.nextStepTime += stepDuration;
      this.step += 1;
    }

    const now = ctx.currentTime;
    if (this.citySounds && this.weather === "clear" && now >= this.nextCricketAt) {
      this.scheduleCricket(now + 0.12 + Math.random() * 0.2);
      this.nextCricketAt = now + 1.8 + Math.random() * 3.8;
    }
    if (
      this.citySounds &&
      this.weather === "rain" &&
      now >= this.nextThunderAt
    ) {
      this.scheduleThunder(now + 0.2 + Math.random() * 1.2);
      this.nextThunderAt = now + 22 + Math.random() * 30;
    }
  }

  scheduleStep(step, time, stepDuration) {
    const config = this.styleConfig;
    const song = this.song;
    const local = step % 16;
    const bar = Math.floor(step / 16);
    const chord = song.progression[bar % 4];
    const random = mulberry32(this.seed + bar * 131 + local * 17);
    const swing = local % 2 === 1 ? stepDuration * song.swing : 0;
    const t = time + swing;

    if (local === 0) {
      this.scheduleChord(chord, time, stepDuration * 16 * 0.92, config, bar);
      if (config.pad > 0.2) {
        const padBars = this.style === "ambient" || this.style === "deep-focus" ? 2 : 1;
        this.schedulePad(chord.notes, time, stepDuration * 16 * padBars, config.pad);
      }
      this.scheduleBarMelody(bar, chord, time, stepDuration, random);
    }

    if (config.chordHits.includes(local) && local !== 0) {
      this.scheduleChord(chord, t, stepDuration * 4.8, config, bar, 0.55);
    }

    const arpInterval = song.arpInterval;
    if (arpInterval > 0 && local % arpInterval === 0 && local !== 0) {
      const pattern = song.arpPattern;
      const arpIndex = Math.floor(step / arpInterval) % pattern.length;
      const note = chord.notes[pattern[arpIndex] % chord.notes.length] + 24;
      this.schedulePluck(note, t, 0.08 + random() * 0.04, 0.17);
    }

    if (config.kick.includes(local)) {
      this.scheduleKick(time + (local === 7 ? 0.006 : 0), 0.72);
    }
    if (config.snare.includes(local)) {
      this.scheduleSnare(t, config.drumKind === "brush" ? 0.35 : 0.55, config.drumKind === "brush");
    }
    if (config.drumKind !== "none" && local === 11 && random() > 0.65) {
      this.scheduleSnare(t + 0.008, 0.18, true);
    }
    if (config.hats.includes(local)) {
      const accent = local === 0 || local === 8 ? 0.16 : 0.1;
      this.scheduleHat(t, accent + random() * 0.04, false);
    }
    if (config.openHat.includes(local)) {
      this.scheduleHat(t, 0.08, true);
    }
    if (config.drumKind === "boom" && local === 6 && random() > 0.7) {
      this.scheduleRim(t, 0.12);
    }

    if (config.bass.includes(local)) {
      const total = config.bass.length;
      const index = config.bass.indexOf(local);
      let note = chord.root;
      if (local === 6) note += 7;
      if (local === 10) note += 12;
      if (local === 14 && this.style === "jazzhop") note += 7;
      if (local === 8) note += 7;
      const padStyle = this.style === "ambient" || this.style === "deep-focus";
      let length = padStyle
        ? stepDuration * 14
        : stepDuration * (index === total - 1 ? 2.2 : 4.4);
      if (this.style === "focus-edm" || this.style === "house") {
        length = stepDuration * 2.2;
      }
      this.scheduleBass(note, t, length, local === 0 ? 0.24 : 0.16);
    }

    // Sparse melody notes between the generated bar phrases.
    if (local !== 0 && config.melody.includes(local) && random() < song.melodyDensity * 0.55) {
      const notes = chord.notes;
      const note = notes[Math.floor(random() * notes.length)] + song.melodyOctave;
      this.schedulePluck(note, t, 0.08 + random() * 0.06, this.style === "piano" ? 0.18 : 0.28);
    }
  }

  scheduleChord(chord, time, duration, config, bar, velocity = 1) {
    if (this.style === "piano") {
      const pattern = [0, 2, 4, 2, 1, 3, 4, 2];
      const start = Math.floor(mulberry32(this.seed + bar)() * 2);
      chord.notes.forEach((note, index) => {
        const offset = this.stepDuration * (pattern[(index + start) % pattern.length] || 0);
        this.scheduleRhodes(note + 12, time + offset, duration * 0.45, 0.065 * velocity, 0.12);
      });
      return;
    }

    if (config.chordTone === "synth") {
      chord.notes.forEach((note, index) => {
        const strum = index * 0.004;
        const stab = Math.min(duration, this.stepDuration * 3.2);
        this.scheduleSynth(note, time + strum, stab, 0.055 * velocity);
      });
      return;
    }

    const padStyle = this.style === "ambient" || this.style === "deep-focus";
    chord.notes.forEach((note, index) => {
      const strum = index * (0.007 + (this.seed % 5) * 0.001);
      this.scheduleRhodes(
        note + (padStyle ? 12 : 0),
        time + strum,
        duration,
        (padStyle ? 0.045 : 0.075) * velocity,
        padStyle ? 0.28 : 0.2,
      );
    });
  }

  scheduleBarMelody(bar, chord, time, stepDuration, random) {
    const config = this.styleConfig;
    if (config.melody.length === 0) return;
    const density = this.song.melodyDensity;
    const phraseSeed = this.seed + bar * 73;
    const phraseRandom = mulberry32(phraseSeed);
    const phraseLength = 2 + Math.floor(phraseRandom() * 3);
    const rhythm = [];
    for (let i = 0; i < phraseLength; i += 1) {
      rhythm.push([0, 3, 6, 8, 10, 12, 14][Math.floor(phraseRandom() * 7)]);
    }
    rhythm.sort((a, b) => a - b);

    const usePluck = this.style !== "piano";
    for (const position of rhythm) {
      if (phraseRandom() > density + 0.15) continue;
      const note = chord.notes[Math.floor(phraseRandom() * chord.notes.length)] + this.song.melodyOctave;
      const offset = position * stepDuration;
      if (usePluck) {
        this.schedulePluck(note, time + offset, 0.32 + phraseRandom() * 0.4, 0.24);
      } else {
        this.scheduleRhodes(note, time + offset, stepDuration * 2.5, 0.08, 0.18);
      }
    }
  }

  connectVoice(node, reverbAmount = 0.15, delayAmount = 0) {
    const ctx = this.ctx;
    node.connect(this.tonalBus);
    if (reverbAmount > 0) {
      const send = ctx.createGain();
      send.gain.value = reverbAmount;
      node.connect(send);
      send.connect(this.reverbSend);
    }
    if (delayAmount > 0) {
      const send = ctx.createGain();
      send.gain.value = delayAmount;
      node.connect(send);
      send.connect(this.delaySend);
    }
  }

  scheduleRhodes(note, time, duration, velocity, reverb = 0.15) {
    const ctx = this.ctx;
    const frequency = midiToFreq(note);
    const carrier = ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.setValueAtTime(frequency, time);

    const modulator = ctx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.value = frequency * 2.01;
    const modulation = ctx.createGain();
    modulation.gain.value = frequency * (0.18 + velocity * 0.8);
    modulator.connect(modulation);
    modulation.connect(carrier.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1500 + velocity * 9000;
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    const peak = Math.max(0.003, velocity);
    const attack = 0.012;
    const release = Math.max(0.08, duration * 0.7);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(peak, time + attack);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0015, peak * 0.24), time + attack + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + release);

    carrier.connect(filter);
    filter.connect(gain);
    this.connectVoice(gain, reverb, 0.05);

    const stop = time + attack + release + 0.1;
    carrier.start(time);
    modulator.start(time);
    carrier.stop(stop);
    modulator.stop(stop);
  }

  scheduleSynth(note, time, duration, velocity) {
    const ctx = this.ctx;
    const frequency = midiToFreq(note);
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, time);
    const detuned = ctx.createOscillator();
    detuned.type = "sawtooth";
    detuned.frequency.setValueAtTime(frequency, time);
    detuned.detune.value = 8;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 1.1;
    filter.frequency.setValueAtTime(4200, time);
    filter.frequency.exponentialRampToValueAtTime(900, time + Math.min(0.32, duration));

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0015, velocity * 0.22), time + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.max(0.14, duration));

    osc.connect(filter);
    detuned.connect(filter);
    filter.connect(gain);
    this.connectVoice(gain, 0.1, 0.16);

    osc.start(time);
    detuned.start(time);
    osc.stop(time + Math.max(0.16, duration) + 0.05);
    detuned.stop(time + Math.max(0.16, duration) + 0.05);
  }

  scheduleBass(note, time, duration, velocity) {
    const ctx = this.ctx;
    const frequency = midiToFreq(note);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(frequency / 2, time);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(velocity * 0.45, time + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    const subGain = ctx.createGain();
    subGain.gain.value = 0.35;
    osc.connect(filter);
    sub.connect(subGain);
    subGain.connect(filter);
    filter.connect(gain);
    this.connectVoice(gain, 0.06, 0);
    osc.start(time);
    sub.start(time);
    osc.stop(time + duration + 0.05);
    sub.stop(time + duration + 0.05);
  }

  schedulePad(notes, time, duration, level) {
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(level * 0.035, time + Math.min(1.6, duration * 0.3));
    gain.gain.setValueAtTime(level * 0.035, time + duration * 0.65);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.3;
    filter.connect(gain);

    notes.forEach((note, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = midiToFreq(note);
      osc.detune.value = index % 2 === 0 ? -5 : 5;
      const voiceGain = ctx.createGain();
      voiceGain.gain.value = 0.16;
      osc.connect(voiceGain);
      voiceGain.connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.1);
    });
    this.connectVoice(gain, 0.45, 0.08);
  }

  schedulePluck(note, time, velocity, reverb = 0.28) {
    const ctx = this.ctx;
    const frequency = midiToFreq(note);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);
    const sine = ctx.createOscillator();
    sine.type = "sine";
    sine.frequency.setValueAtTime(frequency * 2, time);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, time);
    filter.frequency.exponentialRampToValueAtTime(900, time + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(velocity * 0.25, time + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);
    const sineGain = ctx.createGain();
    sineGain.gain.value = 0.25;
    osc.connect(filter);
    sine.connect(sineGain);
    sineGain.connect(filter);
    filter.connect(gain);
    this.connectVoice(gain, reverb, 0.22);
    osc.start(time);
    sine.start(time);
    osc.stop(time + 0.6);
    sine.stop(time + 0.6);
  }

  scheduleKick(time, velocity) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(43, time + 0.12);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.55, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
    osc.connect(gain);
    gain.connect(this.musicBus);
    const click = ctx.createBufferSource();
    click.buffer = this.noiseBuffer(0.04);
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = "lowpass";
    clickFilter.frequency.value = 1200;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.035, time);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);
    click.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.musicBus);
    osc.start(time);
    osc.stop(time + 0.36);
    click.start(time);

    if (this.styleConfig.pump && this.tonalBus) {
      const pump = this.tonalBus.gain;
      pump.setValueAtTime(1, time);
      pump.linearRampToValueAtTime(0.48, time + 0.012);
      pump.linearRampToValueAtTime(1, time + 0.22);
    }
  }

  scheduleSnare(time, velocity, brush = false) {
    const ctx = this.ctx;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(0.3);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = brush ? 2300 : 1800;
    filter.Q.value = brush ? 0.5 : 0.8;
    const gain = ctx.createGain();
    const attack = brush ? 0.035 : 0.004;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity * (brush ? 0.19 : 0.28), time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + (brush ? 0.36 : 0.18));
    noise.connect(filter);
    filter.connect(gain);
    this.connectVoice(gain, 0.18, 0);

    const body = ctx.createOscillator();
    body.type = "triangle";
    body.frequency.setValueAtTime(185, time);
    body.frequency.exponentialRampToValueAtTime(145, time + 0.1);
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(velocity * (brush ? 0.05 : 0.12), time);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
    body.connect(bodyGain);
    bodyGain.connect(this.musicBus);

    noise.start(time);
    noise.stop(time + 0.4);
    body.start(time);
    body.stop(time + 0.14);
  }

  scheduleHat(time, velocity, open = false) {
    const ctx = this.ctx;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(0.2);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 6900;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + (open ? 0.24 : 0.055));
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicBus);
    noise.start(time);
    noise.stop(time + (open ? 0.28 : 0.08));
  }

  scheduleRim(time, velocity) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 1900;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1900;
    filter.Q.value = 4;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicBus);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  chime() {
    if (!this.ctx || !this.playing) return;
    const now = this.ctx.currentTime + 0.05;
    [72, 76, 79, 84].forEach((note, index) => {
      const ctx = this.ctx;
      const time = now + index * 0.18;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = midiToFreq(note);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.09, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);
      osc.connect(gain);
      this.connectVoice(gain, 0.6, 0.2);
      osc.start(time);
      osc.stop(time + 1.9);
    });
  }

  async play() {
    await this.ensure();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.playing = true;
    if (this.nextStepTime < this.ctx.currentTime) {
      this.nextStepTime = this.ctx.currentTime + 0.06;
    }
  }

  async pause() {
    this.playing = false;
    if (this.ctx && this.ctx.state === "running") await this.ctx.suspend();
  }

  async toggle() {
    if (this.playing) await this.pause();
    else await this.play();
    return this.playing;
  }

  next(seed, { style = null, recipe = null } = {}) {
    if (style && STYLE_CONFIG[style]) {
      this.style = style;
      this.pendingStyle = null;
      this.styleConfig = STYLE_CONFIG[style];
    }
    this.recipe = recipe || null;
    this.seed = seed >>> 0;
    this.buildSong();
    this.step = 0;

    if (!this.ctx) {
      this.nextStepTime = 0;
      return;
    }
    if (!this.playing) {
      this.nextStepTime = 0;
      return;
    }

    // Fade the old track under, then drop the new one in on the next beat.
    const ctx = this.ctx;
    const now = ctx.currentTime;
    if (this.tonalBus) {
      this.tonalBus.gain.cancelScheduledValues(now);
      this.tonalBus.gain.setValueAtTime(1, now);
    }
    const target = Math.max(0.0001, curve(this.musicVol) * 0.92);
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setValueAtTime(
      Math.max(0.0001, this.musicBus.gain.value),
      now,
    );
    this.musicBus.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
    this.musicBus.gain.setValueAtTime(0.0001, now + 0.16);
    this.musicBus.gain.exponentialRampToValueAtTime(target, now + 0.34);
    this.nextStepTime = now + 0.17;
  }

  setStyle(style) {
    if (!STYLE_CONFIG[style] || style === this.style) {
      this.pendingStyle = null;
      return;
    }
    this.style = style;
    this.pendingStyle = style;
    if (!this.ctx) this.buildSong();
  }

  applyStyleNow(style) {
    if (!STYLE_CONFIG[style]) return;
    this.style = style;
    this.pendingStyle = null;
    this.buildSong();
    this.step = 0;
    this.nextStepTime = this.ctx ? this.ctx.currentTime + 0.1 : 0;
  }

  setWeather(weather) {
    this.weather = weather;
    this.applyWeatherLayers();
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (weather === "rain") {
        this.nextThunderAt = now + 5 + Math.random() * 9;
      }
      if (weather === "clear") this.nextCricketAt = now + 1.2 + Math.random() * 2.4;
    }
    if (this.ctx && this.playing) this.playWeatherTransition(weather);
  }

  setCitySounds(enabled) {
    this.citySounds = enabled;
    if (!this.ctx) return;
    const target = enabled ? curve(this.ambienceVol) * 0.95 : 0;
    this.ambienceBus.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  setMusicVolume(value) {
    this.musicVol = value;
    if (this.ctx) {
      this.musicBus.gain.setTargetAtTime(curve(value) * 0.92, this.ctx.currentTime, 0.05);
    }
  }

  setAmbienceVolume(value) {
    this.ambienceVol = value;
    if (this.ctx) {
      const target = this.citySounds ? curve(value) * 0.95 : 0;
      this.ambienceBus.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (!this.ctx) return;
    this.master.gain.setTargetAtTime(muted ? 0 : 0.72, this.ctx.currentTime, 0.04);
  }
}
