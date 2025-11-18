// ======================================
// Dark / light mode toggle
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  // Load stored theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  // Handle toggle click
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      const newMode = isDark ? "light" : "dark";
      applyTheme(newMode);
      localStorage.setItem("theme", newMode);
    });
  }
});


// ======================================
// Gallery toggle (Home page only)
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const galleryToggle = document.getElementById("gallery-toggle");
  const galleryPreview = document.getElementById("gallery-preview");

  if (galleryToggle && galleryPreview) {
    let open = false;

    galleryToggle.addEventListener("click", () => {
      open = !open;
      galleryPreview.style.display = open ? "block" : "none";
      galleryToggle.textContent = open
        ? "Hide gallery preview"
        : "Show gallery preview";
    });
  }
});


// ======================================
// Scroll reveal animations
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const revealTargets = document.querySelectorAll(
    ".section, .block-card, .project-block, .two-column > div, .gallery-window"
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
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
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
});


// ======================================
// FLOATING BOTTOM NAV — SCROLL MOTION
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  let lastY = window.pageYOffset;

  window.addEventListener("scroll", () => {
    const currentY = window.pageYOffset;

    if (currentY > lastY) {
      // USER IS SCROLLING DOWN
      document.body.classList.add("scrolling-down");
      document.body.classList.remove("scrolling-up");
    } else {
      // USER IS SCROLLING UP
      document.body.classList.add("scrolling-up");
      document.body.classList.remove("scrolling-down");
    }

    lastY = currentY;
  });
});

// script.js

document.addEventListener("DOMContentLoaded", () => {
  setupMetricCounters();
  setupScrollTape();
});

/* Metric counters in the About section */
function setupMetricCounters() {
  const metricValues = document.querySelectorAll(".metric-value");
  if (!metricValues.length) return;

  const options = {
    threshold: 0.4
  };

  const onIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;

      // If there is nothing to animate yet, just set the text and stop.
      if (target === 0) {
        el.textContent = el.textContent;
        observer.unobserve(el);
        return;
      }

      animateNumber(el, target);
      observer.unobserve(el);
    });
  };

  const observer = new IntersectionObserver(onIntersect, options);

  metricValues.forEach((el) => observer.observe(el));
}

/* Utility to animate numbers */
function animateNumber(el, target) {
  const duration = 800;
  const start = 0;
  const startTime = performance.now();

  const isMoney = el.textContent.trim().startsWith("$");

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start + (target - start) * progress);

    if (isMoney) {
      el.textContent = `$${current.toLocaleString()}`;
    } else {
      el.textContent = current.toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

/* Scroll tape measure on the right side */
function setupScrollTape() {
  const tapeStrip = document.querySelector(".tape-strip");
  const scrollValueEl = document.getElementById("scroll-mm-value");

  if (!tapeStrip || !scrollValueEl) return;

  const maxTapeHeight = 260; // maximum added height in px as you reach bottom
  const baseTapeHeight = 30; // the initial visible length at the top
  const maxMm = 3000; // how many millimeters at the very bottom

  let ticking = false;

  function updateTape() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollRange = docHeight - winHeight;

    const ratio = scrollRange > 0 ? scrollTop / scrollRange : 0;
    const clamped = Math.min(Math.max(ratio, 0), 1);

    const tapeHeight = baseTapeHeight + maxTapeHeight * clamped;
    tapeStrip.style.height = tapeHeight + "px";

    const mm = Math.round(maxMm * clamped);
    scrollValueEl.textContent = mm.toString();

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateTape);
      ticking = true;
    }
  }

  updateTape(); // initial position
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onScroll);
}

