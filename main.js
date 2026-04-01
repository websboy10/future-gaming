/* ═══════════════════════════════════════════════
   FUTURE GAMING — Main JavaScript
   ═══════════════════════════════════════════════ */

import './style.css';

// ── DOM Elements ──────────────────────────────
const nav = document.getElementById('phantom-nav');
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

// ── 1. HEADER — Scroll Detection + Active Nav ─
const sectionIds = ['events', 'sandwich-bar', 'about', 'pricing', 'games', 'booking', 'contact'];
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
      
      // Split text into words and spaces to avoid mid-word line breaks
      const tokens = text.split(/(\s+)/);
      
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

// ── 5. SCROLL REVEAL — IntersectionObserver ──
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

// ── 9. BULK BAR PROGRESS ─────────────────────
const bulkOptions = document.querySelectorAll('.bulk-option');
if (bulkOptions.length) {
  const bulkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          bulkObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  bulkOptions.forEach((opt) => bulkObserver.observe(opt));
}

// ── 10. FOOTER MATRIX RAIN ───────────────────
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

// ── 11. SMOOTH SCROLL WITH OFFSET ────────────
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

// ── 12. CARD 3D TILT ─────────────────────────
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

// ── 13. MINI BOOKING FORM HANDLER ─────────────
function initMiniBookingForm() {
  const miniForm = document.getElementById('mini-booking-form');
  if (!miniForm) return;

  miniForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const name = document.getElementById('mini-name').value.trim();
    const email = document.getElementById('mini-email').value.trim();
    const phone = document.getElementById('mini-phone').value.trim();
    const eventType = document.getElementById('mini-type').value;
    const date = document.getElementById('mini-date').value;
    const guests = document.getElementById('mini-guests').value;
    const message = document.getElementById('mini-message').value.trim();

    // Basic validation
    if (!name || !email || !eventType) {
      // Shake the submit button for feedback
      const btn = document.getElementById('mini-form-submit');
      btn.style.animation = 'none';
      btn.offsetHeight; // trigger reflow
      btn.style.animation = 'shake 0.5s ease-in-out';
      return;
    }

    // Build event type label
    const eventLabels = {
      birthday: 'Fødselsdag',
      company: 'Firma Event',
      school: 'Skole eSport Session',
      other: 'Andet'
    };

    // Build mailto
    const subject = encodeURIComponent(`Event Forespørgsel (Hurtig) - ${eventLabels[eventType] || eventType}`);
    const body = encodeURIComponent(
      `Hej Future Gaming!\n\n` +
      `Jeg vil gerne booke et event:\n\n` +
      `Navn: ${name}\n` +
      `Email: ${email}\n` +
      `Telefon: ${phone || 'Ikke angivet'}\n` +
      `Event Type: ${eventLabels[eventType] || eventType}\n` +
      `Ønsket Dato: ${date || 'Ikke angivet'}\n` +
      `Antal Gæster: ${guests || 'Ikke angivet'}\n\n` +
      `Besked:\n${message || 'Ingen besked'}\n\n` +
      `Med venlig hilsen,\n${name}`
    );

    window.location.href = `mailto:sehit@degirmenci.dk?subject=${subject}&body=${body}`;

    // Show success state
    const btn = document.getElementById('mini-form-submit');
    btn.classList.add('success');
    btn.querySelector('.cta-text').textContent = 'Email Aabnet';
    
    setTimeout(() => {
      btn.classList.remove('success');
      btn.querySelector('.cta-text').textContent = 'Send Forespoergsel';
    }, 3000);
  });
}

// ── 14. BOOKING FORM HANDLER ─────────────────
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const eventType = document.getElementById('booking-type').value;
    const date = document.getElementById('booking-date').value;
    const guests = document.getElementById('booking-guests').value;
    const message = document.getElementById('booking-message').value.trim();

    // Basic validation
    if (!name || !email || !eventType) {
      // Shake the submit button for feedback
      const btn = document.getElementById('form-submit');
      btn.style.animation = 'none';
      btn.offsetHeight; // trigger reflow
      btn.style.animation = 'shake 0.5s ease-in-out';
      return;
    }

    // Build event type label
    const eventLabels = {
      birthday: 'Fødselsdag',
      company: 'Firma Event',
      school: 'Skole eSport Session',
      other: 'Andet'
    };

    // Build mailto
    const subject = encodeURIComponent(`Event Forespørgsel - ${eventLabels[eventType] || eventType}`);
    const body = encodeURIComponent(
      `Hej Future Gaming!\n\n` +
      `Jeg vil gerne booke et event:\n\n` +
      `Navn: ${name}\n` +
      `Email: ${email}\n` +
      `Telefon: ${phone || 'Ikke angivet'}\n` +
      `Event Type: ${eventLabels[eventType] || eventType}\n` +
      `Ønsket Dato: ${date || 'Ikke angivet'}\n` +
      `Antal Gæster: ${guests || 'Ikke angivet'}\n\n` +
      `Besked:\n${message || 'Ingen besked'}\n\n` +
      `Med venlig hilsen,\n${name}`
    );

    window.location.href = `mailto:sehit@degirmenci.dk?subject=${subject}&body=${body}`;

    // Show success state
    const btn = document.getElementById('form-submit');
    btn.classList.add('success');
    btn.querySelector('.submit-text').textContent = 'Email Aabnet';
    
    setTimeout(() => {
      btn.classList.remove('success');
      btn.querySelector('.submit-text').textContent = 'Send Forespørgsel';
    }, 3000);
  });
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  animateHeroTitle();
  animateSubtitle();
  animateCounters();
  initCardTilt();
  createMatrixRain();
  initMiniBookingForm();
  initBookingForm();

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
