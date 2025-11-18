// ======================================
// Master initializer
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initGalleryToggle();
  initScrollReveal();
  initBottomNavScrollBehavior();
  setupMetricCounters();
});


// ======================================
// Dark / Light mode toggle
// ======================================
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  function applyTheme(mode) {
    document.body.classList.toggle("dark-mode", mode === "dark");
  }

  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    const newMode = isDark ? "light" : "dark";
    applyTheme(newMode);
    localStorage.setItem("theme", newMode);
  });
}


// ======================================
// Gallery toggle
// ======================================
function initGalleryToggle() {
  const galleryToggle = document.getElementById("gallery-toggle");
  const galleryPreview = document.getElementById("gallery-preview");

  if (!galleryToggle || !galleryPreview) return;

  let open = false;

  galleryToggle.addEventListener("click", () => {
    open = !open;
    galleryPreview.style.display = open ? "block" : "none";
    galleryToggle.textContent = open
      ? "Hide gallery preview"
      : "Show gallery preview";
  });
}


// ======================================
// Scroll Reveal Animations
// ======================================
function initScrollReveal() {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const revealTargets = document.querySelectorAll(
    ".section, .block-card, .project-block, .two-column > div, .gallery-window"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}


// ======================================
// Floating Bottom Nav – reacts to scroll direction
// ======================================
function initBottomNavScrollBehavior() {
  let lastY = window.pageYOffset;

  window.addEventListener("scroll", () => {
    const currentY = window.pageYOffset;

    if (currentY > lastY) {
      document.body.classList.add("scrolling-down");
      document.body.classList.remove("scrolling-up");
    } else {
      document.body.classList.add("scrolling-up");
      document.body.classList.remove("scrolling-down");
    }

    lastY = currentY;
  });
}


// ======================================
// Metric Counters (About Me section)
// ======================================
function setupMetricCounters() {
  const metricValues = document.querySelectorAll(".metric-value");
  if (!metricValues.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10) || 0;

        if (target === 0) {
          el.textContent = el.textContent;
        } else {
          animateNumber(el, target);
        }

        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  metricValues.forEach((el) => observer.observe(el));
}


// Number animation helper
function animateNumber(el, target) {
  const duration = 800;
  const start = 0;
  const isMoney = el.textContent.trim().startsWith("$");
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start + (target - start) * progress);

    el.textContent = isMoney
      ? `$${current.toLocaleString()}`
      : current.toLocaleString();

    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}


