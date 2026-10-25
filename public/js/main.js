import { CITIES, CITY_BY_ID, getCity, nextCity } from "./cities.js";
import { Scene } from "./scene.js";
import { LofiEngine } from "./audio.js";
import { STYLES } from "./titles.js";
import {
  CATALOG,
  CATEGORIES,
  RADIO_ORDER,
  getTrack,
  nextTrackInCatalog,
  nextTrackInCategory,
  trackIndex,
  tracksForFilter,
  upcomingCatalogTracks,
  upcomingTracks,
} from "./catalog.js";
import { drawPreview } from "./scenes.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const WEATHERS = [
  {
    id: "clear",
    label: "Clear",
    chip: "clear",
    icon: "#i-weather-clear",
    blurb: "Stars, a low city hum and clear-night crickets.",
  },
  {
    id: "rain",
    label: "Rain",
    chip: "rain",
    icon: "#i-weather-rain",
    blurb: "Rain on the glass, close patter and distant thunder.",
  },
  {
    id: "storm",
    label: "Storm",
    chip: "storm",
    icon: "#i-weather-storm",
    blurb: "Heavy rain, wind and thunder rolling through the towers.",
  },
  {
    id: "snow",
    label: "Snow",
    chip: "snow",
    icon: "#i-weather-snow",
    blurb: "Soft snow, gusting wind and a hush over the street.",
  },
  {
    id: "breeze",
    label: "Breeze",
    chip: "breeze",
    icon: "#i-weather-breeze",
    blurb: "Moving air, leaves turning over and a light rustle.",
  },
  {
    id: "fall",
    label: "Autumn",
    chip: "autumn",
    icon: "#i-weather-fall",
    blurb: "Dry leaves, a cool wind and the sound of October.",
  },
  {
    id: "fog",
    label: "Fog",
    chip: "fog",
    icon: "#i-weather-fog",
    blurb: "Low fog, muffled streets and a soft low hum.",
  },
];
const WEATHER_BY_ID = Object.fromEntries(WEATHERS.map((weather) => [weather.id, weather]));
const WEATHER_CYCLE = ["rain", "storm", "snow", "breeze", "fall", "fog", "clear"];
const WEATHER_LABEL = Object.fromEntries(WEATHERS.map((weather) => [weather.id, weather.chip]));
const TRACK_BARS = 32;
const TOUR_DELAY = 90_000;
const RADIO_SLOT_MS = 2 * 60 * 1000;

const KEYS = {
  city: "lofi-skylines.city",
  track: "lofi-skylines.track",
  weather: "lofi-skylines.weather",
  music: "lofi-skylines.music",
  ambience: "lofi-skylines.ambience",
  sounds: "lofi-skylines.sounds",
};

function read(key, fallback = "") {
  try {
    const value = localStorage.getItem(key);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* Private mode or storage disabled. */
  }
}

function initialCity() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (CITY_BY_ID[hash]) return CITY_BY_ID[hash];
  const saved = read(KEYS.city);
  return CITY_BY_ID[saved] || CITIES[0];
}

const firstCity = initialCity();
const savedWeather = read(KEYS.weather);
const initialTrack = getTrack(read(KEYS.track)) || CATALOG[0];

const state = {
  city: firstCity.id,
  weather: WEATHER_BY_ID[savedWeather] ? savedWeather : firstCity.defaultWeather,
  weatherOverridden: Boolean(WEATHER_BY_ID[savedWeather]),
  style: initialTrack.style,
  citySounds: read(KEYS.sounds, "1") !== "0",
  muted: false,
  playing: false,
  started: false,
  radio: false,
  tour: false,
  tourTimer: 0,
  track: initialTrack,
  queue: upcomingTracks(initialTrack, 4),
  libraryFilter: "all",
  trackTimer: 0,
  trackEndAt: 0,
  trackRemaining: 0,
  musicVol: clampNumber(Number(read(KEYS.music, "72")), 0, 100, 72),
  ambienceVol: clampNumber(Number(read(KEYS.ambience, "55")), 0, 100, 55),
  timer: {
    minutes: 25,
    total: 25 * 60,
    remaining: 25 * 60,
    running: false,
    endAt: 0,
    interval: 0,
  },
};

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

const scene = new Scene($("#scene"));
const audio = new LofiEngine();

