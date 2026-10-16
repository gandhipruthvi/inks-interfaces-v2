# inks & interfaces v2: Revised Implementation Plan

> **Purpose:** Paste-ready, step-by-step technical implementation plan for Claude / Antigravity to execute the latest revision requests from the Lead Designer and Founding Team.
> **Target Directory:** `D:\Projects\Inks-Interfaces\portfolio-websites\inks-interfaces-v2`
> **Brand Lock:** Ink Black `#0B0B0B`, Paper `#F5F1EC`, Coral `#F25B54`, Space Grotesk primary, JetBrains Mono 11px labels. No teal, no blue, no gradients on coral, no invented metrics.

---

## 1. High-Level Changes Overview

| Area | Current Issue / Request | Solution & Target State |
|---|---|---|
| **Global Header** | Coral CTA turns teal over light sections due to `mix-blend-mode: difference`. | Remove blanket `mix-blend-mode: difference` on `.site-header`. Use targeted blend on text/logo or dynamic `.header-on-light` class to keep button brand coral `#F25B54`. |
| **Global Navigation** | Back to top is only in the footer. | Add a persistent floating "back to top" button (`.back-to-top-btn`) that fades in after 300px scroll with smooth Lenis scroll. |
| **Global Footer** | City says Surat; LinkedIn is missing; dot-matrix canvas doesn't fit brand. | Update to "Based in India"; add LinkedIn; replace dot-matrix with an ink fluid shoreline wave canvas. |
| **Hero Animations** | Services hero quality benchmark loved; other page heroes need to match. | Elevate Home, Studio, Work, and Contact heroes to the same film-grade, fluid, tactile motion benchmark. |
| **Home Hero** | Drop impact spiral is good, but the color spread feels jarring. | Replace the flat expanding color spread with refined ink dissipation and seamless transition into the 3D pattern tiles. |
| **Home Selected Work** | Needs top-notch, flagship project curation. | Update the 8 showcased projects and preview imagery to the studio's highest-tier work. |
| **Work Page** | Header is "the work 28"; needs scope & industry segregation; bento grid refinement. | Headline: "the 28 identities"; add Industry filter chips (F&B, D2C, Tech, Luxury); refine bento grid aspect ratios and spacing. |
| **Services Page** | Service #1 sounds like consulting; needs Brand Naming. | Reframe Brand Strategy into actionable brand architecture & positioning craft; add "Brand Naming & Verbal Identity" as a distinct capability. |
| **Studio Page** | Right hero animation is flat; signature needs removal; transition bug cuts to black. | Re-architect hero with tactile depth; remove signature image; fix transition easing and layering; change founder card location to "India". |
| **Contact Page** | Generic blob needs removal; location is Surat; budget shows ₹ and $ together. | Remove blob; change location to "India"; provide clean single-currency toggle for INR / USD; leave Calendly integration for later. |
| **Project Assets** | Duplicate image references across project galleries. | Deduplicate all gallery arrays in `src/data/projects.json` and delete duplicate disk files. |

---

## 2. Phase 1: Global Fixes & Core Component Updates

### Task 1.1: Fix Header CTA Teal Color Inversion
* **File:** `src/styles/base.css`, `src/js/core/nav.js`
* **Root Cause:** `.site-header` has `mix-blend-mode: difference`. Over white/paper (`#FFFFFF`), Coral (`#F25B54`) inverts to Teal (`#0DA4AB`).
* **Implementation:**
  1. In `src/styles/base.css`, remove `mix-blend-mode: difference;` from `.site-header`.
  2. Set `.site-header` with `color: #FFFFFF;` and a subtle transparent backdrop:
     ```css
     .site-header {
       position: fixed;
       top: 0;
       left: 0;
       width: 100%;
       height: var(--header-height);
       z-index: 1000;
       display: flex;
       align-items: center;
       justify-content: space-between;
       padding: 0 var(--gutter);
       transition: transform 0.4s var(--ease-out), background-color 0.3s ease, color 0.3s ease;
     }
     .site-header.header-on-light {
       color: #0B0B0B;
     }
     .site-header.header-on-light .header-logo {
       filter: invert(1);
     }
     .site-header .coral-pill {
       mix-blend-mode: normal !important;
       isolation: isolate;
     }
     ```
  3. In `src/js/core/nav.js`, observe all `.theme-paper`, `.cs-problem-section`, `.cs-quote-section`, and `.manifesto-section` elements using `IntersectionObserver`. Toggle `.header-on-light` on `.site-header` when any light section intersects the top 80px of the viewport.

