import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OLD_SITE_DIR = path.resolve(ROOT_DIR, '../inks-interfaces-website');
const V2_DIR = ROOT_DIR;

const FEATURED_SLUGS = [
  'waggle',
  'zestee',
  'satori-bites',
  'vanya-luxe',
  'silver-sphere-tech',
  'the-ube-press',
  'terra-cork',
  'globetap'
];

const CONCEPT_SLUGS = [
  'paperboat',
  'kitkat-protein-bar'
];

const LOGO_MAP = {
  'mickey-minnie-playschool': 'identity/primary-logo-transparent-background-0.webp',
  'zestee': 'identity/primary-logo-transparent-background-0.png',
  'vanya-luxe': 'identity/primary-logo-1.png',
  'piq': 'identity/primary-logo-transparent-background-0.png',
  'the-ube-press': 'identity/primary-logo-transparent-background-0.png',
  'globetap': null,
  'terra-cork': 'identity/primary-logo-earthy-6.webp',
  'ciao': null,
  'go-miles': 'identity/primary logo.png',
  'oakmere': 'identity/oakmere-logo-transparent-1.webp',
  'matcha-den': 'identity/primary-logo-transparent-background-0.png',
  'the-saucy-heat': 'identity/primary logo.png',
  'lab-coat-media': 'identity/primary logo transparent.png',
  'waggle': 'identity/Waggle logo transparent.png',
  'misomaki': 'identity/primary-logo-transparent-background-0.webp',
  'hardin-jewels': 'identity/primary-logo-with-transparent-background-1.png',
  'evoque': null,
  'trivid-yoga': 'identity/primary-logo-transparent-background-0.webp',
  'paperboat': null,
  'woven-wax': null,
  'golden-crust': 'identity/primary logo transparent background.webp',
  'royal-eats': 'identity/primary logo transparent.png',
  'plush-paws': null,
  'pure-sip': 'identity/primary-logo-3.png',
  'rich-kanya': 'identity/primary-logo-transparent-background-1.webp',
  'kitkat-protein-bar': null,
  'satori-bites': 'identity/primary-logo-transparent-background-2.png',
  'silver-sphere-tech': 'identity/logomark-4.webp'
};

async function samplePaletteFromImage(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const { data } = await sharp(filePath)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Sample a few distinct colors
    const colors = [];
    for (let i = 0; i < data.length; i += 400) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      if (!colors.includes(hex)) colors.push(hex);
      if (colors.length >= 4) break;
    }
    return colors;
  } catch (err) {
    return null;
  }
}

