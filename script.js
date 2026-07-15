const movies = [
  {
    title: "Avatar: Fire and Ash",
    kicker: "Ora in programmazione",
    description: "Grande spettacolo sci-fi in sala principale, pensato per una serata evento.",
    genre: "Sci-fi",
    time: "18:00 / 21:30",
    room: "Sala 1",
    poster: "assets/poster-avatar-fire-and-ash-2k.jpg",
    alt: "Locandina Avatar: Fire and Ash",
    trailerEmbed: "https://www.youtube.com/embed/bf38f_JINyw",
  },
  {
    title: "Zootopia 2",
    kicker: "Family show",
    description: "Animazione per famiglie con spettacoli pomeridiani e weekend.",
    genre: "Animazione",
    time: "16:30 / 18:45",
    room: "Sala 2",
    poster: "assets/poster-zootopia-2-2k.jpg",
    alt: "Locandina Zootopia 2",
    trailerEmbed: "https://www.youtube.com/embed/BjkIOU5PhyQ",
  },
  {
    title: "Superman",
    kicker: "Prima serata",
    description: "Blockbuster d'azione per dare ritmo alla programmazione serale.",
    genre: "Azione",
    time: "19:15 / 22:00",
    room: "Sala 1",
    poster: "assets/poster-superman-2025-2k.jpg",
    alt: "Locandina Superman",
    trailerEmbed: "https://www.youtube.com/embed/Ox8ZLF6cGM0",
  },
];

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
const trailerModal = document.querySelector("[data-trailer-modal]");
const trailerFrame = document.querySelector("[data-trailer-frame]");
const trailerTitle = document.querySelector("[data-trailer-title]");
let activeIndex = 0;
let carouselTimer;

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
  if (!movie) return;
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

const restartCarousel = () => {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    renderSlide(activeIndex + 1);
  }, 5200);
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

document.querySelectorAll("[data-ticket]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.dataset.ticket);
  });
});

document.querySelectorAll("[data-trailer]").forEach((button) => {
  button.addEventListener("click", () => {
    openTrailer(findMovie(button.dataset.trailer));
  });
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
renderSlide(0);
restartCarousel();
syncHeader();
