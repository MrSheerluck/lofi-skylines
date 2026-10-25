import { STYLES } from "./titles.js";

export const CATEGORIES = [
  {
    id: "lofi",
    label: "Lo-fi",
    short: "Lo-fi",
    blurb: "Warm keys, dusty drums, unhurried nights.",
  },
  {
    id: "focus",
    label: "Deep Focus",
    short: "Focus",
    blurb: "Slow pads, soft bells, and room to think.",
  },
  {
    id: "edm",
    label: "Focused EDM",
    short: "EDM",
    blurb: "A clean pulse, an arpeggio, and forward motion.",
  },
];

const TRACK_DEFS = [
  // ---------------------------------------------------------------- lo-fi
  {
    category: "lofi",
    tracks: [
      ["Rain on the Yamanote", "jazzhop", 0, 0, 76, 0.17, 0.6, 12],
      ["Wet Socks, Warm Cans", "jazzhop", 3, 2, 78, 0.19, 0.55, 12],
      ["Blue Hour, Slowly", "piano", 0, 0, 67, 0.08, 0.55, 12],
      ["Last Métro Home", "bossa", 1, -2, 86, 0.05, 0.6, 12],
      ["Bodega Window Glow", "jazzhop", 1, -3, 72, 0.21, 0.6, 12],
      ["Snow on the Bridge", "piano", 2, 2, 64, 0.09, 0.5, 12],
      ["Paper Lanterns", "bossa", 2, 3, 88, 0.06, 0.65, 12],
      ["A Table for One", "jazzhop", 2, -1, 74, 0.16, 0.55, 24],
      ["Café Lights on the Corner", "bossa", 0, 1, 84, 0.05, 0.6, 12],
      ["Almost Dawn", "piano", 1, -3, 62, 0.1, 0.45, 12],
    ],
  },
  // ------------------------------------------------------------- deep focus
  {
    category: "focus",
    tracks: [
      ["Long Exhale", "deep-focus", 0, 0, 58, 0, 0.3, 24],
      ["Deep Work", "deep-focus", 1, -2, 60, 0, 0.28, 24],
      ["Slow Current", "ambient", 0, 0, 54, 0, 0.25, 24],
      ["Blue Light", "deep-focus", 2, 2, 62, 0, 0.3, 24],
      ["Quiet Engine", "ambient", 1, -3, 52, 0, 0.22, 24],
      ["Terminal at 4 a.m.", "deep-focus", 1, 3, 56, 0, 0.3, 24],
      ["Paper and Ink", "piano", 0, -1, 60, 0.06, 0.4, 12],
      ["No Notifications", "ambient", 0, 2, 50, 0, 0.2, 24],
      ["Soft Deadline", "deep-focus", 2, -1, 64, 0, 0.32, 24],
      ["One Thing at a Time", "piano", 2, 1, 58, 0.06, 0.35, 12],
    ],
  },
  // ---------------------------------------------------------- focused edm
  {
    category: "edm",
    tracks: [
      ["Locked In", "focus-edm", 0, 0, 122, 0, 0.35, 24, 2],
      ["Clean Build", "focus-edm", 1, -2, 124, 0, 0.3, 24, 2],
      ["Flow State", "house", 1, 1, 114, 0, 0.35, 24],
      ["Neon Sprint", "focus-edm", 2, 2, 126, 0, 0.4, 24, 2],
      ["Pulse Width", "synth", 0, -3, 104, 0, 0.4, 24],
      ["Deadline Drive", "house", 2, 0, 112, 0, 0.32, 24],
      ["Night Shift", "focus-edm", 3, -1, 120, 0, 0.35, 24, 2],
      ["Full Stack", "synth", 1, 2, 108, 0, 0.4, 24],
      ["Momentum", "house", 3, -2, 116, 0, 0.35, 24],
      ["Ship It", "focus-edm", 0, 1, 128, 0, 0.4, 24, 2],
    ],
  },
];

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export const CATALOG = TRACK_DEFS.flatMap((group) => {
  const category = CATEGORIES.find((item) => item.id === group.category);
  return group.tracks.map((definition) => {
    const [
      title,
      styleId,
      progressionIndex,
      transpose,
      bpm,
      swing,
      density,
      octave,
      arpInterval,
    ] = definition;
    const style = STYLES[styleId] || STYLES.jazzhop;
    const id = slugify(title);
    return {
      id,
      title,
      category: category.id,
      categoryLabel: category.label,
      style: styleId,
      styleLabel: style.label,
      bpm,
      seed: hashString(`${category.id}:${title}`),
      recipe: {
        progressionIndex,
        transpose,
        bpm,
        swing,
        density,
        octave,
        ...(arpInterval ? { arpInterval } : {}),
      },
      duration: (60 / bpm) * 4 * 32,
      get durationLabel() {
        return formatDuration(this.duration);
      },
      get subtitle() {
        return `${category.label} · ${style.label} · ${bpm} bpm`;
      },
    };
  });
});

export const TRACK_BY_ID = Object.fromEntries(CATALOG.map((track) => [track.id, track]));

export function getTrack(id) {
  return TRACK_BY_ID[id] || null;
}

export function tracksInCategory(category) {
  return CATALOG.filter((track) => track.category === category);
}

export function tracksForFilter(filter) {
  return filter === "all" ? CATALOG : tracksInCategory(filter);
}

export function categoryTrack(track) {
  return tracksInCategory(track.category);
}

export function nextTrackInCategory(track) {
  const tracks = categoryTrack(track);
  const index = tracks.findIndex((item) => item.id === track.id);
  return tracks[(index + 1) % tracks.length];
}

export function upcomingTracks(track, count = 4) {
  const tracks = categoryTrack(track);
  const index = tracks.findIndex((item) => item.id === track.id);
  return Array.from({ length: Math.min(count, tracks.length - 1) }, (_, offset) => {
    return tracks[(index + offset + 1) % tracks.length];
  });
}

export function trackIndex(track) {
  return CATALOG.findIndex((item) => item.id === track?.id);
}

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]));
