import { CITIES, CITY_BY_ID, getCity, nextCity } from "./cities.js";
import { Scene } from "./scene.js";
import { LofiEngine } from "./audio.js";
import { STYLES, makeTrack, makeQueue } from "./titles.js";
import { drawPreview } from "./scenes.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const WEATHER_CYCLE = ["rain", "snow", "clear"];
const WEATHER_LABEL = { rain: "rain", snow: "snow", clear: "clear" };
const WEATHER_ICON = {
  rain: "#i-weather-rain",
  snow: "#i-weather-snow",
  clear: "#i-weather-clear",
};
const TOUR_DELAY = 90_000;

const KEYS = {
  city: "lofi-skylines.city",
  style: "lofi-skylines.style",
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

function randomSeed() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] || Date.now();
}

function initialCity() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (CITY_BY_ID[hash]) return CITY_BY_ID[hash];
  const saved = read(KEYS.city);
  return CITY_BY_ID[saved] || CITIES[0];
}

const firstCity = initialCity();
const savedStyle = read(KEYS.style);
const savedWeather = read(KEYS.weather);

const state = {
  city: firstCity.id,
  weather: WEATHER_LABEL[savedWeather] ? savedWeather : firstCity.defaultWeather,
  weatherOverridden: Boolean(WEATHER_LABEL[savedWeather]),
  style: STYLES[savedStyle] ? savedStyle : "jazzhop",
  citySounds: read(KEYS.sounds, "1") !== "0",
  muted: false,
  playing: false,
  started: false,
  tour: false,
  tourTimer: 0,
  track: null,
  queue: [],
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

audio.style = state.style;
audio.seed = randomSeed();
audio.weather = state.weather;
audio.musicVol = state.musicVol / 100;
audio.ambienceVol = state.ambienceVol / 100;
audio.citySounds = state.citySounds;
audio.buildSong();

state.track = makeTrack(state.city, state.weather, state.style, randomSeed());
state.queue = makeQueue(state.city, state.weather, state.style, state.track.seed, 4);

const els = {
  cityName: $("#cityName"),
  citySub: $("#citySub"),
  cityChip: $("#cityChip"),
  cityChipTime: $("#cityChipTime"),
  localTime: $("#localTime span"),
  weatherIcon: $("#weatherIcon use"),
  weatherState: $("#weatherState"),
  weatherBtn: $("#weatherBtn"),
  radioBtn: $("#radioBtn"),
  radioState: $("#radioState"),
  tourBtn: $("#tourBtn"),
  tourState: $("#tourState"),
  listenerText: $("#listenerText"),
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
  toast: $("#toast"),
  player: $("#player"),
  body: document.body,
};

const dialogs = {
  cities: $("#citiesDialog"),
  vibe: $("#vibeDialog"),
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
  els.weatherIcon.setAttribute("href", WEATHER_ICON[state.weather]);
  els.weatherState.textContent = WEATHER_LABEL[state.weather];
  els.weatherBtn.setAttribute("aria-label", `Weather: ${state.weather}. Change weather`);
  els.weatherBtn.title = `Weather: ${state.weather} (W)`;
}

function updateSoundsUI() {
  els.radioBtn.setAttribute("aria-pressed", String(state.citySounds));
  els.radioState.textContent = state.citySounds ? "on" : "off";
  els.radioBtn.title = state.citySounds ? "City sounds on (A)" : "City sounds off (A)";
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
  els.listenerText.textContent = state.playing ? "1 listening" : "1 here";
  els.liveText.textContent = state.playing ? "1 here now · all night" : "1 here now · all night";
  updateTrackUI();
  updateMediaSession();
}

function updateTrackUI() {
  if (!state.started) {
    els.trackTitle.textContent = "Press play for endless lofi";
    els.trackSub.textContent = "music generated live in your browser";
  } else {
    const style = STYLES[state.style] || STYLES.jazzhop;
    els.trackTitle.textContent = state.track.title;
    els.trackSub.textContent = state.playing
      ? state.track.subtitle
      : `paused · ${style.label.toLowerCase()} · ${style.bpm} bpm`;
  }
  updateMeta();
  if (dialogs.queue.open) renderQueue();
}

function setMediaMetadata() {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.track?.title || "Endless lofi",
      artist: "Lofi Skylines",
      album: `${getCity(state.city).name} · ${WEATHER_LABEL[state.weather]}`,
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

function refreshTitles({ newSeed = true } = {}) {
  const seed = newSeed ? randomSeed() : state.track?.seed || randomSeed();
  state.track = makeTrack(state.city, state.weather, state.style, seed);
  state.queue = makeQueue(state.city, state.weather, state.style, state.track.seed, 4);
  updateTrackUI();
  updateMediaSession();
  if (dialogs.queue.open) renderQueue();
}

function setWeather(weather, { persist = true, silent = false, refresh = true } = {}) {
  if (!WEATHER_LABEL[weather]) return;
  state.weather = weather;
  scene.setWeather(weather);
  audio.setWeather(weather);
  if (persist) {
    state.weatherOverridden = true;
    write(KEYS.weather, weather);
  }
  updateWeatherUI();
  if (refresh) {
    refreshTitles();
    renderCityGrid();
  }
  if (!silent) showToast(`Weather · ${WEATHER_LABEL[weather]}`);
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
  if (!silent) showToast(enabled ? "City sounds on" : "City sounds off");
}

function setStyle(style, { silent = false } = {}) {
  if (!STYLES[style]) return;
  state.style = style;
  write(KEYS.style, style);
  audio.setStyle(style);
  refreshTitles({ newSeed: true });
  updateVibeUI();
  if (dialogs.queue.open) renderQueue();
  if (!silent) showToast(`Vibe · ${STYLES[style].label}`);
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
  refreshTitles();
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
    updatePlayUI();
    return;
  }
  els.playBtn.disabled = true;
  try {
    if (!state.started) {
      audio.style = state.style;
      audio.seed = state.track.seed;
      audio.buildSong();
    }
    await audio.play();
    state.started = true;
    state.playing = true;
    if (!state.track) refreshTitles();
    updatePlayUI();
  } catch (error) {
    console.error(error);
    showToast("Your browser blocked audio. Tap play once more.");
  } finally {
    els.playBtn.disabled = false;
  }
}

function nextTrack({ silent = false } = {}) {
  const track = makeTrack(state.city, state.weather, state.style, randomSeed());
  state.track = track;
  state.queue = makeQueue(state.city, state.weather, state.style, track.seed, 4);
  if (state.started) audio.next(track.seed);
  else {
    audio.seed = track.seed;
    audio.buildSong();
  }
  updateTrackUI();
  if (dialogs.queue.open) renderQueue();
  updateMediaSession();
  if (!silent) showToast(`Up next · ${track.title}`);
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

function updateVibeUI() {
  $$("#vibeList .vibe").forEach((button) => {
    const active = button.dataset.style === state.style;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderQueue() {
  const list = $("#queueList");
  if (!list) return;
  list.replaceChildren();
  const current = document.createElement("li");
  current.className = "queue-item is-current";
  current.innerHTML = `
    <span class="queue-index">Now</span>
    <span class="queue-copy"><strong></strong><small>${STYLES[state.style].label} · playing</small></span>
    <span class="queue-current">${state.playing ? "Playing" : "Paused"}</span>
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
    $("small", button).textContent = item.subtitle;
    button.addEventListener("click", () => {
      state.track = {
        ...item,
        style: STYLES[state.style],
        subtitle: `${STYLES[state.style].label.toLowerCase()} · ${STYLES[state.style].bpm} bpm · generated live`,
      };
      if (state.started) audio.next(item.seed);
      else {
        audio.seed = item.seed;
        audio.buildSong();
      }
      updateTrackUI();
      updateMediaSession();
      closeDialog(dialogs.queue);
      showToast(`Playing · ${item.title}`);
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

  $("#weatherBtn").addEventListener("click", cycleWeather);
  $("#tourBtn").addEventListener("click", () => setTour(!state.tour));
  $("#radioBtn").addEventListener("click", () => setCitySounds(!state.citySounds));

  $("#vibeBtn").addEventListener("click", () => {
    updateVibeUI();
    openDialog(dialogs.vibe);
  });
  $$("#vibeList .vibe").forEach((button) => {
    button.addEventListener("click", () => setStyle(button.dataset.style));
  });

  $("#queueBtn").addEventListener("click", () => {
    renderQueue();
    openDialog(dialogs.queue);
  });
  $("#shuffleQueue").addEventListener("click", () => {
    state.queue = makeQueue(state.city, state.weather, state.style, randomSeed(), 4);
    renderQueue();
    showToast("The night has been reshuffled");
  });

  $("#timerBtn").addEventListener("click", () => openDialog(dialogs.timer));
  els.timerStart.addEventListener("click", startTimer);
  $("#timerReset").addEventListener("click", resetTimer);
  $$(".timer-tab").forEach((tab) => {
    tab.addEventListener("click", () => setTimerMinutes(Number(tab.dataset.minutes)));
  });

  $("#helpBtn").addEventListener("click", () => openDialog(dialogs.help));
  $("#aboutBtn").addEventListener("click", () => openDialog(dialogs.about));
  $("#aboutBtnMobile").addEventListener("click", () => openDialog(dialogs.about));
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
        updateVibeUI();
        openDialog(dialogs.vibe);
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
  updateWeatherUI();
  updateSoundsUI();
  updateTourUI();
  updateVolumeUI();
  updateTimerUI();
  applyCityUI();
  updatePlayUI();
  bindUI();
  updateClock();
  window.setInterval(updateClock, 1000);
  if (new URLSearchParams(location.search).has("debug")) {
    window.__lofi = { audio, scene, state, showToast };
  }
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
}

init();