scene.setCity(state.city);
scene.setWeather(state.weather);
scene.start();

audio.style = state.track.style;
audio.seed = state.track.seed;
audio.recipe = state.track.recipe;
audio.weather = state.weather;
audio.musicVol = state.musicVol / 100;
audio.ambienceVol = state.ambienceVol / 100;
audio.citySounds = state.citySounds;
audio.buildSong();

const els = {
  cityName: $("#cityName"),
  citySub: $("#citySub"),
  cityChip: $("#cityChip"),
  cityChipTime: $("#cityChipTime"),
  localTime: $("#localTime span"),
  weatherIcon: $("#weatherIcon use"),
  weatherState: $("#weatherState"),
  weatherBtn: $("#weatherBtn"),
  weatherGrid: $("#weatherGrid"),
  soundsBtn: $("#soundsBtn"),
  soundsState: $("#soundsState"),
  radioBtn: $("#radioBtn"),
  radioState: $("#radioState"),
  tourBtn: $("#tourBtn"),
  tourState: $("#tourState"),
  liveText: $("#liveText"),
  trackTitle: $("#trackTitle"),
  trackSub: $("#trackSub"),
  playBtn: $("#playBtn"),
  musicVol: $("#musicVol"),
  ambienceVol: $("#ambienceVol"),
  musicVolIcon: $("#musicVolIcon use"),
  timerBadge: $("#timerBadge"),
  timerClock: $("#timerClock"),
  timerStart: $("#timerStart"),
  cityGrid: $("#cityGrid"),
  libraryTabs: $("#libraryTabs"),
  songList: $("#songList"),
  toast: $("#toast"),
  player: $("#player"),
  body: document.body,
};

const dialogs = {
  cities: $("#citiesDialog"),
  weather: $("#weatherDialog"),
  library: $("#libraryDialog"),
  queue: $("#queueDialog"),
  timer: $("#timerDialog"),
  help: $("#helpDialog"),
  guide: $("#guideDialog"),
  about: $("#aboutDialog"),
};

const timeFormatters = new Map();
function timeInZone(timeZone) {
  if (!timeFormatters.has(timeZone)) {
    timeFormatters.set(
      timeZone,
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
      }),
    );
  }
  return timeFormatters.get(timeZone).format(new Date());
}

let toastTimeout = 0;
function showToast(message, duration = 2600) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, duration);
}

function updateClock() {
  const city = getCity(state.city);
  const time = timeInZone(city.timeZone);
  els.localTime.textContent = `${time} local time`;
  els.cityChipTime.textContent = time;
  const cards = $$(".city-card", els.cityGrid);
  cards.forEach((card) => {
    const cardCity = getCity(card.dataset.city);
    const cardTime = $(".city-card-time", card);
    if (cardTime) cardTime.textContent = timeInZone(cardCity.timeZone);
  });
}

function updateMeta() {
  const city = getCity(state.city);
  const title = state.started
    ? `${state.track?.title || city.name} — ${city.name} · Lofi Skylines`
    : `${city.name} — Lofi Skylines`;
  document.title = title;
  const description = `${city.intro} Pixel-art nights, endless lofi.`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", description);
}

function updateAccent() {
  const city = getCity(state.city);
  document.documentElement.style.setProperty("--city-accent", city.accent);
  document.documentElement.style.setProperty("--city-accent-soft", city.accentSoft);
}

function applyCityUI() {
  const city = getCity(state.city);
  els.cityName.textContent = city.name;
  els.citySub.textContent = city.subtitle;
  els.cityChip.textContent = city.name;
  updateAccent();
  updateClock();
  fillGuide();
  updateMeta();
}

function updateWeatherUI() {
  const weather = WEATHER_BY_ID[state.weather] || WEATHERS[0];
  els.weatherIcon.setAttribute("href", weather.icon);
  els.weatherState.textContent = weather.chip;
  els.weatherBtn.setAttribute("aria-label", `Weather: ${weather.label}. Change weather`);
  els.weatherBtn.title = `Weather: ${weather.label} (W)`;
  renderWeatherGrid();
}

function updateSoundsUI() {
  els.soundsBtn.setAttribute("aria-pressed", String(state.citySounds));
  els.soundsState.textContent = state.citySounds ? "on" : "off";
  els.soundsBtn.title = state.citySounds
    ? "Weather & city sounds on (A)"
    : "Weather & city sounds off (A)";
}

