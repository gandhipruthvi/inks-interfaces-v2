import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateCaseStudies() {
  const workDir = path.join(ROOT_DIR, 'work');
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  projects.forEach((p, idx) => {
    const slugDir = path.join(workDir, p.slug);
    if (!fs.existsSync(slugDir)) {
      fs.mkdirSync(slugDir, { recursive: true });
    }

    const nextProject = projects[(idx + 1) % projects.length];

    // 1. Deliverables list
    const deliverablesHtml = p.services
      .map(s => `<span>${escapeHtml(s)}</span>`)
      .join('');

    // 2. Palette swatches
    const paletteHtml = (p.palette || ['#f25b54', '#141414', '#f5f1ec'])
      .map(hex => `
        <div class="cs-palette-swatch" style="background: ${hex}; color: ${hex === '#f5f1ec' ? '#0B0B0B' : '#FFFFFF'};">
          <span>${hex}</span>
        </div>
      `).join('');

    // 3. Logo showcase (Solid #000 plate)
    const logoHtml = p.logo ? `
      <div class="cs-logo-showcase">
        <img src="${p.logo}" alt="${escapeHtml(p.name)} logo" loading="lazy">
      </div>
    ` : '';

    // 4. Gallery items (Horizontal track)
    const galleryHtml = p.gallery.map((img) => `
      <div class="cs-gallery-item">
        <img src="${img}" alt="${escapeHtml(p.alt[img] || p.name)}" loading="lazy" width="760" height="520">
      </div>
    `).join('');

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
      const quoteImg = p.gallery[1] || p.cover;
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
    "genre": "${p.category}"
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
        <p class="mono-label" style="color: var(--coral); margin-bottom: var(--space-2);">// ${p.category} &middot; ${p.year}</p>
        <h1 class="cs-hero-name">${escapeHtml(p.name)}</h1>

        <div class="cs-hero-meta-grid">
          <div class="cs-meta-col">
            <span>client</span>
            <strong>${escapeHtml(p.founder?.name ? p.founder.name + ' (' + p.name + ')' : p.name)}</strong>
          </div>
          <div class="cs-meta-col">
            <span>category</span>
            <strong>${escapeHtml(p.category)}</strong>
          </div>
          <div class="cs-meta-col">
            <span>year</span>
            <strong>${escapeHtml(p.year)}</strong>
          </div>
          <div class="cs-meta-col">
            <span>deliverables</span>
            <div style="font-size: 13px; color: var(--paper); line-height: 1.4;">${deliverablesHtml}</div>
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
          <p>${escapeHtml(p.problem || p.solution || 'Building brand authority in a category crowded with superficial commodity offerings.')}</p>
        </div>
      </div>
    </section>

    <!-- BEATS 3–4: MARKET + STRATEGY -->
    <section class="cs-strategy-section" aria-label="Strategic Approach">
      <div class="cs-strategy-grid">
        <div>
          <p class="mono-label" style="color: var(--coral); margin-bottom: var(--space-3);">// strategic positioning</p>
          <h3 style="font-size: var(--text-h2); font-weight: 300; line-height: 1.1; letter-spacing: -0.03em;">
            Designing for the human decision maker, not an algorithm.
          </h3>
          <p style="color: var(--ash); font-size: var(--text-body); margin-top: var(--space-4); line-height: 1.6;">
            ${escapeHtml(p.strategy || 'Aligning tangible physical craft with rapid digital product responsiveness.')}
          </p>
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

      <!-- Palette Bands -->
      <div class="cs-palette-row" aria-label="Color Palette">
        ${paletteHtml}
      </div>

      <!-- Logo Showcase on Solid #000 Plate -->
      ${logoHtml}
    </section>

    <!-- BEAT 6: DESIGN EXECUTION (Horizontal Pinned Gallery) -->
    <section class="cs-gallery-section" aria-label="Design Showcase">
      <div class="cs-gallery-header">
        <p class="mono-label">// craft &amp; execution</p>
        <h3 style="font-size: var(--text-h2); font-weight: 300; margin-top: var(--space-2);">in the wild &middot; horizontal gallery</h3>
      </div>

      <div class="cs-horizontal-track">
        ${galleryHtml}
      </div>
    </section>

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
        building in ${escapeHtml(p.category)}? send us your brief.
      </h2>
      <a href="/contact" class="coral-pill" data-magnetic style="font-size: 18px; padding: 14px 32px;">
        start a project &rarr;
      </a>

      <!-- Next Project Auto-Reel Card -->
      <div class="cs-next-reel-card" data-next-url="/work/${nextProject.slug}">
        <span class="mono-label" style="color: var(--coral);">// up next</span>
        <h3 style="font-size: var(--text-h2); font-weight: 300;">${escapeHtml(nextProject.name)}</h3>
        <div class="cs-next-thumb">
          <img src="${nextProject.cover}" alt="${escapeHtml(nextProject.name)}" loading="lazy">
        </div>
        
        <div style="display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-3);">
          <!-- Auto-navigate circular progress ring -->
          <svg width="60" height="60" aria-hidden="true">
            <circle cx="30" cy="30" r="26" stroke="rgba(245,241,236,0.15)" stroke-width="3" fill="none"/>
            <circle class="progress-ring-circle" cx="30" cy="30" r="26" stroke="var(--coral)" stroke-width="3" fill="none"/>
          </svg>
          <a href="/work/${nextProject.slug}" class="hero-work-link">open next case study &rarr;</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Global Footer -->
  <footer class="site-footer">
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

  <script type="module" src="/src/js/pages/case-study.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(slugDir, 'index.html'), html, 'utf-8');
  });

  console.log(`✅ Generated ${projects.length} case study pages in /work/<slug>/index.html`);
}

generateCaseStudies();