### Task 1.2: Add Floating "Back to Top" Button
* **Files:** `src/styles/base.css`, `src/js/core/nav.js`
* **Implementation:**
  1. Inject/render `.back-to-top-btn` in `nav.js`:
     ```html
     <button class="back-to-top-btn" aria-label="Back to top" data-cursor="hover" data-magnetic>
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M12 19V5M5 12l7-7 7 7"/>
       </svg>
       <span>top</span>
     </button>
     ```
  2. Style in `src/styles/base.css`:
     ```css
     .back-to-top-btn {
       position: fixed;
       bottom: 32px;
       right: var(--gutter);
       z-index: 900;
       display: flex;
       align-items: center;
       gap: 6px;
       padding: 10px 18px;
       border-radius: 999px;
       background: var(--ink-2);
       color: var(--paper);
       border: 1px solid var(--line);
       font-family: var(--font-mono);
       font-size: var(--text-mono-label);
       text-transform: uppercase;
       letter-spacing: 0.1em;
       opacity: 0;
       pointer-events: none;
       transform: translateY(16px);
       transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out), border-color 0.2s ease, background 0.2s ease;
     }
     .back-to-top-btn.is-visible {
       opacity: 1;
       pointer-events: auto;
       transform: translateY(0);
     }
     .back-to-top-btn:hover {
       border-color: var(--coral);
       color: var(--coral);
     }
     ```
  3. Wire click handler to Lenis:
     ```js
     btn.addEventListener('click', () => {
       const lenis = getLenis();
       if (lenis) lenis.scrollTo(0, { duration: 1.2 });
       else window.scrollTo({ top: 0, behavior: 'smooth' });
     });
     ```
  4. Toggle `.is-visible` whenever `window.scrollY > 350`.

### Task 1.3: Redesign Footer Animation — Generative Ink Shoreline Wave
* **Files:** `src/styles/base.css`, `src/js/core/footer.js` (new module), all HTML footers
* **Concept:** Replace the dot-matrix effect with a viscous, generative ink shoreline canvas that gently undulates along the footer divider.
* **Canvas Details:**
  - 2D Canvas placed behind the footer top border.
  - Multi-octave sine wave + noise simulation creating an organic, liquid black-and-coral meniscus.
  - Interactive: reacts subtly to cursor X position, creating a slow ink ripple.
* **Content Updates:**
  - Update location text: `"© 2026 inks & interfaces · based in india · operating globally"`.
  - Add LinkedIn link in social columns:
    ```html
    <a href="https://www.linkedin.com/company/inksandinterfaces" target="_blank" rel="noopener">linkedin</a>
    ```
  - Update recent brands list to verified flagship clients.

---

## 3. Phase 2: Project Data Audit & Deduplication

### Task 2.1: Deduplicate Gallery Arrays in `src/data/projects.json`
* **File:** `src/data/projects.json`, `scripts/extract-projects.mjs`
* **Discovered Issue:** `piq`, `ciao`, `misomaki`, and `paperboat` currently contain duplicate entries in their `gallery[]` array.
* **Fix Script (`scripts/dedupe-data.mjs`):**
  ```js
  import fs from 'fs';
  const data = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf-8'));

  data.forEach(p => {
    p.gallery = [...new Set(p.gallery)];
  });

  fs.writeFileSync('src/data/projects.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ Deduplicated gallery arrays in projects.json');
  ```
* **Disk Cleanup:** Delete the redundant `sliver-sphere-tech-matthew-*.webp` duplicate files from `public/assets/projects/silver-sphere-tech/`.

### Task 2.2: Implement Scope and Industry Schema in `projects.json`
* **File:** `src/data/projects.json`
* **Schema Extension:** Every project entry must have:
  ```json
  {
    "slug": "waggle",
    "name": "Waggle",
    "category": "packaging", // "branding" | "ui-ux" | "packaging" | "concept"
    "industry": "pet-care",   // "f-and-b" | "d2c" | "tech-saas" | "luxury" | "pet-care" | "wellness"
    "featured": true,
    ...
  }
  ```
* **Project Categorization & Scope Table:**

