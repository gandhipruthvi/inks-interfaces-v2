import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

function generateWorkHtml() {
  // Collage items (all 28 items scattered at hand-placed positions)
  const collageHtml = projects.map((p, i) => {
    const left = (i * 13) % 85;
    const top = (i * 19) % 70;
    const width = 120 + ((i * 29) % 80);
    const zIndex = 1 + (i % 6);
    return `
      <div class="collage-item" style="left: ${left}%; top: ${top}%; width: ${width}px; z-index: ${zIndex};">
        <img src="${p.cover}" alt="${p.name} showcase" loading="lazy">
      </div>
    `;
  }).join('');

  // Grid view items (asymmetric spans: 7/5, 4/8 alternating)
  const spanPatterns = ['span-7', 'span-5', 'span-4', 'span-8', 'span-5', 'span-7', 'span-8', 'span-4'];
  const gridHtml = projects.map((p, i) => {
    const span = spanPatterns[i % spanPatterns.length];
    const conceptTag = p.isConcept ? `<span class="concept-tag">concept</span>` : '';
    return `
      <article class="work-grid-card ${span}" data-category="${p.category}" data-cursor="view" data-cursor-label="${p.slug}">
        <a href="/work/${p.slug}" class="work-card-thumb" aria-label="${p.name} case study">
          <img src="${p.cover}" alt="${p.alt[p.cover] || p.name}" loading="lazy" width="800" height="500">
        </a>
        <div class="work-card-meta">
          <div>
            <h2 class="work-card-title"><a href="/work/${p.slug}">${p.name}</a>${conceptTag}</h2>
          </div>
          <div class="work-card-sub">${p.category} &middot; ${p.year}</div>
        </div>
      </article>
    `;
  }).join('');

  // List view items (Era list style)
  const listHtml = projects.map((p) => {
    const conceptTag = p.isConcept ? `<span class="concept-tag">concept</span>` : '';
    const servicesStr = p.services.slice(0, 3).join(', ');
    return `
      <div class="work-list-row" data-category="${p.category}" data-cover="${p.cover}">
        <h2 class="work-list-name"><a href="/work/${p.slug}">${p.name}</a>${conceptTag}</h2>
        <span class="work-list-category">${p.category}</span>
        <span class="work-list-services">${servicesStr}</span>
        <span class="work-list-year">${p.year}</span>
      </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>work — inks &amp; interfaces</title>
  <meta name="description" content="All twenty-eight brand identities, rebrands and digital products designed by inks &amp; interfaces." />
  <link rel="canonical" href="https://inksandinterfaces.design/work" />
  <link rel="icon" href="/brand/secondary-monogram.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/styles/tokens.css">
  <link rel="stylesheet" href="/src/styles/base.css">
  <link rel="stylesheet" href="/src/styles/chrome.css">
  <link rel="stylesheet" href="/src/styles/work.css">
</head>
<body>
  <div class="grain-overlay" aria-hidden="true"></div>
  <a class="skip-link" href="#main-content">skip to main content</a>

  <!-- Header -->
  <header class="site-header">
    <a href="/" class="header-brand" aria-label="inks and interfaces home">
      <img src="/brand/wordmark-white-sm.webp" alt="inks &amp; interfaces" class="header-logo" width="115" height="36">
    </a>
    <nav class="header-nav" aria-label="primary navigation">
      <a href="/work" class="nav-link active">work</a>
      <a href="/services" class="nav-link">services</a>
      <a href="/studio" class="nav-link">studio</a>
      <a href="/contact" class="nav-link">contact</a>
    </nav>
    <div class="header-right">
      <div class="header-time" aria-live="polite">surat 00:00:00 ist</div>
      <a href="/contact" class="coral-pill" data-magnetic>start a project</a>
    </div>
  </header>

  <main id="main-content">
    <header class="work-page-header">
      <p class="mono-label" style="margin-bottom: var(--space-3);" data-reveal="fade">// archive of craft</p>
      <h1 class="work-header-title" data-reveal="lines">
        the work <span class="work-header-count">28</span>
      </h1>
      <p style="color: var(--ash); max-width: 54ch; font-size: var(--text-body-lg); margin-top: var(--space-3);" data-reveal="fade">
        Twenty-eight founders, brand systems, and digital interfaces. Built to earn trust, command premium pricing, and convert.
      </p>

      <!-- Signature Scattered Collage Hero -->
      <div class="collage-hero" aria-hidden="true">
        ${collageHtml}
      </div>
    </header>

    <!-- Sticky Filter & View Controls -->
    <div class="work-controls-bar" role="toolbar" aria-label="Work Controls">
      <div class="work-filter-chips">
        <button class="work-filter-chip active" data-filter="all">all (28)</button>
        <button class="work-filter-chip" data-filter="branding">branding</button>
        <button class="work-filter-chip" data-filter="ui-ux">ui-ux</button>
        <button class="work-filter-chip" data-filter="concept">concept</button>
      </div>

      <div class="work-view-toggle">
        <button class="view-btn active" data-view="grid" aria-label="Grid View">grid</button>
        <button class="view-btn" data-view="list" aria-label="List View">list</button>
      </div>
    </div>

    <!-- Main Content Work Container -->
    <div class="work-container">
      <!-- Grid View (Asymmetric 12-col masonry) -->
      <div class="work-grid" aria-label="Project Grid View">
        ${gridHtml}
      </div>

      <!-- List View (Era List style) -->
      <div class="work-list" style="display: none;" aria-label="Project List View">
        ${listHtml}
      </div>
    </div>

    <!-- Floating Cursor Preview (used in list view) -->
    <div class="services-cursor-preview" aria-hidden="true">
      <img src="${projects[0].cover}" alt="Preview">
    </div>
  </main>

  <!-- Global Footer -->
  <footer class="site-footer">
    <div class="footer-top">
      <div class="mono-label" style="margin-bottom: var(--space-3);">// let's build</div>
      <div class="footer-cta-headline">let's grow yours.</div>
      <div class="footer-cta-action">
        <a href="/contact" class="coral-pill" data-magnetic style="font-size: 18px; padding: 16px 36px;">
          start a project &rarr;
        </a>
      </div>
    </div>

    <div class="footer-middle">
      <div class="footer-col">
        <h5>navigation</h5>
        <a href="/work">work</a>
        <a href="/services">services</a>
        <a href="/studio">studio</a>
        <a href="/contact">contact</a>
      </div>
      <div class="footer-col">
        <h5>social</h5>
        <a href="https://www.instagram.com/inks.and.interfaces" target="_blank" rel="noopener">instagram</a>
        <a href="https://x.com/Inks_Interfaces" target="_blank" rel="noopener">x / twitter</a>
        <a href="https://www.behance.net/shivanirotliwala" target="_blank" rel="noopener">behance</a>
      </div>
      <div class="footer-col">
        <h5>studio</h5>
        <p>surat, gujarat, india</p>
        <p>available globally</p>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; 2026 inks &amp; interfaces &middot; made in surat</span>
      <span>set in space grotesk &middot; with care</span>
    </div>
  </footer>

  <script type="module" src="/src/js/pages/work.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'work.html'), html, 'utf-8');
  console.log('✅ Generated work.html with all 28 projects in Grid and List views');
}

generateWorkHtml();
