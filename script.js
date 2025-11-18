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
// Scroll Tape Measure – scroll-linked + draggable
// ======================================
function setupScrollTape() {
  const tapeStrip = document.querySelector(".tape-strip");
  const tapeTrack = document.querySelector(".tape-track");
  const scrollValueEl = document.getElementById("scroll-mm-value");

  if (!tapeStrip || !tapeTrack || !scrollValueEl) return;

  const maxMm = 3000; // reading at bottom of page
  let ticking = false;
  let dragging = false;

  function getScrollRange() {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    return Math.max(docHeight - winHeight, 0);
  }

  function updateFromScroll() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollRange = getScrollRange();

    const ratio = scrollRange > 0 ? scrollTop / scrollRange : 0;
    const clamped = Math.min(Math.max(ratio, 0), 1);

    const viewHeight = tapeStrip.offsetHeight;
    const trackHeight = tapeTrack.offsetHeight;
    const maxOffset = Math.max(trackHeight - viewHeight, 0);

    // Move tape upward as page scrolls down (0 at top)
    const offset = -maxOffset * clamped;
    tapeTrack.style.transform = `translateY(${offset}px)`;

    const mm = Math.round(maxMm * clamped);
    scrollValueEl.textContent = mm;

    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateFromScroll);
      ticking = true;
    }
  }

  // Convert pointer position on tape into scroll position
  function scrollFromPointer(clientY) {
    const rect = tapeStrip.getBoundingClientRect();
    if (rect.height <= 0) return;

    const relativeY = clientY - rect.top;
    let ratio = relativeY / rect.height;
    ratio = Math.min(Math.max(ratio, 0), 1);

    const scrollRange = getScrollRange();
    const newTop = scrollRange * ratio;

    window.scrollTo({ top: newTop, behavior: "auto" });
  }

  // Mouse drag
  function onMouseDown(e) {
    dragging = true;
    document.body.classList.add("no-select");
    scrollFromPointer(e.clientY);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    scrollFromPointer(e.clientY);
  }

  function onMouseUp() {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("no-select");
  }

  tapeStrip.addEventListener("mousedown", onMouseDown);
  document
    .querySelector(".tape-indicator")
    ?.addEventListener("mousedown", onMouseDown);

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  // Touch drag
  function onTouchStart(e) {
    dragging = true;
    document.body.classList.add("no-select");
    scrollFromPointer(e.touches[0].clientY);
  }

  function onTouchMove(e) {
    if (!dragging) return;
    scrollFromPointer(e.touches[0].clientY);
    e.preventDefault();
  }

  function onTouchEnd() {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("no-select");
  }

  tapeStrip.addEventListener("touchstart", onTouchStart, { passive: false });
  tapeStrip.addEventListener("touchmove", onTouchMove, { passive: false });
  tapeStrip.addEventListener("touchend", onTouchEnd);
  document
    .querySelector(".tape-indicator")
    ?.addEventListener("touchstart", onTouchStart, { passive: false });

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);

  // Initial position
  updateFromScroll();
}