function updateRadioUI() {
  els.radioBtn.classList.toggle("is-active", state.radio);
  els.radioBtn.setAttribute("aria-pressed", String(state.radio));
  els.radioState.textContent = state.radio
    ? state.playing
      ? "On air"
      : "Radio on"
    : "Radio off";
  els.radioBtn.title = state.radio
    ? "Turn off Lofi Skylines Radio (O)"
    : "Tune in to Lofi Skylines Radio (O)";
}

function updateTourUI() {
  els.tourBtn.setAttribute("aria-pressed", String(state.tour));
  els.tourState.textContent = state.tour ? "on" : "off";
  els.tourBtn.title = state.tour ? "City tour on — a new city every 90 seconds" : "City tour off";
}

function updatePlayUI() {
  els.body.classList.toggle("is-playing", state.playing);
  els.playBtn.setAttribute("aria-pressed", String(state.playing));
  els.playBtn.setAttribute("aria-label", state.playing ? "Pause music" : "Play music");
  els.liveText.textContent = "1 here now · all night";
  updateRadioUI();
  updateTrackUI();
  updateMediaSession();
}

function updateTrackUI() {
  if (!state.started) {
    els.trackTitle.textContent = "Press play for 30 generated tracks";
    els.trackSub.textContent = "lo-fi · deep focus · focused EDM";
  } else {
    const style = STYLES[state.track.style] || STYLES.jazzhop;
    els.trackTitle.textContent = state.track.title;
    els.trackSub.textContent = state.playing
      ? `${state.track.subtitle} · ${state.track.durationLabel}`
      : `paused · ${state.track.categoryLabel} · ${style.label} · ${state.track.bpm} bpm`;
  }
  updateMeta();
  if (dialogs.queue.open) renderQueue();
  if (dialogs.library.open) updateLibraryActive();
}

function setMediaMetadata() {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.track?.title || "Lofi Skylines",
      artist: "Lofi Skylines",
      album: state.track
        ? `${state.track.categoryLabel} · ${state.track.styleLabel}`
        : "30 generated tracks",
    });
    navigator.mediaSession.playbackState = state.playing ? "playing" : "paused";
  } catch {
    /* Older browsers. */
  }
}

function updateMediaSession() {
  if (!("mediaSession" in navigator)) return;
  try {
    setMediaMetadata();
    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack());
    navigator.mediaSession.setActionHandler("previoustrack", () => previousCity());
  } catch {
    /* Unsupported media action. */
  }
}

function trackDurationMs() {
  return Math.round((60 / (state.track?.bpm || 76)) * 4 * TRACK_BARS * 1000);
}

function clearTrackTimer() {
  if (state.trackTimer) {
    window.clearTimeout(state.trackTimer);
    state.trackTimer = 0;
  }
  state.trackEndAt = 0;
}

function armTrackTimer(ms = state.trackRemaining || trackDurationMs()) {
  clearTrackTimer();
  state.trackRemaining = Math.max(1000, ms);
  state.trackEndAt = Date.now() + state.trackRemaining;
  state.trackTimer = window.setTimeout(() => {
    state.trackTimer = 0;
    state.trackEndAt = 0;
    state.trackRemaining = trackDurationMs();
    nextTrack({ auto: true });
  }, state.trackRemaining);
}

function pauseTrackTimer() {
  if (state.trackEndAt) {
    state.trackRemaining = Math.max(1000, state.trackEndAt - Date.now());
  }
  clearTrackTimer();
}

function playCatalogTrack(track, { auto = false, start = false } = {}) {
  state.track = track;
  state.style = track.style;
  state.queue = state.radio ? upcomingCatalogTracks(track, 4) : upcomingTracks(track, 4);
  state.trackRemaining = trackDurationMs();
  write(KEYS.track, track.id);

  audio.next(track.seed, { style: track.style, recipe: track.recipe });

  updateTrackUI();
  updateMediaSession();
  if (state.playing) armTrackTimer();
  else clearTrackTimer();

  if (auto) showToast(`Now playing · ${track.title}`, 2400);
  else if (state.playing) showToast(`Playing · ${track.title}`, 2200);
  else showToast(`Ready · ${track.title}`, 2000);

  if (start && !state.playing) togglePlay();
}

