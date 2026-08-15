// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll-triggered draw-in for the schematic lines (respects reduced motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const lines = document.querySelectorAll('.stack-diagram line, .stack-diagram path, .hero__diagram .draw-line');
  lines.forEach(line => {
    const length = line.getTotalLength ? line.getTotalLength() : 40;
    line.style.strokeDasharray = String(length);
    line.style.strokeDashoffset = String(length);
    line.style.transition = 'stroke-dashoffset 0.9s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('line, path').forEach((el, i) => {
          setTimeout(() => { el.style.strokeDashoffset = '0'; }, i * 90);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stack-diagram, .hero__diagram').forEach(el => observer.observe(el));
}
