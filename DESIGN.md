# Future Gaming — Design System

> The single source of truth for the Future Gaming visual language.
> **Any new page (incl. the eSport sub-site) must follow this to the tee.**
> Everything below is extracted directly from the live `style.css`, `index.html` and `main.js`.

---

## 1. Brand & Tone

- **Aesthetic:** Dark "phantom / cyber-arena" look — near-black canvas, a single hot signature red, neon glows, glassmorphism, subtle grid/scanline motifs, esports energy.
- **Language:** Danish (`<html lang="da">`). Headlines are short, uppercase, confident ("BOOK DIT NÆSTE EVENT", "The Arsenal", "HQ").
- **Voice:** Direct, energetic, welcoming. Mixes Danish copy with a few English power-words used as section codenames (`// EVENTS`, `The Arsenal`).
- **Locale details:** Phone `+45 52 52 88 87`, email `info@futuregaming.dk`, address `Hvidovrevej 137F, 2650 Hvidovre`.

---

## 2. Design Tokens (CSS Custom Properties)

Defined in `:root` at the top of `style.css`. **Always reference these variables — never hard-code the hex values.**

```css
:root {
  --bg:              #0A0A0A;   /* page background (near-black)        */
  --bg-alt:          #060608;   /* deeper sections                    */
  --surface:         #111111;   /* card / panel base                  */
  --surface-light:   #1A1A1A;   /* raised surface                     */
  --surface-glass:   rgba(17, 17, 17, 0.6); /* glassmorphism fill     */

  --red:             #E31837;   /* PRIMARY brand red — CTAs, accents  */
  --red-dark:        #B01228;   /* gradient / hover depth             */
  --red-glow:        rgba(227, 24, 55, 0.4);  /* shadows/glows        */
  --red-glow-strong: rgba(227, 24, 55, 0.7);  /* hover glows          */

  --blue:            #1A3A5C;   /* rare secondary accent              */
  --blue-light:      #2A5A8C;

  --text:            #FFFFFF;   /* primary text                       */
  --text-dim:        #A0A0A0;   /* secondary / descriptions           */
  --text-muted:      #555555;   /* tertiary / disabled                */

  --nav-h:           72px;      /* fixed nav height (scroll offsets)   */
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);   /* primary ease */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);/* bouncy ease */
}
```

**Tier accent colors** (used in pricing cards, can be reused for esport ranks/tiers):
- Bronze: `rgba(205, 127, 50, …)`
- Silver: silver/white sheen
- Gold: featured / "POPULÆR" highlight
- Platinum: cool white lamp-glow

---

## 3. Typography

