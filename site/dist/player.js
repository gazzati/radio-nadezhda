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
  let audioContext;
  let gainNode;

  function initAudioGraph() {
    if (audioContext) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass();
    gainNode = audioContext.createGain();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(gainNode).connect(audioContext.destination);
    gainNode.gain.value = Number(volume.value) / 100;
  }

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
    initAudioGraph();
    if (audioContext && audioContext.state === "suspended") audioContext.resume();
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
    const silent = audio.muted || (gainNode ? gainNode.gain.value === 0 : audio.volume === 0);
    mute.setAttribute("aria-pressed", String(silent));
    mute.setAttribute("aria-label", silent ? "Включить звук" : "Выключить звук");
    volumeValue.textContent = `${Math.round(Number(volume.value))}%`;
  }
  audio.volume = 1;
  updateVolume();
  volume.addEventListener("input", () => {
    const nextVolume = Number(volume.value) / 100;
    initAudioGraph();
    if (audioContext && audioContext.state === "suspended") audioContext.resume();
    if (gainNode) gainNode.gain.value = nextVolume;
    audio.volume = nextVolume;
    audio.muted = false;
    updateVolume();
  });
  mute.addEventListener("click", () => {
    initAudioGraph();
    const silent = audio.muted || (gainNode && gainNode.gain.value === 0);
    if (silent) {
      audio.muted = false;
      volume.value = volume.value === "0" ? "70" : volume.value;
      if (gainNode) gainNode.gain.value = Number(volume.value) / 100;
    } else {
      audio.muted = true;
      if (gainNode) gainNode.gain.value = 0;
    }
    updateVolume();
  });
  if ("mediaSession" in navigator) {
    if ("MediaMetadata" in window) navigator.mediaSession.metadata = new MediaMetadata({ title: config.stationName || "Территория гор", artist: "Интернет-радио" });
    for (const [action, handler] of Object.entries({ play, pause: stop, stop })) { try { navigator.mediaSession.setActionHandler(action, handler); } catch {} }
  }
  render("ready");
})();
