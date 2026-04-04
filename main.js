/* ═══════════════════════════════════════════════
   FUTURE GAMING — Main JavaScript
   ═══════════════════════════════════════════════ */

import './style.css';

// ── DOM Elements ──────────────────────────────
const nav = document.getElementById('phantom-nav');
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');
const sandwichSection = document.getElementById('sandwich-bar');
const sandwichVideo = document.querySelector('.sandwich-hero-video');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

// ── 1. HEADER — Scroll Detection + Active Nav ─
const sectionIds = ['events', 'sandwich-bar', 'games', 'reviews', 'pricing', 'booking', 'contact'];
const sectionEls = sectionIds.map(id => document.getElementById(id));

function updateActiveNav() {
  const scrollY = window.scrollY;
  const navHeight = nav.offsetHeight;
  const triggerPoint = scrollY + navHeight + 40; // offset below header

  // Default: no section active (at top / hero)
  let activeId = null;

  // Walk sections top-to-bottom; the last one whose top is above the trigger wins
  for (let i = 0; i < sectionEls.length; i++) {
    const section = sectionEls[i];
    if (!section) continue;
    const sectionTop = section.offsetTop;
    if (triggerPoint >= sectionTop) {
      activeId = sectionIds[i];
    } else {
      break; // sections are in order, no need to keep checking
    }
  }

  // Also check if we've scrolled to the very bottom (activate last section)
  if ((window.innerHeight + scrollY) >= document.documentElement.scrollHeight - 20) {
    activeId = sectionIds[sectionIds.length - 1];
  }

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === activeId);
  });
}

function handleScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  updateActiveNav();
}
window.addEventListener('scroll', handleScroll, { passive: true });

// ── 2. HAMBURGER MENU ────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileOverlay.classList.toggle('active');
  document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── 3. HERO — Letter-by-Letter Reveal ────────
function animateHeroTitle() {
  const nodes = Array.from(heroTitle.childNodes);
  heroTitle.innerHTML = '';
  heroTitle.style.opacity = '1';

  let charIndex = 0;
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Clean up whitespace: replace newlines/tabs with a single space,
      // but only if it's not completely empty text
      let text = node.textContent;
      if (text.trim() === '') return; 
      
      // Split on regular whitespace while preserving non-breaking spaces
      // so intentional no-wrap phrases like "NÆSTE EVENT" stay together.
      const tokens = text.split(/([ \t\r\n]+)/);
      
      tokens.forEach(token => {
        if (!token.trim()) {
          // It's whitespace, just append as text node or simple span
          const spaceSpan = document.createElement('span');
          spaceSpan.textContent = token;
          heroTitle.appendChild(spaceSpan);
        } else {
          // Wrapped word to keep it together
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          
          for (let i = 0; i < token.length; i++) {
            const char = token[i];
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = char;
            span.style.animationDelay = `${charIndex * 0.05 + 0.3}s`;
            charIndex++;
            wordSpan.appendChild(span);
          }
          heroTitle.appendChild(wordSpan);
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Preserve HTML elements like <br>
      const clone = node.cloneNode(true);
      heroTitle.appendChild(clone);
    }
  });
}

// ── 4. HERO — Subtitle Typewriter ────────────
function animateSubtitle() {
  const originalText = heroSubtitle.textContent;
  heroSubtitle.textContent = '';
  heroSubtitle.style.opacity = '1';

  const cursor = document.createElement('span');
  cursor.className = 'cursor';

  let i = 0;
  const textNode = document.createTextNode('');
  heroSubtitle.appendChild(textNode);
  heroSubtitle.appendChild(cursor);

  function type() {
    if (i < originalText.length) {
      textNode.textContent += originalText[i];
      i++;
      setTimeout(type, 40 + Math.random() * 30);
    }
  }

  setTimeout(type, 1400);
}

// ── 5. SECTION VIDEOS — Audio While In View ──
function initSectionVideoAudio() {
  const managedVideos = [
    { section: sandwichSection, video: sandwichVideo, ratio: 0, inView: false, priority: 0 }
  ].filter(item => item.section && item.video);

  if (!managedVideos.length) return;

  let audioUnlocked = false;

  managedVideos.forEach(({ video }) => {
    video.volume = 1;
    video.muted = true;
  });

  function getActiveVideo() {
    if (document.visibilityState !== 'visible') return null;

    return managedVideos
      .filter(item => item.inView)
      .sort((a, b) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
        return a.priority - b.priority;
      })[0] || null;
  }

  async function syncSectionVideoAudio() {
    const activeVideo = audioUnlocked ? getActiveVideo() : null;

    await Promise.all(managedVideos.map(async (item) => {
      const shouldPlayWithSound = activeVideo === item;
      item.video.muted = !shouldPlayWithSound;

      if (shouldPlayWithSound) {
        try {
          await item.video.play();
        } catch (error) {
          item.video.muted = true;
        }
      }
    }));
  }

  async function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('wheel', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('touchmove', unlockAudio);
    await syncSectionVideoAudio();
  }

  const sectionVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const item = managedVideos.find(candidate => candidate.section === entry.target);
        if (!item) return;
        item.ratio = entry.intersectionRatio;
        item.inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      });
      syncSectionVideoAudio();
    },
    { threshold: [0, 0.15, 0.35, 0.6, 1] }
  );

  managedVideos.forEach(({ section }) => sectionVideoObserver.observe(section));
  document.addEventListener('visibilitychange', syncSectionVideoAudio);
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('wheel', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchmove', unlockAudio, { once: true, passive: true });
}

