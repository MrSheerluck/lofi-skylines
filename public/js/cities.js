export const CITIES = [
  {
    id: "tokyo",
    name: "Tokyo",
    subtitle: "Neon rain in Shinjuku",
    timeZone: "Asia/Tokyo",
    defaultWeather: "rain",
    accent: "#ff7ac8",
    accentSoft: "rgba(255, 122, 200, 0.16)",
    tag: "Rain",
    intro:
      "The last train has gone, but the arcade lights are still on. Rain threads past the tower and every puddle keeps a little neon.",
    guide: {
      title: "Tokyo, after rain",
      places: [
        ["Shinjuku Gyoen", "A quiet garden under the towers — go at opening time."],
        ["Omoide Yokocho", "Six-seat yakitori bars under a tangle of cables and smoke."],
        ["Kichijōji", "Bookshops, jazz cafés and a park made for a slow afternoon."],
      ],
      footer: "Shibuya, Shinjuku and a train that never quite leaves.",
      maps: "https://www.openstreetmap.org/search?query=Tokyo",
    },
  },
  {
    id: "paris",
    name: "Paris",
    subtitle: "The last métro over the Seine",
    timeZone: "Europe/Paris",
    defaultWeather: "rain",
    accent: "#f5c06e",
    accentSoft: "rgba(245, 192, 110, 0.16)",
    tag: "Rain",
    intro:
      "Blue hour lingers over the zinc roofs. The tower sparkles on the hour and the river carries the last warm windows home.",
    guide: {
      title: "Paris, blue hour",
      places: [
        ["Rue Cler", "A market street worth waking up early for."],
        ["Musée de l'Orangerie", "Two oval rooms, water lilies, no rush."],
        ["Butte-aux-Cailles", "Low roofs, small bars, and the best corner boulangerie."],
      ],
      footer: "A city that looks best from a bridge, slightly late.",
      maps: "https://www.openstreetmap.org/search?query=Paris",
    },
  },
  {
    id: "new-york",
    name: "New York",
    subtitle: "Snow on the Brooklyn Bridge",
    timeZone: "America/New_York",
    defaultWeather: "snow",
    accent: "#8ecdf7",
    accentSoft: "rgba(142, 205, 247, 0.16)",
    tag: "Snow",
    intro:
      "Snow hushes the bridge and the skyline keeps its lights on for you. Somewhere below, a train crosses and a bodega stays open.",
    guide: {
      title: "Brooklyn, in snow",
      places: [
        ["Brooklyn Heights Promenade", "The skyline, the bridge, and a bench out of the wind."],
        ["Cafe Mogador", "Warm Moroccan food and a window full of snow."],
        ["Books Are Magic", "A small bookshop that makes the walk worth it."],
      ],
      footer: "Take the F train home. The bridge will still be there.",
      maps: "https://www.openstreetmap.org/search?query=Brooklyn%20Bridge",
    },
  },
  {
    id: "london",
    name: "London",
    subtitle: "Fog on the Thames",
    timeZone: "Europe/London",
    defaultWeather: "fog",
    accent: "#b7cfe3",
    accentSoft: "rgba(183, 207, 227, 0.16)",
    tag: "Fog",
    intro:
      "The river vanishes into the fog and the clock keeps its own time. A red bus mutters past the lamps while the city settles into the damp.",
    guide: {
      title: "London, in the fog",
      places: [
        ["Tate Modern", "Free galleries, a turbine hall, and a walk along the river."],
        ["Borough Market", "An early lunch worth standing in the drizzle for."],
        ["Hampstead Heath", "A hill, a view, and enough trees to forget the road."],
      ],
      footer: "The last Tube is later than you think.",
      maps: "https://www.openstreetmap.org/search?query=London",
    },
  },
  {
    id: "seoul",
    name: "Seoul",
    subtitle: "Neon below Namsan",
    timeZone: "Asia/Seoul",
    defaultWeather: "clear",
    accent: "#ff9fc4",
    accentSoft: "rgba(255, 159, 196, 0.16)",
    tag: "Clear",
    intro:
      "The tower changes colour above a city that never quite sleeps. Lanterns, coffee shops and one more late bus home.",
    guide: {
      title: "Seoul, after dark",
      places: [
        ["Namsan Seoul Tower", "A slow walk up, then the whole city at your feet."],
        ["Ikseon-dong", "Narrow alleys, old hanoks and tiny cafés."],
        ["Banpo Hangang Park", "The river, the bridge lights and a convenience-store picnic."],
      ],
      footer: "There is always one more convenience store.",
      maps: "https://www.openstreetmap.org/search?query=Seoul",
    },
  },
  {
    id: "rio",
    name: "Rio",
    subtitle: "Christ the Redeemer after dark",
    timeZone: "America/Sao_Paulo",
    defaultWeather: "breeze",
    accent: "#8fe3b0",
    accentSoft: "rgba(143, 227, 176, 0.16)",
    tag: "Breeze",
    intro:
      "The statue keeps watch over the bay while the city turns on its lights below. Salt air, distant music and a warm wind off the water.",
    guide: {
      title: "Rio, at night",
      places: [
        ["Copacabana", "A long walk on the sand, with the city glowing behind you."],
        ["Santa Teresa", "Steep streets, old trams and a bar with no closing time."],
        ["Pão de Açúcar", "The last cable car up, when the bay turns to velvet."],
      ],
      footer: "The mountain will still be there in the morning.",
      maps: "https://www.openstreetmap.org/search?query=Rio%20de%20Janeiro",
    },
  },
];

export const CITY_BY_ID = Object.fromEntries(CITIES.map((city) => [city.id, city]));

export function getCity(id) {
  return CITY_BY_ID[id] || CITIES[0];
}

export function nextCity(id, direction = 1) {
  const index = CITIES.findIndex((city) => city.id === id);
  const next = (index + direction + CITIES.length) % CITIES.length;
  return CITIES[next];
}
