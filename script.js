let movies = [];
let activeIndex = 0;
let carouselTimer;

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const toast = document.querySelector("[data-toast]");
const heroBg = document.querySelector("[data-hero-bg]");
const slideKicker = document.querySelector("[data-slide-kicker]");
const slideTitle = document.querySelector("[data-slide-title]");
const slideDescription = document.querySelector("[data-slide-description]");
const slideGenre = document.querySelector("[data-slide-genre]");
const slideTime = document.querySelector("[data-slide-time]");
const slideRoom = document.querySelector("[data-slide-room]");
const slidePoster = document.querySelector("[data-slide-poster]");
const heroTicket = document.querySelector("[data-hero-ticket]");
const heroTrailer = document.querySelector("[data-hero-trailer]");
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");
const dots = document.querySelector("[data-carousel-dots]");
const movieGrid = document.querySelector("[data-movie-grid]");
const trailerModal = document.querySelector("[data-trailer-modal]");
const trailerFrame = document.querySelector("[data-trailer-frame]");
const trailerTitle = document.querySelector("[data-trailer-title]");

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const formatTitle = (title) => String(title).replace(/-/g, "\u2011");

const months = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

const formatDateRange = (movie) => {
  const from = parseDate(movie.fromDate);
  const to = parseDate(movie.toDate);
  if (!from || !to) return "";
  const fromMonth = months[from.month - 1];
  const toMonth = months[to.month - 1];
  if (!fromMonth || !toMonth) return "";
  if (from.month === to.month && from.year === to.year) {
    return `Dal ${from.day} al ${to.day} ${toMonth}`;
  }
  return `Dal ${from.day} ${fromMonth} al ${to.day} ${toMonth}`;
};

const renderDateRange = (movie) => {
  const dateRange = formatDateRange(movie);
  return dateRange ? `<p class="movie-dates">${escapeHtml(dateRange)}</p>` : "";
};

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const showToast = (title) => {
  toast.textContent = `Prenotazione per "${title}": qui collegheremo biglietteria, WhatsApp o modulo reale.`;
  toast.classList.add("is-visible");
  window.clearTimeout(window.ticketToastTimer);
  window.ticketToastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3600);
};

const openTrailer = (movie) => {
  if (!movie || !movie.trailerEmbed) return;
  trailerTitle.textContent = `Trailer - ${formatTitle(movie.title)}`;
  const separator = movie.trailerEmbed.includes("?") ? "&" : "?";
  trailerFrame.src = `${movie.trailerEmbed}${separator}autoplay=1&rel=0`;
  trailerModal.classList.add("is-open");
  trailerModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");
};

const closeTrailer = () => {
  trailerFrame.src = "";
  trailerModal.classList.remove("is-open");
  trailerModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
};

const closeNav = () => {
  document.body.classList.remove("nav-open");
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const renderDots = () => {
  if (!movies.length) {
    dots.innerHTML = "";
    return;
  }

  dots.innerHTML = movies
    .map((movie, index) => {
      const active = index === activeIndex ? " is-active" : "";
      return `<button class="${active}" type="button" aria-label="Mostra ${escapeHtml(formatTitle(movie.title))}" data-dot="${index}"></button>`;
    })
    .join("");
};

const renderSlide = (index) => {
  if (!movies.length) return;

  activeIndex = (index + movies.length) % movies.length;
  const movie = movies[activeIndex];

  slidePoster.classList.add("is-changing");
  window.setTimeout(() => {
    slideKicker.textContent = movie.kicker;
    slideTitle.textContent = formatTitle(movie.title);
    slideDescription.textContent = movie.description;
    slideGenre.textContent = movie.genre;
    slideTime.textContent = movie.time;
    slideRoom.textContent = movie.room;
    slidePoster.src = movie.poster;
    slidePoster.alt = movie.alt;
    slidePoster.hidden = false;
    heroBg.style.setProperty("--active-poster", `url("${movie.poster}")`);
    renderDots();
    slidePoster.classList.remove("is-changing");
  }, 120);
};

const renderMovieGrid = () => {
  if (!movies.length) {
    movieGrid.innerHTML = "";
    return;
  }

  movieGrid.innerHTML = movies
    .map(
      (movie, index) => `
        <article class="movie-card">
          <img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.alt)}">
          <div class="movie-body">
            <p class="movie-meta">${escapeHtml(movie.genre)} &middot; ${escapeHtml(movie.time)}</p>
            ${renderDateRange(movie)}
            <h3>${escapeHtml(formatTitle(movie.title))}</h3>
            <p>${escapeHtml(movie.description)}</p>
            <button class="trailer-button" type="button" data-trailer-index="${index}">Trailer</button>
            <button type="button" data-ticket-index="${index}">Prenota</button>
          </div>
        </article>
      `
    )
    .join("");
};

const restartCarousel = () => {
  window.clearInterval(carouselTimer);
  if (movies.length < 2) return;
  carouselTimer = window.setInterval(() => {
    renderSlide(activeIndex + 1);
  }, 5200);
};

const setMovieControlsEnabled = (enabled) => {
  [heroTicket, heroTrailer].forEach((control) => {
    control.disabled = !enabled;
  });
  carouselPrev.disabled = !enabled || movies.length < 2;
  carouselNext.disabled = !enabled || movies.length < 2;
};

const preloadFirstPoster = () => {
  if (!movies[0]?.poster) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = movies[0].poster;
  document.head.appendChild(link);
};

const bindDynamicMovieButtons = () => {
  movieGrid.addEventListener("click", (event) => {
    const trailerButton = event.target.closest("[data-trailer-index]");
    const ticketButton = event.target.closest("[data-ticket-index]");
    if (trailerButton) {
      openTrailer(movies[Number(trailerButton.dataset.trailerIndex)]);
    }
    if (ticketButton) {
      const movie = movies[Number(ticketButton.dataset.ticketIndex)];
      if (movie) showToast(movie.title);
    }
  });
};

const loadMovies = async () => {
  try {
    const response = await fetch("movies.json", { cache: "no-store" });
    if (!response.ok) throw new Error("movies.json non disponibile");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      movies = data;
    }
  } catch (error) {
    console.warn(error);
  }

  if (!movies.length) {
    slideKicker.textContent = "Cinema Hollywood";
    slideTitle.textContent = "Programmazione non disponibile";
    slideDescription.textContent = "Riprova piu tardi o aggiorna il file movies.json.";
    renderDots();
    renderMovieGrid();
    setMovieControlsEnabled(false);
    return;
  }

  preloadFirstPoster();
  setMovieControlsEnabled(true);
  renderMovieGrid();
  renderSlide(0);
  restartCarousel();
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNav();
  }
});

carouselPrev.addEventListener("click", () => {
  if (!movies.length) return;
  renderSlide(activeIndex - 1);
  restartCarousel();
});

carouselNext.addEventListener("click", () => {
  if (!movies.length) return;
  renderSlide(activeIndex + 1);
  restartCarousel();
});

dots.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-dot]");
  if (!dot) return;
  renderSlide(Number(dot.dataset.dot));
  restartCarousel();
});

heroTicket.addEventListener("click", () => {
  if (!movies.length) return;
  showToast(movies[activeIndex].title);
});

heroTrailer.addEventListener("click", () => {
  if (!movies.length) return;
  openTrailer(movies[activeIndex]);
});

document.querySelectorAll("[data-trailer-close]").forEach((button) => {
  button.addEventListener("click", closeTrailer);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && trailerModal.classList.contains("is-open")) {
    closeTrailer();
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
bindDynamicMovieButtons();
loadMovies();
syncHeader();
