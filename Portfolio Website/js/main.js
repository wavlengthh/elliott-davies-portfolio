const portfolioItems = [
  {
    title: "Neon Hours",
    description: "Produced and mixed a late-night electronic single with a wide, cinematic finish.",
    tag: "Original Production"
  },
  {
    title: "Static Heart",
    description: "Mixed and mastered an alternative release for clarity, punch, and emotional weight.",
    tag: "Mix / Master"
  }
];

const videos = [
  { id: "CMmuctaTKm8", caption: "A look inside a mix session." }
];

const audioTracks = [
  { title: "Neon Hours", role: "Mixed & Mastered", src: "assets/audio/ElliottDavies_NeonNours_Mastering Session 2026.9.mp3" },
  { title: "Open Frequency", role: "Original Production", src: "assets/audio/track2.mp3" },
  { title: "Static Heart", role: "Mixed & Mastered", src: "assets/audio/track3.mp3" }
];

const renderPortfolio = () => {
  const grid = document.querySelector("[data-portfolio-grid]");
  if (!grid) return;

  grid.insertAdjacentHTML(
    "afterbegin",
    portfolioItems
      .map(
        ({ title, description, tag }, index) => `
          <article class="project-card">
            <div class="project-media project-media-${index + 1}">
              <span class="project-tag">${tag}</span>
            </div>
            <div class="project-content">
              <h2>${title}</h2>
              <p>${description}</p>
            </div>
          </article>
        `
      )
      .join("")
  );
};

const renderVideos = () => {
  const grid = document.querySelector("[data-video-grid]");
  if (!grid) return;

  grid.innerHTML = videos
    .map(
      ({ id, caption }) => `
        <article class="video-card">
          <div class="video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/${id}"
              title="${caption}"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <p>${caption}</p>
        </article>
      `
    )
    .join("");
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

const initAudioPlayer = () => {
  const player = document.querySelector("[data-audio-player]");
  if (!player) return;

  const audio = player.querySelector("[data-audio-element]");
  const playButton = player.querySelector("[data-audio-play]");
  const playIcon = player.querySelector("[data-audio-play-icon]");
  const progress = player.querySelector("[data-audio-progress]");
  const title = player.querySelector("[data-audio-title]");
  const role = player.querySelector("[data-audio-role]");
  const currentTime = player.querySelector("[data-audio-current]");
  const duration = player.querySelector("[data-audio-duration]");
  const trackList = player.querySelector("[data-audio-track-list]");

  trackList.innerHTML = audioTracks
    .map(
      (track, index) => `
        <button class="audio-track${index === 0 ? " is-active" : ""}" type="button" data-track-index="${index}">
          <span class="audio-track-number">0${index + 1}</span>
          <span class="audio-track-info">
            <strong>${track.title}</strong>
            <small>${track.role}</small>
          </span>
          <span aria-hidden="true">↗</span>
        </button>
      `
    )
    .join("");

  const loadTrack = (index) => {
    const track = audioTracks[index];
    audio.src = track.src;
    title.textContent = track.title;
    role.textContent = track.role;
    progress.value = "0";
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    trackList.querySelectorAll(".audio-track").forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });
  };

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch((error) => {
        console.error("Unable to play the selected track.", error);
      });
    } else {
      audio.pause();
    }
  });

  progress.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });
  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    progress.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : "0";
    currentTime.textContent = formatTime(audio.currentTime);
  });
  audio.addEventListener("play", () => {
    playIcon.textContent = "Ⅱ";
    playButton.setAttribute("aria-label", "Pause selected track");
  });
  audio.addEventListener("pause", () => {
    playIcon.textContent = "▶";
    playButton.setAttribute("aria-label", "Play selected track");
  });
  trackList.addEventListener("click", (event) => {
    const trackButton = event.target.closest("[data-track-index]");
    if (trackButton) loadTrack(Number(trackButton.dataset.trackIndex));
  });

  loadTrack(0);
};

const initMobileNavigation = () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
};

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

renderPortfolio();
renderVideos();
initAudioPlayer();
initMobileNavigation();