function setWeather(weather, { persist = true, silent = false } = {}) {
  if (!WEATHER_BY_ID[weather]) return;
  state.weather = weather;
  scene.setWeather(weather);
  audio.setWeather(weather);
  if (persist) {
    state.weatherOverridden = true;
    write(KEYS.weather, weather);
  }
  updateWeatherUI();
  renderCityGrid();
  if (!silent) showToast(`Weather · ${WEATHER_BY_ID[weather].label}`);
}

function cycleWeather() {
  const index = WEATHER_CYCLE.indexOf(state.weather);
  const next = WEATHER_CYCLE[(index + 1) % WEATHER_CYCLE.length];
  setWeather(next, { persist: true });
}

function setCitySounds(enabled, { silent = false } = {}) {
  state.citySounds = enabled;
  audio.setCitySounds(enabled);
  write(KEYS.sounds, enabled ? "1" : "0");
  updateSoundsUI();
  if (!silent) showToast(enabled ? "Weather & city sounds on" : "Weather & city sounds off");
}

function setRadio(enabled, { silent = false } = {}) {
  if (enabled === state.radio) return;
  state.radio = enabled;

  if (enabled) {
    const slot = Math.floor(Date.now() / RADIO_SLOT_MS) % RADIO_ORDER.length;
    playCatalogTrack(RADIO_ORDER[slot], { start: true });
    state.queue = upcomingCatalogTracks(state.track, 4);
    if (dialogs.queue.open) renderQueue();
    if (!silent) showToast("Radio on · Lofi Skylines Radio", 2600);
  } else {
    state.queue = upcomingTracks(state.track, 4);
    if (dialogs.queue.open) renderQueue();
    if (!silent) showToast("Radio off · back to your mood");
  }
  updateRadioUI();
}

function switchCity(cityId, { silent = false, fromTour = false } = {}) {
  if (!CITY_BY_ID[cityId]) return;
  if (cityId === state.city) {
    if (fromTour) return;
    if (!state.started) showToast(`${getCity(cityId).name} · ${state.weather}`);
    return;
  }
  state.city = cityId;
  write(KEYS.city, cityId);
  const city = getCity(cityId);
  scene.setCity(cityId);
  if (!state.weatherOverridden) {
    state.weather = city.defaultWeather;
    scene.setWeather(state.weather);
    audio.setWeather(state.weather);
    updateWeatherUI();
  }
  applyCityUI();
  history.replaceState(null, "", `#${cityId}`);
  if (!fromTour) resetTourTimer();
  if (!silent) {
    showToast(`${city.name} · ${WEATHER_LABEL[state.weather]} · ${timeInZone(city.timeZone)}`);
  }
}

function previousCity() {
  const previous = nextCity(state.city, -1);
  switchCity(previous.id);
}

function resetTourTimer() {
  if (!state.tour) return;
  window.clearInterval(state.tourTimer);
  state.tourTimer = window.setInterval(() => {
    const next = nextCity(state.city, 1);
    switchCity(next.id, { silent: true, fromTour: true });
    showToast(`Tour · ${next.name}`, 2200);
  }, TOUR_DELAY);
}

function setTour(enabled) {
  state.tour = enabled;
  window.clearInterval(state.tourTimer);
  if (enabled) {
    resetTourTimer();
    showToast("City tour on · a new city every 90 seconds");
  } else {
    showToast("City tour off");
  }
  updateTourUI();
}

async function togglePlay() {
  if (state.playing) {
    await audio.pause();
    state.playing = false;
    pauseTrackTimer();
    updatePlayUI();
    return;
  }
  els.playBtn.disabled = true;
  try {
    if (!state.started) {
      audio.style = state.track.style;
      audio.seed = state.track.seed;
      audio.recipe = state.track.recipe;
      audio.buildSong();
    }
    await audio.play();
    state.started = true;
    state.playing = true;
    if (state.trackRemaining <= 0) state.trackRemaining = trackDurationMs();
    armTrackTimer(state.trackRemaining);
    updatePlayUI();
  } catch (error) {
    console.error(error);
    showToast("Your browser blocked audio. Tap play once more.");
  } finally {
    els.playBtn.disabled = false;
  }
}

function nextTrack({ auto = false } = {}) {
  const next = state.radio
    ? nextTrackInCatalog(state.track)
    : nextTrackInCategory(state.track);
  playCatalogTrack(next, { auto });
}

