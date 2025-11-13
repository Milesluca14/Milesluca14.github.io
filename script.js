// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Expandable project cards
document.querySelectorAll('.project-card').forEach(card => {
  const button = card.querySelector('.toggle-card');
  const more = card.querySelector('.card-more');

  if (!button || !more) return;

  let open = false;

  button.addEventListener('click', () => {
    open = !open;

    if (open) {
      more.classList.add('open');
      // Use scrollHeight so the transition looks natural
      more.style.maxHeight = more.scrollHeight + 'px';
      button.textContent = 'Hide details';
    } else {
      more.style.maxHeight = more.scrollHeight + 'px';
      // Trigger layout so the browser notices the change
      void more.offsetHeight;
      more.style.maxHeight = '0';
      button.textContent = 'Show full details';
      more.classList.remove('open');
    }
  });
});

// Reveal sections on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

document.querySelectorAll('.fade-section').forEach(section => {
  observer.observe(section);
});

// Current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
