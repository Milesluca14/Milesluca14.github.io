// Dark / light mode toggle
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

// Simple gallery preview toggle on home page
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

// ================================
// Smooth scroll reveal on scroll
// ================================
(function () {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    // Do not apply animated reveal if user prefers reduced motion
    return;
  }

  const revealTargets = document.querySelectorAll(
    ".section, .block-card, .project-block, .two-column > div, .gallery-window"
  );

  if (!revealTargets.length) return;

  // Mark elements as revealable; CSS handles base state
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
      {
        threshold: 0.12,
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Fallback: if IO not supported, just show everything
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
})();