function updateVolumeUI() {
  const muted = state.muted || state.musicVol === 0;
  els.musicVolIcon.setAttribute("href", muted ? "#i-volume-muted" : "#i-volume");
  els.musicVol.value = String(state.musicVol);
  els.ambienceVol.value = String(state.ambienceVol);
  els.musicVol.style.setProperty("--fill", `${state.musicVol}%`);
  els.ambienceVol.style.setProperty("--fill", `${state.ambienceVol}%`);
}

function setMusicVolume(value) {
  state.musicVol = value;
  audio.setMusicVolume(value / 100);
  write(KEYS.music, value);
  if (value > 0 && state.muted) {
    state.muted = false;
    audio.setMuted(false);
  }
  updateVolumeUI();
}

function setAmbienceVolume(value) {
  state.ambienceVol = value;
  audio.setAmbienceVolume(value / 100);
  write(KEYS.ambience, value);
  els.ambienceVol.value = String(value);
}

function toggleMute() {
  state.muted = !state.muted;
  audio.setMuted(state.muted);
  updateVolumeUI();
  showToast(state.muted ? "Sound muted" : "Sound on");
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    showToast("Fullscreen is not available in this browser.");
  }
}

function updateFullscreenUI() {
  const active = Boolean(document.fullscreenElement);
  ["#fullscreenBtn", "#fullscreenTopBtn"].forEach((selector) => {
    const button = $(selector);
    if (!button) return;
    button.querySelector("use").setAttribute("href", active ? "#i-minimize" : "#i-maximize");
    button.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
  });
}

async function shareCity() {
  const city = getCity(state.city);
  const url = `${location.origin}${location.pathname}#${city.id}`;
  const shareData = {
    title: `${city.name} — Lofi Skylines`,
    text: `${city.subtitle}. Pixel-art night and endless lofi, generated in your browser.`,
    url,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(url);
    showToast("Link copied to the clipboard");
  } catch (error) {
    if (error?.name === "AbortError") return;
    showToast("Could not share the link. You can copy it from the address bar.");
  }
}

function downloadPostcard() {
  scene.downloadPostcard();
  showToast("Saving a postcard…", 1600);
}

function buildCityGrid() {
  els.cityGrid.replaceChildren();
  CITIES.forEach((city, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-card";
    button.dataset.city = city.id;

    const preview = document.createElement("span");
    preview.className = "city-preview";
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 270;
    canvas.setAttribute("aria-hidden", "true");
    preview.append(canvas);

    const weather = document.createElement("span");
    weather.className = "city-weather";
    const weatherDot = document.createElement("i");
    const weatherText = document.createElement("span");
    weatherText.className = "city-weather-text";
    weather.append(weatherDot, weatherText);
    preview.append(weather);

    const body = document.createElement("span");
    body.className = "city-card-body";
    const titleRow = document.createElement("span");
    titleRow.className = "city-card-title";
    const title = document.createElement("strong");
    title.textContent = city.name;
    const time = document.createElement("span");
    time.className = "city-card-time";
    time.textContent = timeInZone(city.timeZone);
    titleRow.append(title, time);

    const subtitle = document.createElement("span");
    subtitle.className = "city-card-sub";
    subtitle.textContent = city.subtitle;

    const foot = document.createElement("span");
    foot.className = "city-card-foot";
    const indexLabel = document.createElement("span");
    indexLabel.className = "city-card-index";
    indexLabel.textContent = `0${index + 1}`;
    const cta = document.createElement("span");
    cta.className = "city-card-cta";
    cta.innerHTML = 'Visit <svg class="icon"><use href="#i-arrow"></use></svg>';
    foot.append(indexLabel, cta);

    body.append(titleRow, subtitle, foot);
    button.append(preview, body);
    button.addEventListener("click", () => {
      switchCity(city.id);
      closeDialog(dialogs.cities);
    });

    els.cityGrid.append(button);
  });
  renderCityGrid();
}

function renderCityGrid() {
  const cards = $$(".city-card", els.cityGrid);
  if (!cards.length) return;
  cards.forEach((card) => {
    const city = getCity(card.dataset.city);
    const isActive = city.id === state.city;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-current", isActive ? "true" : "false");
    const canvas = $("canvas", card);
    const previewWeather = state.weatherOverridden ? state.weather : city.defaultWeather;
    if (canvas) drawPreview(canvas, city.id, previewWeather);
    const weatherText = $(".city-weather-text", card);
    if (weatherText) weatherText.textContent = WEATHER_LABEL[previewWeather];
    const time = $(".city-card-time", card);
    if (time) time.textContent = timeInZone(city.timeZone);
  });
}

