// Fade-in animation:
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Expandable gallery
const galleryToggle = document.getElementById("gallery-toggle");
const galleryPanel = document.getElementById("gallery-panel");

if (galleryToggle && galleryPanel) {
  let open = false;

  galleryToggle.addEventListener("click", () => {
    open = !open;

    if (open) {
      galleryPanel.classList.add("open");
      galleryPanel.style.maxHeight = galleryPanel.scrollHeight + "px";
      galleryToggle.textContent = "Hide gallery";
    } else {
      galleryPanel.style.maxHeight = galleryPanel.scrollHeight + "px";
      void galleryPanel.offsetHeight; 
      galleryPanel.style.maxHeight = "0";
      galleryPanel.classList.remove("open");
      galleryToggle.textContent = "Show gallery";
    }
  });
}
