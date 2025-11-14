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
    galleryToggle.textContent = open ? "Hide gallery preview" : "Show gallery preview";
  });
}
