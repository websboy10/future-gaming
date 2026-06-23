/* ═══════════════════════════════════════════════
   FUTURE ESPORT — Editorial sub-site JS
   Reuses shared tokens/nav from ../style.css; owns its own page behaviours.
   ═══════════════════════════════════════════════ */

import '../style.css';
import './esport.css';

const nav = document.getElementById('phantom-nav');
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

// ── 1. HEADER — Scroll Detection + Active Nav ─
const sectionIds = ['mission', 'soejler', 'for-alle', 'mennesker', 'nyheder', 'kontakt'];
const sectionEls = sectionIds.map(id => document.getElementById(id));

function updateActiveNav() {
  const scrollY = window.scrollY;
  const triggerPoint = scrollY + nav.offsetHeight + 40;

  let activeId = null;
  for (let i = 0; i < sectionEls.length; i++) {
    const section = sectionEls[i];
    if (!section) continue;
    if (triggerPoint >= section.offsetTop) {
      activeId = sectionIds[i];
    } else {
      break;
    }
  }
  if ((window.innerHeight + scrollY) >= document.documentElement.scrollHeight - 20) {
    activeId = sectionIds[sectionIds.length - 1];
  }

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === activeId);
  });
}

function handleScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}
window.addEventListener('scroll', handleScroll, { passive: true });

// ── 2. HAMBURGER MENU ────────────────────────
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  });
}
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── 3. HERO — Rotating word (Udvikling / Håb / Fællesskab) ─
function initRotator() {
  const rotator = document.getElementById('es-rotator');
  if (!rotator) return;
  const wordEl = rotator.querySelector('.es-rotator-word');
  if (!wordEl) return;

  const words = ['Udvikling', 'Håb', 'Fællesskab'];
  let idx = 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(() => {
    wordEl.classList.remove('is-active');
    wordEl.classList.add('is-leaving');
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      wordEl.textContent = words[idx];
      wordEl.classList.remove('is-leaving');
      void wordEl.offsetWidth; // force reflow so the enter transition replays
      wordEl.classList.add('is-active');
    }, 500);
  }, 2400);
}

// ── 4. SCROLL REVEAL ─────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('.es-reveal').forEach((el) => revealObserver.observe(el));

// ── 5. SMOOTH SCROLL WITH OFFSET ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 24;
    window.scrollTo({ top, behavior: 'smooth' });

    if (mobileOverlay.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ── 6. FOOTER MATRIX RAIN (shared motif) ─────
function createMatrixRain() {
  const container = document.getElementById('footer-matrix');
  if (!container) return;
  const chars = '01アイウエオカキクケコ';
  const columns = Math.floor(window.innerWidth / 20);
  for (let i = 0; i < Math.min(columns, 60); i++) {
    const span = document.createElement('span');
    span.style.cssText = `
      position: absolute;
      left: ${(i / columns) * 100}%;
      top: -20px;
      font-family: 'Orbitron', monospace;
      font-size: 10px;
      color: var(--red);
      animation: matrixFall ${4 + Math.random() * 6}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    container.appendChild(span);
  }
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initRotator();
  createMatrixRain();
  updateActiveNav();

  document.querySelectorAll('.hero-cta').forEach(cta => cta.classList.add('visible'));
});