function buildWeatherGrid() {
  if (!els.weatherGrid) return;
  els.weatherGrid.replaceChildren();
  WEATHERS.forEach((weather) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "weather-card";
    button.dataset.weather = weather.id;
    button.innerHTML = `<span class="weather-icon"><svg class="icon"><use href="${weather.icon}"></use></svg></span>
      <span class="weather-copy"><strong></strong><small></small></span>
      <span class="weather-check"><svg class="icon"><use href="#i-check"></use></svg></span>`;
    $("strong", button).textContent = weather.label;
    $("small", button).textContent = weather.blurb;
    button.addEventListener("click", () => {
      setWeather(weather.id, { persist: true });
      closeDialog(dialogs.weather);
    });
    els.weatherGrid.append(button);
  });
  renderWeatherGrid();
}

function renderWeatherGrid() {
  if (!els.weatherGrid) return;
  $$(".weather-card", els.weatherGrid).forEach((card) => {
    const active = card.dataset.weather === state.weather;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-pressed", String(active));
  });
}

function buildLibraryTabs() {
  if (!els.libraryTabs) return;
  const tabs = [
    { id: "all", label: "All", count: CATALOG.length },
    ...CATEGORIES.map((category) => ({
      id: category.id,
      label: category.label,
      count: CATALOG.filter((track) => track.category === category.id).length,
    })),
  ];
  els.libraryTabs.replaceChildren();
  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "library-tab";
    button.dataset.filter = tab.id;
    button.setAttribute("role", "tab");
    button.innerHTML = `<span></span><small>${tab.count}</small>`;
    $("span", button).textContent = tab.label;
    button.addEventListener("click", () => {
      state.libraryFilter = tab.id;
      renderLibrary();
    });
    els.libraryTabs.append(button);
  });
}

function renderLibrary() {
  const list = els.songList;
  if (!list) return;
  $$(".library-tab", els.libraryTabs).forEach((tab) => {
    const active = tab.dataset.filter === state.libraryFilter;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  const tracks = tracksForFilter(state.libraryFilter);
  list.replaceChildren();
  tracks.forEach((track) => {
    const active = track.id === state.track.id;
    const row = document.createElement("li");
    row.className = "song-row";
    row.dataset.trackId = track.id;
    if (active) row.classList.add("is-active");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "song-play";
    const number = String(trackIndex(track) + 1).padStart(2, "0");
    button.innerHTML = `<span class="song-index">${number}</span>
      <span class="song-copy"><strong></strong><small></small></span>
      <span class="song-tag cat-${track.category}">${track.categoryLabel}</span>
      <span class="song-duration">${track.durationLabel}</span>
      <span class="song-action"><svg class="icon"><use href="${
        active && state.playing ? "#i-volume" : "#i-play"
      }"></use></svg></span>`;
    $("strong", button).textContent = track.title;
    $("small", button).textContent = `${track.styleLabel} · ${track.bpm} bpm`;
    button.setAttribute("aria-label", `Play ${track.title}`);
    button.addEventListener("click", () => playCatalogTrack(track, { start: true }));
    row.append(button);
    list.append(row);
  });
}

function updateLibraryActive() {
  $$(".song-row", els.songList).forEach((row) => {
    const active = row.dataset.trackId === state.track.id;
    row.classList.toggle("is-active", active);
    const use = $(".song-action use", row);
    if (use) use.setAttribute("href", active && state.playing ? "#i-volume" : "#i-play");
  });
}

function renderQueue() {
  const list = $("#queueList");
  if (!list) return;
  const note = $("#queueNote");
  if (note) {
    note.textContent = state.radio
      ? "Radio is on — the station picks what comes next."
      : "Next and auto-advance stay in the current mood.";
  }
  list.replaceChildren();
  const status = state.playing ? "playing" : state.started ? "paused" : "ready";
  const current = document.createElement("li");
  current.className = "queue-item is-current";
  current.innerHTML = `
    <span class="queue-index">Now</span>
    <span class="queue-copy"><strong></strong><small>${state.track.categoryLabel} · ${state.track.styleLabel} · ${status}</small></span>
    <span class="queue-current">${state.playing ? "Playing" : state.started ? "Paused" : "Ready"}</span>
  `;
  $("strong", current).textContent = state.track.title;
  list.append(current);

  state.queue.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "queue-item";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "queue-play";
    button.innerHTML = `<span class="queue-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="queue-copy"><strong></strong><small></small></span>
      <span class="queue-play-icon"><svg class="icon"><use href="#i-play"></use></svg></span>`;
    $("strong", button).textContent = item.title;
    $("small", button).textContent = `${item.categoryLabel} · ${item.styleLabel} · ${item.bpm} bpm`;
    button.addEventListener("click", () => {
      playCatalogTrack(item, { start: true });
      closeDialog(dialogs.queue);
    });
    row.append(button);
    list.append(row);
  });
}

