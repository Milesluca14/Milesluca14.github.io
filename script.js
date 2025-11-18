// ======================================
// Master initializer
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initGalleryToggle();
  initScrollReveal();
  initBottomNavScrollBehavior();
  setupMetricCounters();
  setupScrollTape();
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


// ======================================
// Scroll Tape Measure – grows & displays mm
// ======================================
function setupScrollTape() {
  const tapeStrip = document.querySelector(".tape-strip");
  const scrollValueEl = document.getElementById("scroll-mm-value");
  if (!tapeStrip || !scrollValueEl) return;

  const maxTapeHeight = 260;  // px
  const baseTapeHeight = 30;  // px at page top
  const maxMm = 3000;         // reading at page bottom

  let ticking = false;

  function updateTape() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollRange = docHeight - winHeight;

    const ratio = scrollRange > 0 ? scrollTop / scrollRange : 0;
    const clamped = Math.min(Math.max(ratio, 0), 1);

    const newHeight = baseTapeHeight + maxTapeHeight * clamped;
    tapeStrip.style.height = `${newHeight}px`;

    const mm = Math.round(maxMm * clamped);
    scrollValueEl.textContent = mm;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateTape);
      ticking = true;
    }
  }

  updateTape(); // initialize on load
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onScroll);
}

