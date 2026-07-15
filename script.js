const fallbackMovies = [
  {
    title: "Avatar: Fire and Ash",
    kicker: "Ora in programmazione",
    description: "Grande spettacolo sci-fi nella sala unica del Cinema Hollywood, pensato per una serata evento.",
    genre: "Sci-fi",
    time: "18:00 / 21:30",
    room: "Sala unica",
    poster: "assets/poster-avatar-fire-and-ash-2k.jpg",
    alt: "Locandina Avatar: Fire and Ash",
    trailerEmbed: "https://www.youtube.com/embed/bf38f_JINyw",
  },
];

let movies = fallbackMovies;
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
const dots = document.querySelector("[data-carousel-dots]");
const movieGrid = document.querySelector("[data-movie-grid]");
const trailerModal = document.querySelector("[data-trailer-modal]");
const trailerFrame = document.querySelector("[data-trailer-frame]");
const trailerTitle = document.querySelector("[data-trailer-title]");

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

const findMovie = (title) => movies.find((movie) => movie.title === title);

const openTrailer = (movie) => {
  if (!movie || !movie.trailerEmbed) return;
  trailerTitle.textContent = `Trailer · ${movie.title}`;
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
  dots.innerHTML = movies
    .map((movie, index) => {
      const active = index === activeIndex ? " is-active" : "";
      return `<button class="${active}" type="button" aria-label="Mostra ${movie.title}" data-dot="${index}"></button>`;
    })
    .join("");
};

const renderSlide = (index) => {
  activeIndex = (index + movies.length) % movies.length;
  const movie = movies[activeIndex];

  slidePoster.classList.add("is-changing");
  window.setTimeout(() => {
    slideKicker.textContent = movie.kicker;
    slideTitle.textContent = movie.title;
    slideDescription.textContent = movie.description;
    slideGenre.textContent = movie.genre;
    slideTime.textContent = movie.time;
    slideRoom.textContent = movie.room;
    slidePoster.src = movie.poster;
    slidePoster.alt = movie.alt;
    heroBg.style.setProperty("--active-poster", `url("${movie.poster}")`);
    renderDots();
    slidePoster.classList.remove("is-changing");
  }, 120);
};

const renderMovieGrid = () => {
  movieGrid.innerHTML = movies
    .map(
      (movie) => `
        <article class="movie-card">
          <img src="${movie.poster}" alt="${movie.alt}">
          <div class="movie-body">
            <p class="movie-meta">${movie.genre} &middot; ${movie.time}</p>
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <button class="trailer-button" type="button" data-trailer="${movie.title}">Trailer</button>
            <button type="button" data-ticket="${movie.title}">Prenota</button>
          </div>
        </article>
      `
    )
    .join("");
};

const restartCarousel = () => {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    renderSlide(activeIndex + 1);
  }, 5200);
};

const bindDynamicMovieButtons = () => {
  movieGrid.addEventListener("click", (event) => {
    const trailerButton = event.target.closest("[data-trailer]");
    const ticketButton = event.target.closest("[data-ticket]");
    if (trailerButton) {
      openTrailer(findMovie(trailerButton.dataset.trailer));
    }
    if (ticketButton) {
      showToast(ticketButton.dataset.ticket);
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

document.querySelector("[data-carousel-prev]").addEventListener("click", () => {
  renderSlide(activeIndex - 1);
  restartCarousel();
});

document.querySelector("[data-carousel-next]").addEventListener("click", () => {
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
  showToast(movies[activeIndex].title);
});

heroTrailer.addEventListener("click", () => {
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