function fillGuide() {
  const city = getCity(state.city);
  $("#guideTitle").textContent = city.guide.title;
  $("#guideIntro").textContent = city.intro;
  const list = $("#guideList");
  list.replaceChildren();
  for (const [name, detail] of city.guide.places) {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = name;
    const span = document.createElement("span");
    span.textContent = detail;
    item.append(strong, span);
    list.append(item);
  }
  $("#guideFooter").textContent = city.guide.footer;
  $("#guideMaps").href = city.guide.maps;
}

function openDialog(dialog) {
  if (!dialog) return;
  $$("dialog[open]").forEach((open) => open.close());
  dialog.showModal();
}

function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
}

function updateTimerUI() {
  const timer = state.timer;
  const minutes = Math.floor(Math.max(0, timer.remaining) / 60);
  const seconds = Math.max(0, timer.remaining) % 60;
  const text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  els.timerClock.textContent = text;
  const showBadge = timer.running || timer.remaining < timer.total;
  els.timerBadge.hidden = !showBadge;
  els.timerBadge.textContent = text;
  $("#timerBtn")?.classList.toggle("is-active", timer.running);
  const label = timer.running ? "Pause" : timer.remaining < timer.total ? "Resume" : "Start focus";
  const span = els.timerStart.querySelector("span");
  if (span) span.textContent = label;
  const use = els.timerStart.querySelector("use");
  if (use) use.setAttribute("href", timer.running ? "#i-pause" : "#i-play");
}

function startTimer() {
  const timer = state.timer;
  if (timer.running) {
    timer.remaining = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
    timer.running = false;
    window.clearInterval(timer.interval);
    timer.interval = 0;
    updateTimerUI();
    return;
  }
  if (timer.remaining <= 0) timer.remaining = timer.total;
  timer.running = true;
  timer.endAt = Date.now() + timer.remaining * 1000;
  window.clearInterval(timer.interval);
  timer.interval = window.setInterval(() => {
    const next = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
    if (next <= 0) {
      timer.remaining = 0;
      timer.running = false;
      window.clearInterval(timer.interval);
      timer.interval = 0;
      updateTimerUI();
      audio.chime();
      showToast(
        timer.minutes === 5
          ? "Break over — back to the night."
          : "Focus finished. Stretch your shoulders.",
        4200,
      );
      return;
    }
    timer.remaining = next;
    updateTimerUI();
  }, 250);
  updateTimerUI();
}

function resetTimer() {
  const timer = state.timer;
  window.clearInterval(timer.interval);
  timer.interval = 0;
  timer.running = false;
  timer.total = timer.minutes * 60;
  timer.remaining = timer.total;
  updateTimerUI();
}

