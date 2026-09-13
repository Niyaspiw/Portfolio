/* ============================================================
   TRANSLATIONS (English + Filipino)
============================================================ */
const translations = {
  en: {
    cvBtn: "📄 Download CV",
    contactBtn: "📬 Contact Me",
    skillsTitle: "Skills",
    projectsTitle: "Projects",
    certsTitle: "Certifications",
    contactTitle: "You can contact me here",
    eduTitle: "Education",
    roleText: "Aspiring Developer · Java · Python · SQL",
    langLabel: "🌐 EN",
  },
  fil: {
    cvBtn: "📄 I-download ang CV",
    contactBtn: "📬 Makipag-ugnayan",
    skillsTitle: "Mga Kasanayan",
    projectsTitle: "Mga Proyekto",
    certsTitle: "Mga Sertipiko",
    contactTitle: "Makipag-ugnayan sa akin dito",
    eduTitle: "Edukasyon",
    roleText: "Nagsisimulang Developer · Java · Python · SQL",
    langLabel: "🌐 FIL",
  }
};

let currentLang = "en";

/* ============================================================
   SPLASH SCREEN
============================================================ */
const splash = document.getElementById("splash");
const enterBtn = document.getElementById("enterBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const volumeSlider = document.getElementById("volumeSlider");

// Lock scrolling while splash is visible
document.body.classList.add("splash-active");

// If splash was already dismissed this session, skip it
if (sessionStorage.getItem("entered") === "yes") {
  splash.classList.add("hidden");
  document.body.classList.remove("splash-active");
}

enterBtn.addEventListener("click", () => {
  // Play music
  bgMusic.volume = parseFloat(volumeSlider.value);
  bgMusic.play().then(() => {
    musicToggle.textContent = "⏸️";
  }).catch(err => {
    console.warn("Music failed to play:", err);
  });

  // Fade out splash
  splash.classList.add("hidden");
  document.body.classList.remove("splash-active");

  // Remember for this session
  sessionStorage.setItem("entered", "yes");
});

/* ============================================================
   LANGUAGE TOGGLE
============================================================ */
const langToggle = document.getElementById("langToggle");

function applyLanguage(lang) {
  const t = translations[lang];

  document.getElementById("cvBtn").textContent = t.cvBtn;
  document.getElementById("contactBtn").textContent = t.contactBtn;
  document.getElementById("skillsTitle").textContent = t.skillsTitle;
  document.getElementById("projectsTitle").textContent = t.projectsTitle;
  document.getElementById("certsTitle").textContent = t.certsTitle;
  document.getElementById("contactTitle").textContent = t.contactTitle;

  const eduEl = document.getElementById("eduTitle");
  if (eduEl) eduEl.textContent = t.eduTitle;

  document.getElementById("roleText").textContent = t.roleText;
  langToggle.textContent = t.langLabel;
  document.documentElement.lang = lang === "fil" ? "tl" : "en";
}

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fil" : "en";
  applyLanguage(currentLang);
});

/* ============================================================
   THEME TOGGLE + PROFILE PICTURE SWAP
============================================================ */
const themeToggle = document.getElementById("themeToggle");
const pfp = document.getElementById("pfp");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateThemeUI(savedTheme);

function updateThemeUI(theme) {
  if (theme === "dark") {
    themeToggle.textContent = "🌙";
    pfp.src = "assets/dork.jpg";
  } else {
    themeToggle.textContent = "☀️";
    pfp.src = "assets/layt.jpg";
  }
}

themeToggle.addEventListener("click", () => {
  const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeUI(newTheme);
});

/* ============================================================
   MUSIC CONTROLS
============================================================ */
bgMusic.volume = parseFloat(volumeSlider.value);

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicToggle.textContent = "⏸️";
    }).catch(err => {
      console.warn("Autoplay blocked until user interacts.", err);
    });
  } else {
    bgMusic.pause();
    musicToggle.textContent = "▶️";
  }
});

volumeSlider.addEventListener("input", (e) => {
  bgMusic.volume = parseFloat(e.target.value);
});

/* ============================================================
   SCROLL REVEAL ANIMATIONS
============================================================ */
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

/* ============================================================
   INITIAL LANGUAGE LOAD
============================================================ */
applyLanguage(currentLang);