| # | Slug | Project Name | Scope Category | Industry Vertical | Featured? |
|---|---|---|---|---|:---:|
| 1 | `waggle` | Waggle | `packaging` | `pet-care` | **Yes** |
| 2 | `zestee` | Zestee | `ui-ux` | `f-and-b` | **Yes** |
| 3 | `satori-bites` | Satori Bites | `packaging` | `f-and-b` | **Yes** |
| 4 | `vanya-luxe` | Vanya Luxe | `ui-ux` | `luxury` | **Yes** |
| 5 | `silver-sphere-tech` | Silver Sphere Tech | `branding` | `tech-saas` | **Yes** |
| 6 | `the-ube-press` | The Ube Press | `branding` | `f-and-b` | **Yes** |
| 7 | `terra-cork` | Terra Cork | `branding` | `d2c` | **Yes** |
| 8 | `globetap` | GlobeTap | `ui-ux` | `tech-saas` | **Yes** |
| 9 | `piq` | PIQ | `packaging` | `d2c` | No |
| 10 | `ciao` | Ciao | `branding` | `f-and-b` | No |
| 11 | `oakmere` | Oakmere | `ui-ux` | `luxury` | No |
| 12 | `matcha-den` | Matcha Den | `branding` | `f-and-b` | No |
| 13 | `the-saucy-heat` | The Saucy Heat | `packaging` | `f-and-b` | No |
| 14 | `lab-coat-media` | Lab Coat Media | `branding` | `tech-saas` | No |
| 15 | `misomaki` | Misomaki | `branding` | `f-and-b` | No |
| 16 | `hardin-jewels` | Hardin Jewels | `branding` | `luxury` | No |
| 17 | `golden-crust` | Golden Crust | `ui-ux` | `f-and-b` | No |
| 18 | `royal-eats` | Royal Eats | `branding` | `f-and-b` | No |
| 19 | `plush-paws` | Plush Paws | `packaging` | `pet-care` | No |
| 20 | `pure-sip` | Pure Sip | `ui-ux` | `d2c` | No |
| 21 | `rich-kanya` | Rich Kanya | `branding` | `wellness` | No |
| 22 | `trivid-yoga` | Trivid Yoga | `branding` | `wellness` | No |
| 23 | `woven-wax` | Woven Wax | `branding` | `d2c` | No |
| 24 | `go-miles` | Go Miles | `branding` | `tech-saas` | No |
| 25 | `evoque` | Evoque | `branding` | `luxury` | No |
| 26 | `mickey-minnie-playschool` | Mickey Minnie Playschool | `branding` | `education` | No |
| 27 | `paperboat` | Paperboat | `concept` | `f-and-b` | No |
| 28 | `kitkat-protein-bar` | Kitkat Protein Bar | `concept` | `f-and-b` | No |

---

## 4. Phase 3: Home Page Revisions

### Task 3.1: Redesign Preloader
* **File:** `src/js/scenes/hero.js`, `src/styles/home.css`
* **Implementation:**
  - Replace the current blocky preloader with a minimalist, high-craft counter.
  - Display a clean 11px JetBrains Mono counter: `000 → 100%` on pure black `#0B0B0B`.
  - Pair with a fine, animated 1px horizontal coral baseline that unclips from center `scaleX(0 → 1)`.
  - Smooth fade out over 0.5s on completion before triggering the ink drop.

### Task 3.2: Hero Ink Drop & Ripple Refinement (Eliminate Harsh Color Spread)
* **File:** `src/js/scenes/hero.js`
* **Changes:**
  - Keep the falling 3D glossy drop with simplex vertex wobble.
  - Keep the squash-and-stretch impact.
  - **Remove:** The full-screen flat color wash in `rippleMat.uniforms.uOpacity` that tinted the whole canvas solid coral.
  - **Replace with:** Delicate, high-contrast concentric ripples (3 thin rings with smoothstep falloff, max opacity 0.5) that dissipate outward as the 3D pattern tiles lift from the surface.
  - Crossfade directly into the embossed matte coral pattern relief with raking directional key lighting.

### Task 3.3: Selected Work Curation & Visuals
* **File:** `index.html`, `src/js/sections/orbit.js`, `src/styles/home.css`
* **Implementation:**
  - Audit the 8 featured projects in the Orbit and Stack sections.
  - Ensure the selected 8 showcase the studio's highest fidelity work:
    1. **Waggle** (Packaging Suite & Mascot)
    2. **Zestee** (Café App & Digital Ordering)
    3. **Satori Bites** (Plant Kitchen Packaging)
    4. **Vanya Luxe** (Fragrance E-Commerce UI/UX)
    5. **Silver Sphere Tech** (3D Hardware Identity)
    6. **The Ube Press** (Artisanal Bakery System)
    7. **Terra Cork** (Sustainable Lifestyle Goods)
    8. **GlobeTap** (eSIM Global Mobile Experience)

