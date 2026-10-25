const TITLES = {
  tokyo: {
    rain: [
      "Rain on the Yamanote",
      "Last train, first umbrella",
      "Plastic umbrella blues",
      "Vending machine at 3 a.m.",
      "Neon in a paper cup",
      "The 7-Eleven light",
      "Shibuya, still awake",
      "A cat under the awning",
      "Wet socks, warm cans",
      "Karaoke on the fourth floor",
    ],
    snow: [
      "Snow on the Yamanote",
      "Quiet vending machine",
      "White breath in Shinjuku",
      "A scarf for the tower",
      "Footprints to the station",
      "The city under a duvet",
      "Snowflakes on the arcade",
    ],
    clear: [
      "Tokyo Tower hum",
      "Sakura in the gutter",
      "Midnight ramen",
      "A bicycle bell at 2 a.m.",
      "Warm asphalt",
      "The last lantern",
      "Windows full of weather",
    ],
  },
  paris: {
    rain: [
      "Wet zinc rooftops",
      "A very small umbrella",
      "The métro is closing",
      "Rain on Rue Cler",
      "Café lights on the corner",
      "A bicycle in the rain",
      "The river keeps walking",
    ],
    snow: [
      "Snow on the zinc",
      "A quieter Eiffel",
      "White rooftops, warm windows",
      "The Boulangerie at dawn",
      "Snow on the Seine",
      "Two chairs under the awning",
    ],
    clear: [
      "Last métro home",
      "Blue hour, slowly",
      "The tower sparkles",
      "Chestnut smoke",
      "A bistro with one light on",
      "Saint-Germain after midnight",
      "The Seine, holding the lamps",
    ],
  },
  "new-york": {
    rain: [
      "Rain on the bridge",
      "A cab with its wipers on",
      "Steam on Delancey",
      "The F train lullaby",
      "Wet brownstone",
      "Bodega window glow",
      "The city rinses itself",
    ],
    snow: [
      "Snow on the bridge",
      "Brooklyn, 3 a.m.",
      "Salt on the sidewalk",
      "The East River goes quiet",
      "A warm window in the cold",
      "Suspension cable lullaby",
      "Snow on the promenade",
    ],
    clear: [
      "The bridge keeps its lights on",
      "A train under the river",
      "Rooftop water tower",
      "Late walk, long shadow",
      "Manhattan in the distance",
      "A bench with a view",
    ],
  },
};

const FALLBACK = [
  "The city keeps a light on",
  "A window, still warm",
  "Night bus home",
  "Small hours, soft rain",
  "The last song before sleep",
];

export const STYLES = {
  jazzhop: { id: "jazzhop", label: "Jazzhop", bpm: 76, blurb: "Dusty Rhodes and a swung beat" },
  piano: { id: "piano", label: "Felt piano", bpm: 67, blurb: "Soft keys and brushed drums" },
  ambient: { id: "ambient", label: "Ambient", bpm: 56, blurb: "Warm pads, barely a beat" },
};

function pick(list, random) {
  return list[Math.floor(random() * list.length) % list.length];
}

export function makeTrack(cityId, weather, styleId, seed = Date.now()) {
  const cityTitles = TITLES[cityId] || {};
  const titles = cityTitles[weather] || cityTitles.clear || FALLBACK;
  const random = mulberry32(seed);
  const style = STYLES[styleId] || STYLES.jazzhop;
  const title = pick(titles, random);
  return {
    title,
    seed: Math.floor(random() * 1e9),
    style,
    subtitle: `${style.label.toLowerCase()} · ${style.bpm} bpm · generated live`,
  };
}

export function makeQueue(cityId, weather, styleId, seed, count = 4) {
  const cityTitles = TITLES[cityId] || {};
  const titles = cityTitles[weather] || cityTitles.clear || FALLBACK;
  const random = mulberry32(seed + 17);
  const style = STYLES[styleId] || STYLES.jazzhop;
  const queue = [];
  const used = new Set();
  for (let i = 0; i < count; i += 1) {
    let title = pick(titles, random);
    let attempts = 0;
    while (used.has(title) && attempts < 6) {
      title = pick(titles, random);
      attempts += 1;
    }
    used.add(title);
    queue.push({
      title,
      seed: Math.floor(random() * 1e9),
      subtitle: `${style.label.toLowerCase()} · ${style.bpm} bpm`,
    });
  }
  return queue;
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