function setTimerMinutes(minutes) {
  state.timer.minutes = minutes;
  $$(".timer-tab").forEach((tab) => {
    const active = Number(tab.dataset.minutes) === minutes;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  resetTimer();
}

function bindUI() {
  $("#playBtn").addEventListener("click", togglePlay);
  $("#nextBtn").addEventListener("click", () => nextTrack());

  $("#cityBtn").addEventListener("click", () => {
    renderCityGrid();
    openDialog(dialogs.cities);
  });
  $("#gridBtn").addEventListener("click", () => {
    renderCityGrid();
    openDialog(dialogs.cities);
  });

  $("#weatherBtn").addEventListener("click", () => {
    renderWeatherGrid();
    openDialog(dialogs.weather);
  });
  $("#tourBtn").addEventListener("click", () => setTour(!state.tour));
  $("#soundsBtn").addEventListener("click", () => setCitySounds(!state.citySounds));
  $("#radioBtn").addEventListener("click", () => setRadio(!state.radio));

  $("#libraryBtn").addEventListener("click", () => {
    renderLibrary();
    openDialog(dialogs.library);
  });

  $("#queueBtn").addEventListener("click", () => {
    renderQueue();
    openDialog(dialogs.queue);
  });
  $("#browseLibrary").addEventListener("click", () => {
    closeDialog(dialogs.queue);
    renderLibrary();
    openDialog(dialogs.library);
  });

  $("#timerBtn").addEventListener("click", () => openDialog(dialogs.timer));
  els.timerStart.addEventListener("click", startTimer);
  $("#timerReset").addEventListener("click", resetTimer);
  $$(".timer-tab").forEach((tab) => {
    tab.addEventListener("click", () => setTimerMinutes(Number(tab.dataset.minutes)));
  });

  $("#helpBtn").addEventListener("click", () => openDialog(dialogs.help));
  $("#aboutBtn").addEventListener("click", () => openDialog(dialogs.about));
  $("#guideBtn").addEventListener("click", () => {
    fillGuide();
    openDialog(dialogs.guide);
  });

  $("#musicVol").addEventListener("input", (event) => setMusicVolume(Number(event.target.value)));
  $("#ambienceVol").addEventListener("input", (event) =>
    setAmbienceVolume(Number(event.target.value)),
  );
  els.musicVolIcon.addEventListener("click", toggleMute);

  $("#downloadBtn").addEventListener("click", downloadPostcard);
  $("#shareBtn").addEventListener("click", shareCity);
  $("#fullscreenBtn").addEventListener("click", toggleFullscreen);
  $("#fullscreenTopBtn").addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenUI);

  $$("dialog .close, dialog [data-close]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")));
  });
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.closest("input, textarea, select, [contenteditable='true']") !== null);
    const dialogOpen = $$("dialog[open]").length > 0;
    if (event.key === "Escape") {
      $$("dialog[open]").forEach((dialog) => dialog.close());
      return;
    }
    if (isTyping || dialogOpen) return;
    const interactive =
      target instanceof HTMLElement && target.closest("button, a, [role='button']") !== null;

    if (event.code === "Space" && !interactive) {
      event.preventDefault();
      togglePlay();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    switch (event.key.toLowerCase()) {
      case "n":
        nextTrack();
        break;
      case "c":
        renderCityGrid();
        openDialog(dialogs.cities);
        break;
      case "w":
        cycleWeather();
        break;
      case "v":
        renderLibrary();
        openDialog(dialogs.library);
        break;
      case "t":
        openDialog(dialogs.timer);
        break;
      case "f":
        toggleFullscreen();
        break;
      case "m":
        toggleMute();
        break;
      case "a":
        setCitySounds(!state.citySounds);
        break;
      case "o":
        setRadio(!state.radio);
        break;
      case "g":
        fillGuide();
        openDialog(dialogs.guide);
        break;
      case "?":
        openDialog(dialogs.help);
        break;
      case "1":
      case "2":
      case "3": {
        const city = CITIES[Number(event.key) - 1];
        if (city) switchCity(city.id);
        break;
      }
      case "arrowleft":
        previousCity();
        break;
      case "arrowright": {
        const next = nextCity(state.city, 1);
        switchCity(next.id);
        break;
      }
      default:
        break;
    }
  });

  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (CITY_BY_ID[id] && id !== state.city) switchCity(id, { silent: true });
  });

  if ("mediaSession" in navigator) {
    updateMediaSession();
  }
}

function init() {
  buildCityGrid();
  buildWeatherGrid();
  buildLibraryTabs();
  updateWeatherUI();
  updateSoundsUI();
  updateTourUI();
  updateVolumeUI();
  updateTimerUI();
  applyCityUI();
  updateRadioUI();
  updatePlayUI();
  bindUI();
  updateClock();
  window.setInterval(updateClock, 1000);
  if (new URLSearchParams(location.search).has("debug")) {
    window.__lofi = {
      audio,
      scene,
      state,
      showToast,
      nextTrack,
      playCatalogTrack,
      armTrackTimer,
      trackDurationMs,
    };
  }
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
}

init();