async function extract() {
  const indexPath = path.join(OLD_SITE_DIR, 'js', 'project-index.js');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Extract window.INKS_PROJECTS items
  const match = indexContent.match(/window\.INKS_PROJECTS\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not find window.INKS_PROJECTS in project-index.js');

  const baseProjects = eval(match[1]);
  console.log(`Found ${baseProjects.length} projects in project-index.js`);

  const projects = [];
  const contentGaps = [];

  for (const base of baseProjects) {
    const slug = base.id;
    const htmlFile = path.join(OLD_SITE_DIR, 'projects', `${slug}.html`);
    let html = '';
    if (fs.existsSync(htmlFile)) {
      html = fs.readFileSync(htmlFile, 'utf-8');
    } else {
      console.warn(`Missing html file for slug: ${slug}`);
    }

    // 1. Meta / Hero
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/);
    const heroTitleMatch = html.match(/<h1[^>]*class=["'][^"']*cs-hero-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/);
    const heroIntroMatch = html.match(/<p[^>]*class=["'][^"']*cs-hero-intro[^"']*["'][^>]*>([\s\S]*?)<\/p>/);

    // 2. Deliverables / Services
    const deliverables = [];
    const delivMatch = html.match(/<div class=["']cs-meta-list["']>([\s\S]*?)<\/div>/);
    if (delivMatch) {
      const spans = delivMatch[1].matchAll(/<span>(.*?)<\/span>/g);
      for (const s of spans) {
        deliverables.push(s[1].trim());
      }
    }

    // 3. Year & Location
    const yearMatch = html.match(/<span>Year<\/span><strong>(.*?)<\/strong>/);
    const locMatch = html.match(/<span>Location<\/span><strong>(.*?)<\/strong>/);
    const roleMatch = html.match(/<span>Role<\/span><strong>(.*?)<\/strong>/);

    // 4. Founder / Team
    let founder = null;
    const founderTeamMatch = html.match(/<li>Founder:\s*(.*?)<\/li>/i);
    const originCaptionMatch = html.match(/Founder\s+([A-Z][a-zA-Z\s]+?)\s+(?:adopted|started|founded|created)/);
    if (founderTeamMatch) {
      founder = { name: founderTeamMatch[1].trim(), role: 'Founder' };
    } else if (originCaptionMatch) {
      founder = { name: originCaptionMatch[1].trim(), role: 'Founder' };
    }

    // 5. Problem
    let problem = null;
    const problemMatch = html.match(/<section[^>]*class=["'][^"']*cs-problems-section[^"']*["']>([\s\S]*?)<\/section>/);
    if (problemMatch) {
      const problemDescs = [...problemMatch[1].matchAll(/<div class=["']cs-problem-desc["']>([\s\S]*?)<\/div>/g)].map(m => m[1].trim());
      const problemTitles = [...problemMatch[1].matchAll(/<div class=["']cs-problem-title["']>([\s\S]*?)<\/div>/g)].map(m => m[1].trim());
      if (problemTitles.length > 0) {
        problem = problemTitles.map((t, i) => `${t}: ${problemDescs[i] || ''}`).join(' | ');
      }
    }

    // 6. Strategy & Principles
    let strategy = null;
    const principlesMatch = html.match(/<section[^>]*class=["'][^"']*cs-principles-section[^"']*["']>([\s\S]*?)<\/section>/);
    if (principlesMatch) {
      const pTitles = [...principlesMatch[1].matchAll(/<div class=["']cs-principle-title["']>([\s\S]*?)<\/div>/g)].map(m => m[1].trim());
      const pDescs = [...principlesMatch[1].matchAll(/<div class=["']cs-principle-desc["']>([\s\S]*?)<\/div>/g)].map(m => m[1].trim());
      if (pTitles.length > 0) {
        strategy = pTitles.map((t, i) => `${t}: ${pDescs[i] || ''}`).join(' | ');
      }
    }

    // 7. Solution / Statement
    let solution = null;
    const statementMatch = html.match(/<div class=["']cs-statement-overlay["']>\s*<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (statementMatch) {
      solution = statementMatch[1].replace(/<[^>]*>/g, '').trim();
    } else if (heroIntroMatch) {
      solution = heroIntroMatch[1].replace(/<[^>]*>/g, '').trim();
    }

    // 8. Quotes
    let quote = null;
    const pullquoteMatch = html.match(/<blockquote[^>]*class=["'][^"']*cs-origin-pullquote[^"']*["'][^>]*>([\s\S]*?)<\/blockquote>/);
    if (pullquoteMatch) {
      quote = {
        text: pullquoteMatch[1].replace(/<[^>]*>/g, '').trim(),
        author: founder ? founder.name : base.name
      };
    }

    // 9. Results
    const results = [];
    const statsMatch = html.match(/<div class=["']cs-stat-big["']>([\s\S]*?)<\/div>\s*<div class=["']cs-stat-big-label["']>([\s\S]*?)<\/div>/);
    if (statsMatch) {
      const val = statsMatch[1].trim();
      const label = statsMatch[2].replace(/<[^>]*>/g, '').trim();
      results.push({ label, value: val });
    }
    const suppStats = [...html.matchAll(/<div class=["']cs-supporting-stat-value["']>([\s\S]*?)<\/div>\s*<div class=["']cs-supporting-stat-label["']>([\s\S]*?)<\/div>/g)];
    for (const s of suppStats) {
      results.push({ label: s[2].replace(/<[^>]*>/g, '').trim(), value: s[1].trim() });
    }

    // 10. Palette from HTML
    const palette = [];
    const paletteHexMatches = [...html.matchAll(/<div class=["']cs-color-hex["']>([\s\S]*?)<\/div>/g)];
    for (const ph of paletteHexMatches) {
      const hex = ph[1].trim().toLowerCase();
      if (!palette.includes(hex)) palette.push(hex);
    }

    // 11. Gallery images
    const gallery = [];
    const altMap = {};
    const imgMatches = [...html.matchAll(/<img[^>]+src=["'](?:\.\.\/)?(assets\/projects\/[^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/g)];
    for (const im of imgMatches) {
      let imgPath = '/' + im[1].replace(/^\.\.\//, '');
      // fix sliver typo
      imgPath = imgPath.replace('sliver-sphere', 'silver-sphere');
      if (!gallery.includes(imgPath) && !imgPath.includes('Frame_16') && !imgPath.includes('Frame_17')) {
        gallery.push(imgPath);
        altMap[imgPath] = im[2].trim() || `${base.name} design asset`;
      }
    }

    // Also check files on disk in public/assets/projects/<slug>
    const projectDir = path.join(V2_DIR, 'public', 'assets', 'projects', slug === 'silver-sphere-tech' ? 'silver-sphere-tech' : slug);
    if (fs.existsSync(projectDir)) {
      const diskFiles = fs.readdirSync(projectDir);
      for (const f of diskFiles) {
        if (f.match(/\.(webp|png|jpg|jpeg)$/i) && !f.includes('Frame_16') && !f.includes('Frame_17')) {
          const imgPath = `/assets/projects/${slug}/${f}`.replace('sliver-sphere', 'silver-sphere');
          if (!gallery.includes(imgPath)) {
            gallery.push(imgPath);
            altMap[imgPath] = `${base.name} showcase asset`;
          }
        }
      }
    }

    // Fallback palette sampling from cover if empty
    let coverPath = '/' + base.cover.replace('sliver-sphere', 'silver-sphere');
    if (palette.length === 0) {
      const diskCover = path.join(V2_DIR, 'public', coverPath.replace(/^\//, ''));
      const sampled = await samplePaletteFromImage(diskCover);
      if (sampled && sampled.length > 0) {
        palette.push(...sampled);
      } else {
        palette.push('#F25B54', '#141414', '#F5F1EC');
      }
    }

    // Logo
    let logoPath = null;
    if (LOGO_MAP[slug]) {
      logoPath = `/assets/projects/${slug}/${LOGO_MAP[slug]}`;
    }

    const isConcept = CONCEPT_SLUGS.includes(slug);
    const featured = FEATURED_SLUGS.includes(slug);

    const projectData = {
      slug,
      name: base.name,
      subtitle: base.subtitle || `${base.category} case study`,
      category: isConcept ? 'concept' : base.category,
      tags: base.tags || [],
      year: yearMatch ? yearMatch[1].trim() : '2025',
      role: roleMatch ? roleMatch[1].trim() : (base.category === 'ui-ux' ? 'Product Design & UI/UX' : 'Brand Identity & Strategy'),
      services: deliverables.length > 0 ? deliverables : ['Brand Strategy', 'Visual Identity', 'Digital System'],
      location: locMatch ? locMatch[1].trim() : 'India',
      cover: coverPath,
      gallery,
      alt: altMap,
      logo: logoPath,
      founder,
      problem,
      strategy,
      solution,
      results: results.length > 0 ? results : [],
      quote,
      palette,
      isConcept,
      featured,
      headline: heroTitleMatch ? heroTitleMatch[1].replace(/<[^>]*>/g, '').trim() : `${base.name} — ${base.category}`
    };

    projects.push(projectData);

    // Track gaps
    const missing = [];
    if (!founder) missing.push('founder');
    if (results.length === 0) missing.push('results');
    if (!quote) missing.push('quote');
    if (!problem) missing.push('problem');
    if (!strategy) missing.push('strategy');
    if (missing.length > 0) {
      contentGaps.push({ slug, name: base.name, missing });
    }
  }

  // Write src/data/projects.json
  const outPath = path.join(V2_DIR, 'src', 'data', 'projects.json');
  fs.writeFileSync(outPath, JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`Successfully wrote ${projects.length} projects to ${outPath}`);

  // Write docs/content-gaps.md
  let gapsMd = `# Inks & Interfaces v2 — Content Gaps\n\n`;
  gapsMd += `> Generated per REDESIGN-PLAN §4.3. Brand rule: NEVER invent metrics, quotes, or founder names. Missing fields below default to \`null\` and their blocks are omitted in templates until real client data is supplied.\n\n`;
  gapsMd += `| # | Slug | Project | Missing Fields |\n`;
  gapsMd += `|---|---|---|---|\n`;
  contentGaps.forEach((g, i) => {
    gapsMd += `| ${i + 1} | \`${g.slug}\` | **${g.name}** | ${g.missing.join(', ')} |\n`;
  });
  gapsMd += `\n\n## Action items for launch:\n`;
  gapsMd += `- Request founder metrics/conversion stats for projects with empty \`results\`\n`;
  gapsMd += `- Verify Sakhi's full bio and surname for ID cards\n`;

  const gapsPath = path.join(V2_DIR, 'docs', 'content-gaps.md');
  fs.writeFileSync(gapsPath, gapsMd, 'utf-8');
  console.log(`Successfully wrote content gaps to ${gapsPath}`);

  // Print summary table
  console.log('\n--- Project Extraction Summary ---');
  console.table(projects.map(p => ({
    slug: p.slug,
    images: p.gallery.length,
    hasFounder: !!p.founder,
    resultsCount: p.results.length,
    hasQuote: !!p.quote,
    featured: p.featured,
    isConcept: p.isConcept
  })));
}

extract().catch(console.error);
