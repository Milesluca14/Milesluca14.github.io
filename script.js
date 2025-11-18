document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initScrollReveal();
  initBottomNavScrollBehavior();
  setupMetricCounters();
  initBackToTop();
});

/* ======================================
   DARK / LIGHT MODE
====================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  function applyTheme(mode) {
    document.body.classList.toggle("dark-mode", mode === "dark");
  }

  const saved = localStorage.getItem("theme");
  applyTheme(saved === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    const newMode = isDark ? "light" : "dark";
    applyTheme(newMode);
    localStorage.setItem("theme", newMode);
  });
}

/* ======================================
   SCROLL REVEAL
====================================== */
function initScrollReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const targets = document.querySelectorAll(
    ".section, .block-card, .project-block, .two-column > div, .gallery-window"
  );

  targets.forEach(el => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => obs.observe(el));
}

/* ======================================
   FLOATING NAV BAR – MOTION BASED ON SCROLL
====================================== */
function initBottomNavScrollBehavior() {
  let last = window.pageYOffset;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;

    if (current > last) {
      document.body.classList.add("scrolling-down");
      document.body.classList.remove("scrolling-up");
    } else {
      document.body.classList.add("scrolling-up");
      document.body.classList.remove("scrolling-down");
    }

    last = current;
  });
}

/* ======================================
   METRIC COUNTERS
====================================== */
function setupMetricCounters() {
  const nums = document.querySelectorAll(".metric-value");
  if (!nums.length) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const isMoney = el.textContent.trim().startsWith("$");

      animateNumber(el, target, isMoney);
      observer.unobserve(el);
    });
  }, { threshold: 0.45 });

  nums.forEach(el => obs.observe(el));
}

function animateNumber(el, target, isMoney) {
  const duration = 800;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(target * progress);

    el.textContent = isMoney
      ? `$${value.toLocaleString()}`
      : value.toLocaleString();

    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/* ======================================
   BACK TO TOP BUTTON
====================================== */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 450 ? "block" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