// ── 6. SCROLL REVEAL — IntersectionObserver ──
const revealElements = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-diagonal-left, .reveal-diagonal-right, .reveal-badge'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));


// ── 7. COUNTER ANIMATION ─────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseInt(entry.target.dataset.target);
          const duration = 1500;
          const start = Date.now();

          function updateCounter() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            entry.target.textContent = current;
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }
          requestAnimationFrame(updateCounter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

// ── 8. LOADING BAR ───────────────────────────
const loadingBar = document.querySelector('.loading-bar');
if (loadingBar) {
  const loadingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          loadingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  loadingObserver.observe(loadingBar);
}

// ── 9. FOOTER MATRIX RAIN ───────────────────
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

// ── 10. SMOOTH SCROLL WITH OFFSET ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      
      let scrollTarget = target;
      // Focus on the red section tag / header if it exists in the section
      const sectionHeader = target.querySelector('.section-header');
      if (sectionHeader) {
        scrollTarget = sectionHeader;
      }

      // Offset by navHeight and add a nice 24px visual padding above the red tag
      const targetPosition = scrollTarget.getBoundingClientRect().top + window.scrollY - navHeight - 24;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (mobileOverlay.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});

// ── 11. CARD 3D TILT ─────────────────────────
function initCardTilt() {
  // Skip on touch devices — the CSS handles disabling transforms
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.price-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = card.classList.contains('featured')
        ? 'translateY(-12px)'
        : 'translateY(0)';
    });
  });
}

// ── 12. MINI BOOKING FORM HANDLER ─────────────
function initMiniBookingForm() {
  const miniForm = document.getElementById('mini-booking-form');
  if (!miniForm) return;

  miniForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('mini-form-submit');
    const ctaText = btn.querySelector('.cta-text');

    // Basic validation
    const name = document.getElementById('mini-name').value.trim();
    const email = document.getElementById('mini-email').value.trim();
    const eventType = document.getElementById('mini-type').value;

    if (!name || !email || !eventType) {
      btn.style.animation = 'none';
      btn.offsetHeight;
      btn.style.animation = 'shake 0.5s ease-in-out';
      return;
    }

    const originalText = ctaText.textContent;
    ctaText.textContent = 'Sender...';
    btn.disabled = true;

    try {
      const formData = new FormData(miniForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        btn.classList.add('success');
        ctaText.textContent = 'Sendt!';
        miniForm.reset();
        setTimeout(() => {
          btn.classList.remove('success');
          ctaText.textContent = originalText;
        }, 3000);
      } else {
        ctaText.textContent = 'Fejl - Proev igen';
        setTimeout(() => { ctaText.textContent = originalText; }, 3000);
      }
    } catch (error) {
      ctaText.textContent = 'Fejl - Proev igen';
      setTimeout(() => { ctaText.textContent = originalText; }, 3000);
    } finally {
      btn.disabled = false;
    }
  });
}

// ── 13. BOOKING FORM HANDLER ─────────────────
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-submit');
    const submitText = btn.querySelector('.submit-text');

    // Basic validation
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const eventType = document.getElementById('booking-type').value;

    if (!name || !email || !eventType) {
      btn.style.animation = 'none';
      btn.offsetHeight;
      btn.style.animation = 'shake 0.5s ease-in-out';
      return;
    }

    const originalText = submitText.textContent;
    submitText.textContent = 'Sender...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        btn.classList.add('success');
        submitText.textContent = 'Sendt!';
        form.reset();
        setTimeout(() => {
          btn.classList.remove('success');
          submitText.textContent = originalText;
        }, 3000);
      } else {
        submitText.textContent = 'Fejl - Proev igen';
        setTimeout(() => { submitText.textContent = originalText; }, 3000);
      }
    } catch (error) {
      submitText.textContent = 'Fejl - Proev igen';
      setTimeout(() => { submitText.textContent = originalText; }, 3000);
    } finally {
      btn.disabled = false;
    }
  });
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  animateHeroTitle();
  animateSubtitle();
  initSectionVideoAudio();
  animateCounters();
  initCardTilt();
  createMatrixRain();
  initMiniBookingForm();
  initBookingForm();
  updateActiveNav();

  // Make CTAs visible for animations
  const heroCtas = document.querySelectorAll('.hero-cta');
  heroCtas.forEach(cta => cta.classList.add('visible'));
  
  if (heroSubtitle) heroSubtitle.classList.add('visible');

  // Trigger stat badges
  const badges = document.querySelectorAll('.reveal-badge');
  setTimeout(() => {
    badges.forEach(b => b.classList.add('visible'));
  }, 800);
});
