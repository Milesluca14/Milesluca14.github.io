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
      // scrolling down
      document.body.classList.add("scrolling-down");
      document.body.classList.remove("scrolling-up");
    } else {
      // scrolling up
      document.body.classList.add("scrolling-up");
      document.body.classList.remove("scrolling-down");
    }

    lastY = currentY;
  });
});
