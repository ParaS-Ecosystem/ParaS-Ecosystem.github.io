const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
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

// ==========================================================================
// Scroll progress bar + sticky-nav shadow
// ==========================================================================
const scrollProgress = document.getElementById('scrollProgress');
const siteNav = document.getElementById('siteNav');
function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
  if (siteNav) siteNav.classList.toggle('is-scrolled', scrollTop > 8);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ==========================================================================
// Scroll-spy
// ==========================================================================
const sectionIds = ['about', 'hardware', 'architecture', 'try-it', 'projects', 'governance'];
const navAnchors = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
if ('IntersectionObserver' in window && navAnchors.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });
}

// ==========================================================================
// Scroll-reveal
// ==========================================================================
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('is-visible'));
}

// ==========================================================================
// Live architecture diagram — click a target to highlight + describe it
// ==========================================================================
const ARCH_INFO = {
  CPU:  'x86 &amp; ARM, via OpenMP — public today',
  GPU:  'CUDA-enabled NVIDIA GPUs are public; AMD (ROCm) is in development',
  NPU:  'Emerging accelerator target — in development',
  FPGA: 'Emerging accelerator target — in development',
  QPU:  'Emerging accelerator target — in development',
};
(() => {
  const boxes = document.querySelectorAll('#architecture .target-box');
  const readout = document.getElementById('archReadout');
  if (!boxes.length || !readout) return;
  boxes.forEach(box => {
    const label = box.querySelector('text')?.textContent?.trim();
    const activate = () => {
      boxes.forEach(b => b.classList.remove('is-active'));
      box.classList.add('is-active');
      const info = ARCH_INFO[label] || label;
      readout.innerHTML = `<span>${label ? `<strong>${label}</strong> — ${info}` : info}</span>`;
    };
    box.addEventListener('click', activate);
    box.addEventListener('mouseenter', activate);
  });
})();

// ==========================================================================
// Hardware tabs (Supported hardware) — same pattern as the Try it tabs
// ==========================================================================
const HW_INFO = {
  compiler: { name: 'ParaS Compiler', license: 'Apache-2.0', repo: 'ParaS-Compiler' },
  clap:     { name: 'CLAP Library', license: 'LGPL-3.0', repo: 'CLAP-Library' },
  torch:    { name: 'Framework-Torch-ParaS', license: 'LGPL-3.0', repo: 'Framework-Torch-ParaS' },
};
const hwTabs = document.querySelectorAll('.hw-tab');
const hwPanelName = document.getElementById('hwPanelName');
const hwPanelLicense = document.getElementById('hwPanelLicense');
hwTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.getAttribute('data-hw-tab');
    hwTabs.forEach(t => t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('[id^="hwPane-"]').forEach(pane => {
      pane.hidden = pane.id !== `hwPane-${key}`;
    });
    const info = HW_INFO[key];
    if (info) {
      if (hwPanelName) hwPanelName.textContent = info.name;
      if (hwPanelLicense) {
        hwPanelLicense.textContent = info.license;
        hwPanelLicense.href = `https://github.com/ParaS-Ecosystem/${info.repo}`;
      }
    }
  });
});

// ==========================================================================
// Terminal tabs (Try it)
// ==========================================================================
const terminalTabs = document.querySelectorAll('.terminal-tab');
const terminalName = document.getElementById('terminalName');
terminalTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.getAttribute('data-tab');
    terminalTabs.forEach(t => t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('[id^="terminalPane-"]').forEach(pane => {
      pane.hidden = pane.id !== `terminalPane-${key}`;
    });
    if (terminalName) terminalName.textContent = `terminal — ${key}`;
  });
});

// ==========================================================================
// Copy to clipboard
// ==========================================================================
document.querySelectorAll('[data-copy-target]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-copy-target');
    const container = document.getElementById(targetId);
    if (!container) return;
    const visiblePane = container.querySelector('[id^="terminalPane-"]:not([hidden])') || container;
    const text = visiblePane.innerText;
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch (err) {
      btn.textContent = 'Select manually';
    }
    setTimeout(() => { btn.textContent = original; }, 1600);
  });
});

// ==========================================================================
// Live GitHub stats — fetched client-side from the public GitHub API.
// Real numbers, not hardcoded. Fails gracefully if unreachable/rate-limited.
// ==========================================================================
(async () => {
  const repoCards = document.querySelectorAll('.project-card[data-repo]');
  if (!repoCards.length) return;

  let totalStars = 0;
  let ok = 0;

  await Promise.all(Array.from(repoCards).map(async (card) => {
    const repo = card.getAttribute('data-repo');
    try {
      const res = await fetch(`https://api.github.com/repos/ParaS-Ecosystem/${repo}`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!res.ok) return;
      const data = await res.json();
      const stars = data.stargazers_count;
      if (typeof stars === 'number') {
        const starPill = card.querySelector('[data-stars]');
        if (starPill) starPill.textContent = `★ ${stars}`;
        totalStars += stars;
        ok++;
      }
    } catch (err) {
      // offline or rate-limited — leave the placeholder
    }
  }));

  const heroStats = document.getElementById('heroStats');
  if (heroStats && ok > 0) {
    const live = document.createElement('span');
    live.className = 'pill pill--live';
    live.textContent = 'live from GitHub';
    heroStats.appendChild(live);

    const stars = document.createElement('span');
    stars.className = 'pill pill--stat';
    stars.textContent = `★ ${totalStars} stars across the ecosystem`;
    stars.style.animationDelay = '0.1s';
    heroStats.appendChild(stars);
  }
})();
