import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

// projects.json text was scraped from HTML, so some of it is already entity-encoded.
// Decode first so it isn't escaped twice (that's how "that&#39;s" reached the page).
const decode = (s) => s.replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// label colour for a palette swatch: ink on light swatches, white on dark ones
const isLight = (hex) => {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.6;
};

function escapeHtml(str) {
  if (!str) return '';
  return decode(String(str))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// category and industry are lists (a project can be branding + packaging, f&b + d2c)
const SCOPE_LABEL = { branding: 'branding', 'ui-ux': 'ui/ux', packaging: 'packaging', concept: 'concept' };
const SECTOR_LABEL = { 'f-and-b': 'f&b', d2c: 'd2c', 'tech-saas': 'tech', luxury: 'luxury', 'pet-care': 'pet', wellness: 'wellness', education: 'education' };
const scopes = (p) => p.category.map((c) => SCOPE_LABEL[c] || c).join(' & ');
const sectors = (p, sep = ', ') => p.industry.map((s) => SECTOR_LABEL[s] || s).join(sep);

// Image size (for width/height attrs) and, for logos, which plate keeps them visible:
// a transparent mark drawn in dark ink goes on paper, everything else on black.
async function inspect(url) {
  const file = path.join(ROOT_DIR, 'public', url);
  const { width, height, hasAlpha } = await sharp(file).metadata();
  if (!hasAlpha) return { width, height, plate: 'dark' };
  const { data } = await sharp(file).resize(64, 64, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let lum = 0, weight = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    lum += a * (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    weight += a;
  }
  const transparent = weight < (data.length / 4) * 0.9;
  return { width, height, plate: transparent && lum / weight < 0.45 ? 'light' : 'dark' };
}

// Logo files often sit in a big empty canvas (Zestee: 629x271 of art in 1080x1350), which
// makes them tiny on the plate. Show a copy trimmed to the artwork; originals stay untouched.
// Opaque files (logo already on its own background) are used as-is.
async function displayCopy(slug, url, { width, height, plate }) {
  const file = path.join(ROOT_DIR, 'public', url);
  const { hasAlpha } = await sharp(file).metadata();
  if (!hasAlpha) return { src: url, width, height, plate };
  const outUrl = `/work-media/${slug}/identity/${path.basename(url).replace(/\.[^.]+$/, '')}.webp`;
  const out = path.join(ROOT_DIR, 'public', outUrl);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(file).mtimeMs) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const trimmed = await sharp(file).trim({ threshold: 1 }).toBuffer();
    await sharp(trimmed).resize(1400, 1400, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toFile(out);
  }
  const m = await sharp(out).metadata();
  return { src: outUrl, width: m.width, height: m.height, plate };
}

async function generateCaseStudies() {
  const workDir = path.join(ROOT_DIR, 'work');
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const logoDisplay = {};   // slug -> trimmed primary logo, used by the home page logo strip
  for (const [idx, p] of projects.entries()) {
    const slugDir = path.join(workDir, p.slug);
    if (!fs.existsSync(slugDir)) {
      fs.mkdirSync(slugDir, { recursive: true });
    }

    const nextProject = projects[(idx + 1) % projects.length];

    // 1. Deliverables list
    const deliverablesHtml = p.services
      .map(s => `<span>${escapeHtml(s)}</span>`)
      .join('');

    // 2. Palette swatches (a column beside the primary logo, or a row when there's no logo)
    const paletteHtml = (p.palette || ['#f25b54', '#141414', '#f5f1ec'])
      .map(hex => `
          <div class="cs-swatch" style="background: ${hex}; color: ${isLight(hex) ? '#0B0B0B' : '#FFFFFF'};"><span>${hex}</span></div>`).join('');

    // 3. Brand assets (logos, marks, patterns) live in identity/ folders; they get their
    // own grid here. Everything else is a mockup and goes to the gallery.
    const isAsset = (img) => img.includes('/identity/');
    const assets = [...new Set([p.logo, ...p.gallery.filter(isAsset)].filter(Boolean))];
    const mockups = p.gallery.filter((img) => !isAsset(img));
    const info = Object.fromEntries(await Promise.all([...assets, ...mockups].map(async (img) => [img, await inspect(img)])));
    const label = (img) => escapeHtml(p.alt[img] || `${p.name} logo`);

    // Brand sheet: primary logo large with the palette beside it, every other asset
    // below as equal tiles. One logo or thirteen, the layout keeps the same proportions.
    const shown = await Promise.all(assets.map((img) => displayCopy(p.slug, img, info[img])));
    if (p.logo) logoDisplay[p.slug] = shown[0].src;
    const tile = (img, d, cls = '') => `
        <figure class="cs-asset cs-asset--${d.plate}${cls}">
          <img src="${d.src}" alt="${label(img)}" width="${d.width}" height="${d.height}" loading="lazy">
          <figcaption class="mono-label">${label(img)}</figcaption>
        </figure>`;
    const brandSheetHtml = `
      <div class="cs-brand-sheet${assets.length ? '' : ' cs-brand-sheet--no-logo'}">
        ${assets.length ? tile(assets[0], shown[0], ' cs-asset--primary') : ''}
        <div class="cs-palette" aria-label="Colour palette">${paletteHtml}
        </div>
      </div>
      ${assets.length > 1 ? `<div class="cs-assets" aria-label="Brand assets">${assets.slice(1).map((img, i) => tile(img, shown[i + 1])).join('')}
      </div>` : ''}`;

    // 4. Gallery: masonry at each image's own aspect ratio; click opens the lightbox
    const galleryHtml = mockups.map((img, i) => `
        <button class="cs-gallery-item" type="button" data-index="${i}" aria-label="Enlarge: ${escapeHtml(p.alt[img] || p.name)}">
          <img src="${img}" alt="${escapeHtml(p.alt[img] || p.name)}" width="${info[img].width}" height="${info[img].height}" loading="lazy">
        </button>`).join('');

    // "Title: detail | Title: detail" strings from the old site become a real list
    const points = (txt) => !txt.includes(' | ')
      ? `<p>${escapeHtml(txt)}</p>`
      : `<ul class="cs-points">${txt.split(' | ').map((s) => {
          const i = s.indexOf(': ');
          return i > 0 && i < 80
            ? `<li><strong>${escapeHtml(s.slice(0, i))}</strong><span>${escapeHtml(s.slice(i + 2))}</span></li>`
            : `<li><span>${escapeHtml(s)}</span></li>`;
        }).join('')}</ul>`;

    // 5. Impact / Results (Strictly omit if empty, no placeholders)
    let impactHtml = '';
    if (p.results && p.results.length > 0) {
      const cardsHtml = p.results.map(r => `
        <div class="cs-impact-card">
          <div class="cs-impact-val">${escapeHtml(r.value || r.after || '')}</div>
          <div class="cs-impact-label">${escapeHtml(r.label || '')}</div>
        </div>
      `).join('');
      impactHtml = `
        <section class="cs-impact-section" aria-label="Business Results">
          <p class="mono-label">// business outcome</p>
          <h3 style="font-size: var(--text-h2); font-weight: 300; margin-top: var(--space-2);">measured founder impact.</h3>
          <div class="cs-impact-grid">
            ${cardsHtml}
          </div>
        </section>
      `;
    }

    // 6. Founder Quote (Strictly omit if null)
    let quoteHtml = '';
    if (p.quote && p.quote.text) {
      const quoteImg = mockups[1] || p.cover;
      quoteHtml = `
        <section class="cs-quote-section" aria-label="Founder Perspective">
          <div class="cs-quote-split">
            <div class="cs-quote-img">
              <img src="${quoteImg}" alt="${escapeHtml(p.name)} detail" loading="lazy">
            </div>
            <div class="cs-quote-card">
              <p class="mono-label" style="color: var(--coral); margin-bottom: var(--space-3);">// founder voice</p>
              <blockquote>&ldquo;${escapeHtml(p.quote.text)}&rdquo;</blockquote>
              <div class="mono-label" style="color: var(--ash-dark);">${escapeHtml(p.quote.author || p.founder?.name || p.name)}</div>
            </div>
          </div>
        </section>
      `;
    }

    // 7. Concept notice
    const conceptBanner = p.isConcept ? `
      <div style="background: rgba(242,91,84,0.12); border-left: 3px solid var(--coral); padding: var(--space-4) var(--gutter); margin-bottom: var(--space-4);">
        <p class="mono-label" style="color: var(--coral);">// concept project &middot; exploratory brand exercise, not an official client commission</p>
      </div>
    ` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(p.name)} — Inks &amp; Interfaces</title>
  <meta name="description" content="${escapeHtml(p.solution || p.headline || p.name + ' case study by Inks & Interfaces.')}" />
  <link rel="canonical" href="https://inksandinterfaces.design/work/${p.slug}" />
  <link rel="icon" href="/brand/secondary-monogram.png" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Inks &amp; Interfaces" />
  <meta property="og:title" content="${escapeHtml(p.name)} — Inks &amp; Interfaces" />
  <meta property="og:description" content="${escapeHtml(p.solution || p.name + ' case study')}" />
  <meta property="og:image" content="https://inksandinterfaces.design${p.cover}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="/src/styles/tokens.css">
  <link rel="stylesheet" href="/src/styles/base.css">
  <link rel="stylesheet" href="/src/styles/chrome.css">
  <link rel="stylesheet" href="/src/styles/case-study.css">

  <!-- JSON-LD CreativeWork -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "${escapeHtml(p.name)}",
    "headline": "${escapeHtml(p.headline || p.name)}",
    "creator": {
      "@type": "Organization",
      "name": "Inks & Interfaces",
      "url": "https://inksandinterfaces.design"
    },
    "image": "https://inksandinterfaces.design${p.cover}",
    "dateCreated": "${p.year}",
    "genre": "${escapeHtml(scopes(p))}"
  }
  </script>
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
      <a href="/work" class="nav-link">&larr; all work</a>
      <a href="/contact" class="coral-pill" data-magnetic>start a project</a>
    </div>
  </header>

  <main id="main-content">
    ${conceptBanner}

    <!-- BEAT 1: HERO & SPOTLIGHT REVEAL -->
    <section class="cs-hero" aria-label="Project Title and Overview">
      <div class="cs-hero-backdrop">
        <img src="${p.cover}" alt="${escapeHtml(p.name)} hero" class="cs-cover-base" style="view-transition-name: cover-${p.slug};">
      </div>

      <!-- Cursor Spotlight Mask (§8.1 / Video 3) -->
      <div class="cs-spotlight-overlay" aria-hidden="true">
        <img src="${p.logo || p.cover}" alt="">
      </div>

      <div class="cs-hero-content">
        <p class="mono-label" style="color: var(--coral); margin-bottom: var(--space-2);">// ${escapeHtml(scopes(p))} &middot; ${p.year}</p>
        <h1 class="cs-hero-name${p.name.length > 14 ? ' cs-hero-name--long' : ''}">${escapeHtml(p.name)}</h1>

        <div class="cs-hero-meta-grid">
          <div class="cs-meta-col">
            <span>client</span>
            <strong>${escapeHtml(p.founder?.name ? p.founder.name + ' (' + p.name + ')' : p.name)}</strong>
          </div>
          <div class="cs-meta-col">
            <span>category</span>
            <strong>${escapeHtml(scopes(p))}</strong>
          </div>
          <div class="cs-meta-col">
            <span>sector</span>
            <strong>${escapeHtml(sectors(p))}</strong>
          </div>
          <div class="cs-meta-col">
            <span>year</span>
            <strong>${escapeHtml(p.year)}</strong>
          </div>
          <div class="cs-meta-col">
            <span>deliverables</span>
            <div class="cs-meta-list">${deliverablesHtml}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- BEATS 1–2: FOUNDER + PROBLEM (Paper Background) -->
    <section class="cs-problem-section" aria-label="Founder Problem">
      <div class="cs-problem-grid">
        <div>
          <p class="mono-label" style="color: var(--coral); margin-bottom: var(--space-3);">// the challenge</p>
          <div class="cs-problem-pullquote">
            ${escapeHtml(p.headline || p.name)}
          </div>
        </div>
        <div class="cs-problem-narrative">
          <h4>What needed to change</h4>
          ${points(p.problem || p.solution || 'Building brand authority in a category crowded with superficial commodity offerings.')}
        </div>
      </div>
    </section>

    <!-- BEATS 3–4: MARKET + STRATEGY -->
    <section class="cs-strategy-section" aria-label="Strategic Approach">
      <div class="cs-strategy-grid">
        <div class="cs-strategy-copy">
          <p class="mono-label" style="color: var(--coral); margin-bottom: var(--space-3);">// strategic positioning</p>
          <h3 style="font-size: var(--text-h2); font-weight: 300; line-height: 1.1; letter-spacing: -0.03em;">
            Designing for the human decision maker, not an algorithm.
          </h3>
          ${points(p.strategy || 'Aligning tangible physical craft with rapid digital product responsiveness.')}
        </div>

        <div class="cs-strategy-plate">
          <h4>// strategic thesis</h4>
          <div class="cs-strategy-statement">
            ${escapeHtml(p.solution || p.headline || 'Craft that converts lookers into loyal advocates.')}
          </div>
        </div>
      </div>
    </section>

    <!-- BEAT 5: SOLUTION (Palette Chips & Logo Showcase) -->
    <section class="cs-solution-section" aria-label="Visual Identity System">
      <p class="mono-label">// color &amp; mark</p>
      <h3 style="font-size: var(--text-h2); font-weight: 300; margin-top: var(--space-2);">the visual signature.</h3>

      <!-- Brand sheet: primary logo + palette, then the other assets -->
      ${brandSheetHtml}
    </section>

    <!-- BEAT 6: DESIGN EXECUTION (masonry gallery + lightbox) -->
    ${mockups.length ? `<section class="cs-gallery-section" aria-label="Design Showcase">
      <div class="cs-gallery-header">
        <p class="mono-label">// craft &amp; execution</p>
        <h3 style="font-size: var(--text-h2); font-weight: 300; margin-top: var(--space-2);">in the wild.</h3>
      </div>

      <div class="cs-gallery-grid">
        ${galleryHtml}
      </div>

      <dialog class="cs-lightbox" aria-label="${escapeHtml(p.name)} gallery viewer">
        <button class="cs-lb-btn cs-lb-close" type="button" aria-label="Close">&times;</button>
        <button class="cs-lb-btn cs-lb-prev" type="button" aria-label="Previous image">&larr;</button>
        <figure class="cs-lb-figure">
          <img class="cs-lb-img" alt="">
          <figcaption class="mono-label"><span class="cs-lb-count"></span><span class="cs-lb-caption"></span></figcaption>
        </figure>
        <button class="cs-lb-btn cs-lb-next" type="button" aria-label="Next image">&rarr;</button>
      </dialog>
    </section>` : ''}

    <!-- BEAT 7: BUSINESS IMPACT (Conditional) -->
    ${impactHtml}

    <!-- BEAT 8: FOUNDER QUOTE (Conditional) -->
    ${quoteHtml}

    <!-- BEAT 9: KEY LESSONS -->
    <section class="cs-lessons-section" aria-label="Key Lessons">
      <p class="mono-label">// craft principles</p>
      <h3 style="font-size: var(--text-h2); font-weight: 300; margin-top: var(--space-2);">three takeaways from this build.</h3>

      <div class="cs-lessons-list">
        <div class="cs-lesson-item">
          <span class="cs-lesson-num">01</span>
          <div>
            <h4 style="font-size: var(--text-body-lg); font-weight: 500;">Front-of-pack clarity</h4>
            <p style="color: var(--ash); font-size: var(--text-body-sm); margin-top: 4px;">State the honest truth before the branding. Customers buy what they understand.</p>
          </div>
        </div>
        <div class="cs-lesson-item">
          <span class="cs-lesson-num">02</span>
          <div>
            <h4 style="font-size: var(--text-body-lg); font-weight: 500;">Tactile materials build trust</h4>
            <p style="color: var(--ash); font-size: var(--text-body-sm); margin-top: 4px;">Subtle textures, weight, and finishes tell the customer you care about detail everywhere.</p>
          </div>
        </div>
        <div class="cs-lesson-item">
          <span class="cs-lesson-num">03</span>
          <div>
            <h4 style="font-size: var(--text-body-lg); font-weight: 500;">Cohesive omnichannel system</h4>
            <p style="color: var(--ash); font-size: var(--text-body-sm); margin-top: 4px;">From screen taps to shipping box unboxing, the identity remains unmistakably unified.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BEAT 10: CTA + NEXT PROJECT REEL -->
    <section class="cs-next-section" aria-label="Next Case Study">
      <p class="mono-label">// building next?</p>
      <h2 style="font-size: var(--text-h1); font-weight: 300; margin: var(--space-3) 0 var(--space-4);">
        building in ${escapeHtml(sectors(p, ' or '))}? send us your brief.
      </h2>
      <a href="/contact" class="coral-pill" data-magnetic style="font-size: 18px; padding: 14px 32px;">
        start a project &rarr;
      </a>

      <!-- Next project: opens on click only -->
      <a class="cs-next-reel-card" href="/work/${nextProject.slug}" data-cursor="view" data-cursor-label="open">
        <span class="mono-label" style="color: var(--coral);">// up next</span>
        <h3 style="font-size: var(--text-h2); font-weight: 300;">${escapeHtml(nextProject.name)}</h3>
        <div class="cs-next-thumb">
          <img src="${nextProject.cover}" alt="${escapeHtml(nextProject.name)}" loading="lazy">
        </div>
        <span class="hero-work-link">open next case study &rarr;</span>
      </a>
    </section>
  </main>

  <footer class="site-footer"></footer>

  <script type="module" src="/src/js/pages/case-study.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(slugDir, 'index.html'), html, 'utf-8');
  }

  fs.writeFileSync(path.join(ROOT_DIR, 'src/data/logo-display.json'), JSON.stringify(logoDisplay, null, 2));
  console.log(`✅ Generated ${projects.length} case study pages in /work/<slug>/index.html`);
}

generateCaseStudies().catch((e) => { console.error(e); process.exit(1); });
