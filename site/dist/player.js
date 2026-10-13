(() => {
  "use strict";
  const config = window.RADIO_CONFIG || {};
  const audio = document.getElementById("radioAudio");
  const radio = document.querySelector(".radio");
  const button = document.getElementById("playButton");
  const label = document.getElementById("playLabel");
  const icon = document.getElementById("playIcon");
  const status = document.getElementById("statusLabel");
  const title = document.getElementById("trackTitle");
  const message = document.getElementById("playerMessage");
  const mute = document.getElementById("muteButton");
  const volume = document.getElementById("volume");
  const volumeValue = document.getElementById("volumeValue");
  const playPath = '<path d="M8 5.5v13L18 12z"/>';
  const stopPath = '<rect x="6" y="6" width="12" height="12" rx="1"/>';
  let state = "unconfigured";
  let attempt = 0;
  let timeout;
  let stream;

  try { stream = new URL(config.streamUrl); } catch { return; }
  if (stream.protocol !== "https:") return;

  function render(next, detail) {
    state = next;
    const active = next === "playing";
    const loading = next === "loading";
    radio.classList.toggle("is-playing", active);
    radio.classList.toggle("is-loading", loading);
    button.disabled = false;
    icon.innerHTML = active || loading ? stopPath : playPath;
    label.textContent = active ? "Остановить эфир" : loading ? "Отменить подключение" : next === "error" ? "Попробовать снова" : "Слушать эфир";
    button.setAttribute("aria-label", label.textContent);
    status.textContent = active ? "В эфире" : loading ? "Подключение" : next === "error" ? "Нет соединения" : "Онлайн-радио";
    title.textContent = config.stationName || "Радио «Надежда»";
    message.textContent = detail || (active ? "Вы слушаете прямой эфир." : loading ? "Подключаемся к эфиру…" : "Нажмите «Слушать эфир», чтобы присоединиться.");
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = active ? "playing" : "none";
  }

  function release() {
    clearTimeout(timeout);
    attempt++;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  function stop() { render("ready"); release(); }
  function fail() {
    render("error", "Не удалось подключиться к эфиру. Проверьте интернет и попробуйте снова.");
    release();
  }
  function watchTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => { if (state === "loading") fail(); }, 15000);
  }
  function play() {
    if (state === "playing" || state === "loading") return;
    const current = ++attempt;
    render("loading");
    audio.src = stream.href;
    watchTimeout();
    audio.play().catch(() => { if (current === attempt) fail(); });
  }
  button.addEventListener("click", () => state === "playing" || state === "loading" ? stop() : play());
  audio.addEventListener("playing", () => {
    if (state !== "loading" && state !== "playing") return;
    clearTimeout(timeout);
    render("playing");
  });
  audio.addEventListener("waiting", () => {
    if (state !== "playing") return;
    render("loading", "Связь прервалась. Ждём продолжения эфира…");
    watchTimeout();
  });
  audio.addEventListener("error", () => { if (state === "loading" || state === "playing") fail(); });
  audio.addEventListener("ended", () => { if (state === "loading" || state === "playing") fail(); });
  audio.addEventListener("pause", () => { if (state === "playing") stop(); });

  function updateVolume() {
    const silent = audio.muted || audio.volume === 0;
    mute.setAttribute("aria-pressed", String(silent));
    mute.setAttribute("aria-label", silent ? "Включить звук" : "Выключить звук");
    volumeValue.textContent = `${Math.round(audio.volume * 100)}%`;
  }
  audio.volume = Number(volume.value) / 100;
  volume.disabled = false;
  mute.disabled = false;
  volume.addEventListener("input", () => { audio.volume = Number(volume.value) / 100; audio.muted = false; updateVolume(); });
  mute.addEventListener("click", () => {
    if (audio.volume === 0) { audio.volume = .7; volume.value = "70"; audio.muted = false; }
    else audio.muted = !audio.muted;
    updateVolume();
  });
  if ("mediaSession" in navigator) {
    if ("MediaMetadata" in window) navigator.mediaSession.metadata = new MediaMetadata({ title: config.stationName || "Радио «Надежда»", artist: "Прямой эфир" });
    for (const [action, handler] of Object.entries({play, pause: stop, stop})) {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Unsupported media action. */ }
    }
  }
  render("ready");
})();