### Task 3.4: Capabilities Hover Visuals ("What We Do For Founders")
* **File:** `index.html`, `src/js/sections/services.js`
* **Implementation:**
  - Map each service row to the highest-contrast, hero-level project asset:
    - **01 Brand Strategy:** `/assets/projects/terra-cork/terra-cork-1.webp`
    - **02 Visual Identity:** `/assets/projects/satori-bites/satori-bites-6.webp`
    - **03 Packaging Suites:** `/assets/projects/waggle/waggle-8.webp`
    - **04 Flagship Websites:** `/assets/projects/lab-coat-media/lab-coat-media-1.webp`
    - **05 Product UI/UX:** `/assets/projects/zestee/zestee-9.webp`
    - **06 Launch Content:** `/assets/projects/the-ube-press/the-ube-press-1.webp`

### Task 3.5: Client Logo Plates Optical Balance
* **File:** `src/styles/home.css`, `index.html`
* **Implementation:**
  - Increase padding on `.marquee-logo-plate` to `20px 24px`.
  - Normalize all logos to an optical bounding box of `120px × 56px` with `object-fit: contain`.
  - Ensure all logos use transparent white assets on solid `#000000` backing plates.

---

## 5. Phase 4: Work Page Revisions (`/work`)

### Task 4.1: Header & Sub-Hero Refinement
* **File:** `work.html`, `src/styles/work.css`, `scripts/generate-work-page.mjs`
* **Changes:**
  - Update headline from `the work 28` to:
    ```html
    <h1 class="work-header-title" data-reveal="lines">
      the 28 identities
    </h1>
    ```
  - Subtitle: `"Selected brand strategies, tactile packaging systems, and digital flagships engineered for ambitious founders."`
  - Enhance the transition between the scattered collage and the masonry grid: add smooth depth drift that settles into the grid on scroll with GSAP.

### Task 4.2: Scope & Industry Dual-Filter System
* **File:** `src/styles/work.css`, `src/js/pages/work.js`, `scripts/generate-work-page.mjs`
* **Implementation:**
  - Provide two tiers of filter pills in the sticky toolbar:
    1. **Tier 1 (Scope):** `All (28)` · `Branding` · `UI/UX` · `Packaging` · `Concept`
    2. **Tier 2 (Industry):** `All Sectors` · `F&B` · `D2C` · `Tech/SaaS` · `Luxury` · `Pet Care` · `Wellness`
  - In `src/js/pages/work.js`, filter cards on both attributes:
    ```js
    const matchScope = (currentScope === 'all') || (card.dataset.category === currentScope);
    const matchIndustry = (currentIndustry === 'all') || (card.dataset.industry === currentIndustry);
    card.style.display = (matchScope && matchIndustry) ? 'flex' : 'none';
    ```
  - Sync both to URL params: `?scope=packaging&industry=f-and-b`.

### Task 4.3: Bento Grid Layout Polish
* **File:** `src/styles/work.css`
* **Changes:**
  - Adjust asymmetric 12-column masonry grid:
    - Row pattern: alternating `7 / 5`, `4 / 8`, `6 / 6` column spans.
    - Standardize aspect ratios: large cards at `16/10`, standard cards at `4/3`.
    - Generous spacing: `gap: var(--space-8) var(--space-6);`.
    - High-contrast meta row: project title in Space Grotesk 500, category and year in JetBrains Mono 11px uppercase.

---

## 6. Phase 5: Services Page Revisions (`/services`)

### Task 6.1: Reframe Service #1 ("Brand Strategy")
* **File:** `services.html`
* **Change:**
  - Current copy reads like generic consulting.
  - **New Title:** `brand architecture & positioning`
  - **New Outcome Description:** *"Constructing the commercial foundation that justifies premium pricing and differentiates your product before capital is deployed into marketing."*
  - **Concrete Deliverables:**
    - Category entry strategy & competitive Moat definition
    - Pricing power & positioning framework
    - Customer psychology & purchase barrier teardowns
    - Core brand narrative & messaging hierarchy

### Task 6.2: Add "Brand Naming & Verbal Identity" as Service #2
* **File:** `services.html`, `src/styles/secondary.css`
* **Add Capability Card:**
  - **Title:** `brand naming & verbal identity`
  - **Outcome:** *"Memorable, trademark-ready names and distinct verbal cadences that cut through category noise."*
  - **Deliverables:**
    - Proprietary naming sprints (linguistic & cultural audit)
    - Trademark preliminary screening (USPTO / India IP)
    - Brand tagline & elevator thesis
    - Tone of voice playbook & copywriting rules
  - **Timeline:** 2–3 Weeks

---

## 7. Phase 6: Studio Page Revisions (`/studio`)