Loaded via Google Fonts in `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

| Role | Font | Usage |
|------|------|-------|
| **Display / headings / labels / nav / buttons** | `'Chakra Petch', sans-serif` | All `.section-title`, `.section-tag`, nav links, CTAs, tier badges. Uppercase, wide letter-spacing. |
| **Body / paragraphs / inputs** | `'Space Grotesk', sans-serif` | `body` default, descriptions, form fields. `line-height: 1.6`. |
| **Numbers / techy accents** | `'Orbitron', sans-serif` | Stat counters (`.stat-number`), matrix rain. ⚠️ Orbitron is **referenced but not currently loaded** — it falls back to a generic sans. If you want true Orbitron, add it to the font `<link>`. Keep this consistent across pages (either add it everywhere or rely on the same fallback). |

**Type scale & treatments**
- `.section-title` — `clamp(2rem, 5vw, 3.5rem)`, weight 800, `letter-spacing: 2px`, **UPPERCASE**, with a signature gradient text fill:
  ```css
  background: linear-gradient(135deg, var(--text) 50%, var(--red) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  ```
- `.section-tag` — `0.7rem`, `letter-spacing: 4px`, `color: var(--red)`, UPPERCASE, prefixed with `// ` (e.g. `// EVENTS`).
- `.section-desc` — `1.05rem`, `color: var(--text-dim)`, `max-width: 600px`, centered.
- Nav links — `0.75rem`, weight 600, `letter-spacing: 2px`, UPPERCASE.

---

## 4. Layout & Spacing

- **Max content width:** `1420px` (nav + inner containers), centered with `margin: 0 auto`.
- **Horizontal page padding:** `20px` (sometimes `30px` in the nav inner).
- **Section vertical rhythm** (`padding`):
  - Large sections: `120px 20px` (pricing, booking, contact, games).
  - Medium: `80px 20px` (instructor, events).
  - Compact: `72px 20px` (reviews, sandwich).
- **Section header** (`.section-header`): centered, `margin-bottom: 60px`. Pattern is always:
  ```html
  <div class="section-header">
    <span class="section-tag">// CODENAME</span>
    <h2 class="section-title reveal">Title</h2>
    <p class="section-desc reveal">One-line supporting sentence.</p>
  </div>
  ```
- **Grids:** card grids use CSS grid, auto-fit/repeat, collapsing to 1 column at the breakpoints below. Card radius typically `16px`.
- **Border radius:** nav `16px`, glass badges `16px`, buttons/CTAs `50px` (pill), call-CTA `999px` (pill).

**Responsive breakpoints** (mobile-first overrides via `@media (max-width: …)`):
| Breakpoint | Purpose |
|------------|---------|
| `900px` | tablet — grids collapse to 1–2 cols, hero stacks |
| `768px` | mobile nav appears (hamburger), desktop nav hides |
| `640px / 560px` | small phones — tighter padding, font tweaks |
| `480px` | very small phones |
| `(hover: none) and (pointer: coarse)` | disable 3D tilt / hover transforms on touch |

---

## 5. Core Components

### 5.1 Header — "Phantom Nav" (`.phantom-nav`)
- Fixed, floating pill: `top: 12px`, centered, `width: calc(100% - 40px)`, `max-width: 1420px`, `border-radius: 16px`, transparent at rest.
- **On scroll** (`.scrolled`, toggled in JS at `scrollY > 50`): snaps to full-width, `border-radius: 0`, gains `background: rgba(10,10,10,0.85)` + `backdrop-filter: blur(20px) saturate(1.8)` + red-tinted border + glow shadow.
- **Structure:** logo (left, 52px, `glowPulse` animation) · nav links (center/right, each with a `.nav-dot` + animated underline) · actions (`Ring Nu` call-CTA + hamburger).
- **Active link:** JS scroll-spy adds `.active` → shows red dot + white text. Underline grows from center on hover (`::after`, red with glow).
- **Call CTA** (`.nav-call-cta`): red-tinted pill, label "RING NU" + number, hover lifts.
- **Mobile** (`≤768px`): links hide, hamburger shows, opens full-screen `.mobile-overlay` with `.mobile-nav` links; body scroll locks.

### 5.2 Buttons / CTAs
- **Primary CTA** (`.hero-cta`, `.hero-cta-primary`): solid `var(--red)` pill, `padding: 16px 48px`, Chakra Petch, weight 700, `letter-spacing: 3px`, UPPERCASE, `border-radius: 50px`, layered red glow shadow. Hover: `scale(1.05)` + stronger glow. Optional animated `.cta-ring` pulse outline.
- **Secondary CTA** (`.hero-cta-secondary`): outlined/ghost variant.
- **Call CTA** (`.hero-cta-call`): used for phone links.
- **Form submit** (`.form-submit`): full-width red pill with `.submit-text` + `.submit-icon` (→). Has `.success` state ("Sendt!") and a `shake` animation on validation error.
- **Inline link CTA** (`.event-card-cta`, `.instructor-cta`): text + `.cta-arrow` (→) that slides on hover.
- Convention: CTAs end with a directional glyph — `→` for forward actions, `↓` for scroll-down.

### 5.3 Cards
- **Event card** (`.event-card`): image with gradient overlay + zoom-on-hover, title, desc, tag chips (`.event-tag`), inline CTA. Animated border/glow on hover. This is the canonical "offering" card — reuse it for eSport services.
- **Price/tier card** (`.price-card.tier-*`): glass card, animated border (`.card-border-anim`), `.tier-badge`, `.price-time`, feature `<ul>`, button. Featured card (`.featured`) gets a "POPULÆR" tag, lift, and stronger glow. 3D mouse-tilt via JS (`initCardTilt`).
- **Review card** (`.review-card`): stars (`★★★★★`), blockquote, author name + role.
- **Sidebar card** (`.sidebar-card`): icon + heading + contact links; used beside forms.
- All cards: glass/surface fill, `1px` faint white border (`rgba(255,255,255,0.05–0.06)`), `16px` radius, lift + red glow on hover.

### 5.4 Forms
- Wrapper `.booking-form`, rows `.form-row` (2-up, collapses to 1 on mobile), `.form-group` / `.form-group-full`.
- `.form-label` (small, uppercase-ish) + `.form-input` (dark surface, faint border, red focus). Selects wrapped in `.select-wrap` with custom `.select-arrow` (▾). Textareas `.form-textarea`.
- Backend: **Web3Forms** (`https://api.web3forms.com/submit`) via a hidden `access_key`, `subject`, `from_name`. JS validates name/email/type, then async-submits and shows success/error in the button.

### 5.5 Footer (`.site-footer`)
- Animated **matrix rain** background (`#footer-matrix`, generated in JS), logo, copyright line.
- Current copy: `© 2026 Future Gaming — Gaming Events, Sandwich Bar & eSport Center. Alle rettigheder forbeholdes.`

---

## 6. Motion & Interaction

Defined as keyframes in `style.css`, orchestrated in `main.js`.

| Effect | Mechanism |
|--------|-----------|
| **Scroll reveal** | Add class `reveal` / `reveal-left` / `reveal-right` / `reveal-diagonal-*` / `reveal-badge`; an `IntersectionObserver` adds `.visible` to trigger `fadeInUp/Left/Right`. Stagger with inline `style="--delay: 0.2s"`. |
| **Hero title** | Letter-by-letter reveal (`letterReveal`), each `.letter` delayed `index * 0.05 + 0.3s`. |
| **Hero subtitle** | Typewriter effect with blinking `.cursor`. |
| **Stat counters** | `data-target="200"` counts up (ease-out cubic) when scrolled into view. |
| **Logo glow** | `glowPulse` infinite drop-shadow pulse. |
| **Card 3D tilt** | Mouse-move `perspective` rotate on `.price-card` (desktop/hover only). |
| **Loading bar** | `.loading-bar` fills when in view (used in Games header). |
| **Matrix rain** | Footer canvas of falling katakana/0-1 chars in red. |
| **Scanline / grid pulse / float / electric arc** | Ambient background motifs (`scanline`, `gridPulse`, `float`, `electricArc`). |
| **Smooth scroll** | All `a[href^="#"]` scroll to the section header with nav-height offset. |

**Accessibility/perf conventions:** `loading="lazy"` + `decoding="async"` on non-hero images; `aria-label`/`aria-pressed`/`aria-expanded`/`inert` on interactive widgets (audio toggle, catering dropdown, lightbox); touch devices skip hover/tilt transforms.

---

## 7. Iconography & Media

- **Social icons:** inline SVG inside `.social-hex` (hexagon) buttons.
- **Glyphs:** `→ ↓ ✓ ▾ ★ ×` used as lightweight icons (no icon font).
- **Images:** modern formats — `.avif`, `.webp` preferred; `.png/.jpeg` for photos. Transparent PNGs for the instructor cut-out.
- **Video:** muted autoplay loop heroes (`.mp4` + `.mov` fallback), `playsinline`; an opt-in audio toggle pattern exists for the sandwich video.

---

## 8. Build & Deployment

- **Tooling:** Vite (`npm run dev` / `build` / `preview`). `base: './'` for relative asset paths (Vercel + GitHub Pages friendly).
- **Hosting:** Vercel (project `future-gaming`, see `.vercel/project.json`).
- **Multi-page:** additional pages (e.g. the eSport sub-site) are added as extra HTML entry points in `vite.config.js` → `build.rollupOptions.input`. See `esport/index.html`.
- **SEO baseline per page:** `<title>`, `meta description`, `meta keywords`, Open Graph tags, and JSON-LD `LocalBusiness` structured data — mirror this block on every page.

---

## 9. Checklist for a New Page (keep it "to the tee")

1. Import the **same `style.css`** (shared tokens + components). Add only page-specific CSS in a sibling file.
2. Reuse the **Phantom Nav** + **Footer** markup verbatim (swap link targets/labels).
3. Use the **section-header pattern** (`// TAG` + gradient title + dim desc) for every section.
4. Build offerings with **event-card / price-card** patterns; CTAs use `.hero-cta` / `.form-submit`.
5. Keep copy **Danish, short, uppercase headlines**, directional-glyph CTAs.
6. Wire **scroll-reveal** (`reveal*` classes + `--delay`) and shared nav JS (scroll-spy, hamburger, smooth scroll).
7. Keep the dark canvas, single red accent, glass surfaces, neon glows — **no new accent colors** without reason.
8. Add the page as a Vite input + matching SEO/OG/JSON-LD head block.
</invoke>
