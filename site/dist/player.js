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
  const tracks = Array.isArray(config.tracks) ? config.tracks : [];
  let state = "ready";
  let timeout;
  let currentTrack;

  function render(next, detail) {
    state = next;
    const active = next === "playing";
    const loading = next === "loading";
    radio.classList.toggle("is-playing", active);
    radio.classList.toggle("is-loading", loading);
    button.disabled = false;
    mute.disabled = false;
    volume.disabled = false;
    icon.innerHTML = active || loading ? stopPath : playPath;
    label.textContent = active ? "Остановить" : loading ? "Отменить запуск" : next === "error" ? "Попробовать снова" : "Слушать радио";
    button.setAttribute("aria-label", label.textContent);
    status.textContent = active ? "В эфире" : loading ? "Запуск" : next === "error" ? "Ошибка" : "Готово к эфиру";
    title.textContent = currentTrack?.title || config.stationName || "Территория гор";
    message.textContent = detail || (active ? "Вы слушаете радио «Территория гор»." : "Нажмите кнопку, чтобы начать воспроизведение.");
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = active ? "playing" : "none";
  }

  function release() {
    clearTimeout(timeout);
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  function stop() { release(); render("ready"); }
  function fail() { release(); render("error", "Не удалось воспроизвести композицию. Попробуйте ещё раз."); }
  function chooseTrack() {
    if (!tracks.length) return null;
    return tracks[Math.floor(Math.random() * tracks.length)];
  }
  function play() {
    if (state === "playing" || state === "loading") return;
    currentTrack = chooseTrack();
    if (!currentTrack) { render("error", "Музыка пока не добавлена."); return; }
    render("loading", `Загружаем: ${currentTrack.title}`);
    audio.src = currentTrack.src;
    audio.play().catch(fail);
  }
  button.addEventListener("click", () => state === "playing" || state === "loading" ? stop() : play());
  audio.addEventListener("playing", () => render("playing"));
  audio.addEventListener("error", fail);
  audio.addEventListener("ended", play);
  audio.addEventListener("pause", () => { if (state === "playing") render("ready"); });

  function updateVolume() {
    const silent = audio.muted || audio.volume === 0;
    mute.setAttribute("aria-pressed", String(silent));
    mute.setAttribute("aria-label", silent ? "Включить звук" : "Выключить звук");
    volumeValue.textContent = `${Math.round(audio.volume * 100)}%`;
  }
  audio.volume = Number(volume.value) / 100;
  updateVolume();
  volume.addEventListener("input", () => { audio.volume = Number(volume.value) / 100; audio.muted = false; updateVolume(); });
  mute.addEventListener("click", () => { audio.muted = !audio.muted; updateVolume(); });
  if ("mediaSession" in navigator) {
    if ("MediaMetadata" in window) navigator.mediaSession.metadata = new MediaMetadata({ title: config.stationName || "Территория гор", artist: "Интернет-радио" });
    for (const [action, handler] of Object.entries({ play, pause: stop, stop })) { try { navigator.mediaSession.setActionHandler(action, handler); } catch {} }
  }
  render("ready");
})();
