import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

const SCOPES = { branding: 'branding', 'ui-ux': 'ui/ux', packaging: 'packaging', concept: 'concept' };
const INDUSTRIES = { 'f-and-b': 'f&amp;b', d2c: 'd2c', 'tech-saas': 'tech/saas', luxury: 'luxury', 'pet-care': 'pet care', wellness: 'wellness' };
const chips = (tier, map, allLabel) =>
  `<button class="work-filter-chip active" data-${tier}="all" aria-pressed="true">${allLabel}</button>` +
  Object.entries(map).map(([k, label]) => `<button class="work-filter-chip" data-${tier}="${k}" aria-pressed="false">${label}</button>`).join('');

function generateWorkHtml() {
  // Orbit gallery covers: every project, placed on a sphere by work.js.
  // aria-hidden + tabindex -1: the grid/list below is the accessible index.
  const orbitHtml = projects.map((p, i) => `
          <a class="wo-card" href="/work/${p.slug}" tabindex="-1" data-name="${p.name}" style="--tilt: ${((i * 37) % 36) - 18}deg">
            <img src="/work-media/${p.slug}/thumb-360.webp" alt="" width="360" height="450" loading="${i < 12 ? 'eager' : 'lazy'}" draggable="false">
          </a>`).join('');

  // Grid view items (row pairs: 7/5, 4/8, 6/6)
  const spanPatterns = ['span-7', 'span-5', 'span-4', 'span-8', 'span-6', 'span-6'];
  const gridHtml = projects.map((p, i) => {
    const span = spanPatterns[i % spanPatterns.length];
    const conceptTag = p.isConcept ? `<span class="concept-tag">concept</span>` : '';
    return `
      <article class="work-grid-card ${span}" data-category="${p.category}" data-industry="${p.industry}" data-cursor="view" data-cursor-label="${p.slug}">
        <a href="/work/${p.slug}" class="work-card-thumb" aria-label="${p.name} case study">
          <img src="${p.cover}" alt="${p.alt[p.cover] || p.name}" loading="lazy" width="800" height="500">
        </a>
        <div class="work-card-meta">
          <div>
            <h2 class="work-card-title"><a href="/work/${p.slug}">${p.name}</a>${conceptTag}</h2>
          </div>
          <div class="work-card-sub">${SCOPES[p.category]} &middot; ${p.year}</div>
        </div>
      </article>
    `;
  }).join('');

  // List view items (Era list style)
  const listHtml = projects.map((p) => {
    const conceptTag = p.isConcept ? `<span class="concept-tag">concept</span>` : '';
    const servicesStr = p.services.slice(0, 3).join(', ');
    return `
      <div class="work-list-row" data-category="${p.category}" data-industry="${p.industry}" data-cover="${p.cover}">
        <h2 class="work-list-name"><a href="/work/${p.slug}">${p.name}</a>${conceptTag}</h2>
        <span class="work-list-category">${SCOPES[p.category]}</span>
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
      <div class="header-time" aria-live="polite">india 00:00:00 ist</div>
      <a href="/contact" class="coral-pill" data-magnetic>start a project</a>
    </div>
  </header>

  <main id="main-content">
    <!-- Filter & view controls: top of the page, sticky under the header -->
    <div class="work-controls-bar" role="toolbar" aria-label="Work Controls">
      <div class="work-filter-tiers">
        <div class="work-filter-chips" role="group" aria-label="Filter by scope">
          ${chips('scope', SCOPES, `all (${projects.length})`)}
        </div>
        <div class="work-filter-chips work-filter-chips--industry" role="group" aria-label="Filter by industry">
          ${chips('industry', INDUSTRIES, 'all sectors')}
        </div>
      </div>

      <div class="work-view-toggle">
        <button class="view-btn active" data-view="grid" aria-label="Grid View">grid</button>
        <button class="view-btn" data-view="list" aria-label="List View">list</button>
      </div>
    </div>

    <!-- Orbit gallery: the covers circle the headline in 3D; drag to spin, click to open -->
    <header class="work-page-header work-orbit">
      <div class="wo-stage" aria-hidden="true">${orbitHtml}
      </div>
      <div class="wo-copy">
        <p class="mono-label" data-reveal="fade">// archive of craft</p>
        <h1 class="work-header-title" data-reveal="lines">the ${projects.length} identities</h1>
        <p class="wo-sub" data-reveal="fade">Selected brand strategies, tactile packaging systems, and digital flagships engineered for ambitious founders.</p>
        <p class="wo-hint mono-label" aria-hidden="true">drag to spin &middot; click a cover to open it</p>
      </div>
      <p class="wo-label mono-label" aria-hidden="true"></p>
    </header>

    <!-- Main Content Work Container -->
    <div class="work-container">
      <p class="work-empty mono-label" hidden>nothing in this combination yet. try another sector.</p>
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

  <footer class="site-footer"></footer>

  <script type="module" src="/src/js/pages/work.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'work.html'), html, 'utf-8');
  console.log('✅ Generated work.html with all 28 projects in Grid and List views');
}

generateWorkHtml();