### Task 7.1: Redesign Studio Hero Animation (Match Services Level)
* **File:** `src/styles/secondary.css`, `src/js/pages/studio.js`, `studio.html`
* **Problem:** Right side looks like a flat graphic moving with no depth.
* **Redesign:**
  - Implement a **3D tactile letterpress / embossed paper relief** or **fluid ink drop dispersion canvas** that matches the visual depth of the services page.
  - Three.js or layered canvas rendering physical ink soaking into textured paper with subtle lighting that shifts on mousemove.

### Task 7.2: Remove Handwritten Founder Signature
* **File:** `studio.html`
* **Change:** Remove `<img src="/brand/Shivani Signature.png">`. Replace with clean, confident typography:
  ```html
  <div class="founder-signoff">
    <strong>shivani rotliwala</strong>
    <span>founder &middot; design &amp; strategy</span>
  </div>
  ```

### Task 7.3: Fix Pattern Transition "Black Cut" Bug
* **File:** `src/styles/secondary.css`, `src/js/pages/studio.js`
* **Problem:** The section transition animation after the founder's letter cuts abruptly to pure black at the end.
* **Fix:**
  - Replace hard scaling bars with a smooth, continuous wipe using `clip-path: inset(0 0 0 0)` to `clip-path: inset(0 0 100% 0)`.
  - Ensure background color behind the wipe matches the receiving section (`#0B0B0B`) so no intermediate unpainted black flash occurs.

### Task 7.4: Founder Cards Location Update
* **File:** `studio.html`, `index.html`
* **Change:** In the hanging ID cards for Shivani and Sakhi:
  - Change `№ 01 · SURAT, IN` → **`№ 01 · INDIA`**
  - Change `№ 02 · SURAT, IN` → **`№ 02 · INDIA`**

---

## 8. Phase 7: Contact Page Revisions (`/contact`)

### Task 8.1: Remove Hero Blob
* **File:** `contact.html`, `src/styles/secondary.css`
* **Change:** Remove any decorative blob graphic from the hero header. Replace with bold, minimal Space Grotesk headline and clean typographic structure.

### Task 8.2: Studio Location Update
* **File:** `contact.html`
* **Change:** Replace "Surat, Gujarat, India" with **"Based in India · Available Globally"**.

### Task 8.3: Booking Call Link
* **File:** `contact.html`
* **Directive:** As instructed, leave third-party Calendly integration for later. Provide a clean direct email booking CTA:
  ```html
  <a href="mailto:letscreate.inksandinterfaces@gmail.com?subject=Project%20Discovery%20Call" class="coral-pill" data-magnetic style="background: var(--ink); color: #FFFFFF !important;">
    request a 20-min discovery call &nearr;
  </a>
  ```

### Task 8.4: Form Budget Currency Standardization
* **File:** `contact.html`, `src/js/pages/contact.js`
* **Problem:** Form currently mixes ₹ and $ simultaneously in the chips.
* **Fix:** Add a clean currency toggle switch above the budget chips:
  ```html
  <div class="currency-toggle" role="radiogroup" aria-label="Select currency">
    <button type="button" class="curr-btn active" data-currency="INR">INR (₹)</button>
    <button type="button" class="curr-btn" data-currency="USD">USD ($)</button>
  </div>
  <div class="budget-options" data-currency="INR">
    <button type="button" class="budget-chip active" data-val="3L-5L">₹3.5L &ndash; ₹5L</button>
    <button type="button" class="budget-chip" data-val="5L-10L">₹5L &ndash; ₹10L</button>
    <button type="button" class="budget-chip" data-val="10L+">₹10L+</button>
  </div>
  <div class="budget-options" data-currency="USD" style="display: none;">
    <button type="button" class="budget-chip" data-val="5k-8k">$4.5k &ndash; $8k</button>
    <button type="button" class="budget-chip" data-val="8k-15k">$8k &ndash; $15k</button>
    <button type="button" class="budget-chip" data-val="15k+">$15k+</button>
  </div>
  ```

---

## 9. Verification & Quality Checklist

Before completing, run and verify:

- [ ] `node scripts/dedupe-data.mjs` executes and cleans all duplicate image paths.
- [ ] `npm run check-data` passes with 28 unique projects and zero missing images.
- [ ] `npm run build` generates all multi-page entry points without Rollup errors.
- [ ] Check header CTA over white background (`/studio`, `/contact`, case study beats): button remains solid `#F25B54` coral, never turning teal.
- [ ] Floating "Back to Top" button appears smoothly on scroll and returns to top with smooth Lenis lerp.
- [ ] All 28 project case studies build with the 10 beats intact.
- [ ] No banned AI-slop words in any modified copy.
- [ ] Lighthouse a11y score remains ≥ 95 on all routes.
