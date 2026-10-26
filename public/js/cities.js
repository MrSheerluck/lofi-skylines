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
  {
    id: "istanbul",
    name: "Istanbul",
    subtitle: "Ferries on the Bosphorus",
    timeZone: "Europe/Istanbul",
    defaultWeather: "breeze",
    accent: "#f0b681",
    accentSoft: "rgba(240, 182, 129, 0.16)",
    tag: "Breeze",
    intro:
      "A call to prayer drifts over the water, gulls turn above the ferry lights, and the old city keeps one eye open across the Bosphorus.",
    guide: {
      title: "Istanbul, after sunset",
      places: [
        ["Karaköy", "Ferry docks, fish sandwiches and a view across the water."],
        ["Balat", "Coloured houses, steep lanes and a very good bakery."],
        ["Çamlıca Hill", "The whole city and both continents, if the night is clear."],
      ],
      footer: "Take the ferry. The long way is the point.",
      maps: "https://www.openstreetmap.org/search?query=Istanbul",
    },
  },
  {
    id: "cairo",
    name: "Cairo",
    subtitle: "Ramadan by the pyramids",
    timeZone: "Africa/Cairo",
    defaultWeather: "clear",
    accent: "#f3cf82",
    accentSoft: "rgba(243, 207, 130, 0.16)",
    tag: "Clear",
    intro:
      "Lanterns string the rooftops and the pyramids hold their light long after the city has eaten. A warm dust settles over everything.",
    guide: {
      title: "Cairo, after iftar",
      places: [
        ["Zamalek", "Quiet streets, old villas and a café on the Nile."],
        ["Khan el-Khalili", "Lanterns, mint tea and a maze that is the point."],
        ["Giza plateau", "The pyramids at the edge of the city, best just after sunrise."],
      ],
      footer: "Everything is louder, warmer and later here.",
      maps: "https://www.openstreetmap.org/search?query=Cairo",
    },
  },
  {
    id: "singapore",
    name: "Singapore",
    subtitle: "Rain over Marina Bay",
    timeZone: "Asia/Singapore",
    defaultWeather: "rain",
    accent: "#7fe6dc",
    accentSoft: "rgba(127, 230, 220, 0.16)",
    tag: "Rain",
    intro:
      "The bay turns into a mirror and the towers wear the rain like neon. Somewhere above, the sky park glows through the cloud.",
    guide: {
      title: "Singapore, in the rain",
      places: [
        ["Marina Bay", "The boardwalk, the skyline and a late-night kaya toast."],
        ["Tiong Bahru", "Low-rise art deco blocks, bookshops and coffee."],
        ["Kampong Glam", "Mural lanes, fabric shops and the mosque at dusk."],
      ],
      footer: "The rain is warm. Keep walking.",
      maps: "https://www.openstreetmap.org/search?query=Singapore",
    },
  },
  {
    id: "sydney",
    name: "Sydney",
    subtitle: "Sails on the harbour",
    timeZone: "Australia/Sydney",
    defaultWeather: "clear",
    accent: "#8fc7ff",
    accentSoft: "rgba(143, 199, 255, 0.16)",
    tag: "Clear",
    intro:
      "The opera house glows at the end of the quay and the harbour bridge holds up a sky full of stars. A ferry cuts home through the dark water.",
    guide: {
      title: "Sydney, on the water",
      places: [
        ["Circular Quay", "Ferries, buskers and the best cheap view in the city."],
        ["The Rocks", "Old pubs, sandstone lanes and the market on weekends."],
        ["Watsons Bay", "A ferry ride, a cliff walk and fish and chips at the end."],
      ],
      footer: "Catch the last ferry. It is worth the walk.",
      maps: "https://www.openstreetmap.org/search?query=Sydney",
    },
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    subtitle: "Lights on the canal",
    timeZone: "Europe/Amsterdam",
    defaultWeather: "fog",
    accent: "#f1a45c",
    accentSoft: "rgba(241, 164, 92, 0.16)",
    tag: "Fog",
    intro:
      "Bicycles hiss past the canal houses and every window holds a small orange lamp. The water keeps the city upside down until morning.",
    guide: {
      title: "Amsterdam, late",
      places: [
        ["Jordaan", "Narrow streets, brown cafés and a canal at every corner."],
        ["De Pijp", "The market, a bakery and a very slow second coffee."],
        ["NDSM Wharf", "A ferry, a warehouse and whatever is on tonight."],
      ],
      footer: "Mind the bikes. Then mind them again.",
      maps: "https://www.openstreetmap.org/search?query=Amsterdam",
    },
  },
  {
    id: "bangkok",
    name: "Bangkok",
    subtitle: "Long-tail boats at midnight",
    timeZone: "Asia/Bangkok",
    defaultWeather: "clear",
    accent: "#ffc46b",
    accentSoft: "rgba(255, 196, 107, 0.16)",
    tag: "Clear",
    intro:
      "The temple glows gold across the river while the last long-tail boat cuts home. Street food smoke, motorbikes and a warm, wet sky.",
    guide: {
      title: "Bangkok, after dark",
      places: [
        ["Wat Arun", "The temple across the river, best seen from a rooftop."],
        ["Yaowarat", "Chinatown after midnight: noodles, neon and smoke."],
        ["Talad Noi", "Old shophouses, engine parts and a tiny coffee bar."],
      ],
      footer: "The city is still eating. Join it.",
      maps: "https://www.openstreetmap.org/search?query=Bangkok",
    },
  },
  {
    id: "dubai",
    name: "Dubai",
    subtitle: "Fountains under the Burj",
    timeZone: "Asia/Dubai",
    defaultWeather: "clear",
    accent: "#8fd6ff",
    accentSoft: "rgba(143, 214, 255, 0.16)",
    tag: "Clear",
    intro:
      "The tallest thing you have ever seen disappears into a warm haze. Below it, the fountains keep time and the desert waits just past the lights.",
    guide: {
      title: "Dubai, after the heat",
      places: [
        ["Dubai Fountain", "Every half hour, a short and very large spectacle."],
        ["Al Fahidi", "Wind-tower lanes, a museum and a quiet courtyard."],
        ["Jumeirah", "The beach at dusk, with the skyline turning on behind you."],
      ],
      footer: "Walk beside the water. It is cooler there.",
      maps: "https://www.openstreetmap.org/search?query=Dubai",
    },
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    subtitle: "Harbour lights and rain",
    timeZone: "Asia/Hong_Kong",
    defaultWeather: "rain",
    accent: "#ff8da1",
    accentSoft: "rgba(255, 141, 161, 0.16)",
    tag: "Rain",
    intro:
      "The harbour is a bowl of neon and the Peak disappears into cloud. A red-sailed junk crosses the ferry lanes while the rain keeps everyone close.",
    guide: {
      title: "Hong Kong, in the rain",
      places: [
        ["Tsim Sha Tsui", "The promenade, the skyline and the Star Ferry."],
        ["Sheung Wan", "Dried seafood, coffee shops and steep old lanes."],
        ["Victoria Peak", "Go up for the view; stay for the cloud coming in."],
      ],
      footer: "The Star Ferry is still the best commute.",
      maps: "https://www.openstreetmap.org/search?query=Hong%20Kong",
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
